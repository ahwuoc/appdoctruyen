"use server";
import { mapAlbumData, RawAlbumFromSupabase } from "../utils/common/mappers";
import { createClient } from "../../lib/supabase/server";
import { AlbumInput, albumSchema } from "../../lib/schema/schema-album";

const getCurrentUserSession = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role || "USER";
  return { user, role, supabase };
};

export const getAlbumTopChapters = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("albums").select(
    `
        id,
        title,
        image_url,
        chapters (
          id
        )
      `
  );

  if (error) {
    console.error("Lỗi lấy dữ liệu albums:", error.message);
    return [];
  }
  const albumsWithChapterCount = data
    .map((album) => {
      return {
        ...album,
        chapterCount: album.chapters.length,
      };
    })
    .sort((a, b) => b.chapterCount - a.chapterCount)
    .map((album, index) => ({
      ...album,
      rank: index + 1,
    }));
  return albumsWithChapterCount;
};

export const getALbumsTopViews = async () => {
  const supabase = await createClient();
  const supabaseQuery = supabase
    .from("albums")
    .select(
      `
        id,title,image_url,chapters(
        id,title,views
        )
        `
    )
    .order("id");
  const { data, error } = await supabaseQuery;
  if (error) {
    throw new Error(error.message);
  }
  const albumsWithViews = data
    .map((album) => {
      const totalViews = album.chapters.reduce(
        (sum: number, chapter: { views: number }) => sum + (chapter.views || 0),
        0
      );
      return {
        id: album.id,
        title: album.title,
        image_url: album.image_url,
        views: totalViews,
      };
    })
    .filter((album) => album.views > 0)
    .sort((a, b) => b.views - a.views)
    .map((album, index) => ({
      ...album,
      rank: index + 1,
    }));
  return albumsWithViews;
};

export const getAlbums = async () => {
  const { user, role, supabase } = await getCurrentUserSession();

  let supabaseQuery = supabase
    .from("albums")
    .select(
      `
            *,
            album_categories (
                category_id,
                categories (title)
            ),
            chapters (
                id,
                title
            )
        `
    )
    .order("updated_at", { ascending: false });

  if (role === "AUTHOR" && user) {
    supabaseQuery = supabaseQuery.eq("author_id", user.id);
  }

  const { data, error } = await supabaseQuery;
  if (error) {
    console.error("Error fetching albums:", error);
    throw new Error(error.message);
  }
  const formattedData = data.map((album) =>
    mapAlbumData(album as RawAlbumFromSupabase)
  );
  return formattedData;
};

export const getAlbumId = async (id: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .select(
      `
                *,
                chapters (
                    *,
                    chapter_images!chapter_images_chapter_id_fkey(*)  
                )
            `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Lỗi lấy album:", error.message);
    return null;
  }
  return data;
};

export const ImageUpload = async (image: File): Promise<string | undefined> => {
  const supabase = await createClient();
  const bucketName = "album-images";
  const filePath = `public/${Date.now()}_${image.name}`; // Thêm timestamp để tránh trùng file
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, image, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) {
      console.error("Upload error:", error.message);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    const publicUrl = urlData?.publicUrl;
    if (!publicUrl) throw new Error("Failed to retrieve public URL");
    return publicUrl;
  } catch (error) {
    console.error("Lỗi tải ảnh lên:", error);
    throw error;
  }
};

const safeParseAlbum = (album: AlbumInput) => {
  const parseResult = albumSchema.safeParse(album);

  if (!parseResult.success) {
    throw new Error(`Dữ liệu không hợp lệ ${parseResult.error.message}`);
  }
  return parseResult.data;
};

export const PostAlbum = async (album: AlbumInput) => {
  try {
    const { user, supabase } = await getCurrentUserSession();
    if (!user) throw new Error("Vui lòng đăng nhập.");

    const validatedAlbum = safeParseAlbum(album);
    if (!validatedAlbum.imageFile || !(validatedAlbum.imageFile instanceof File)) {
      throw new Error("Ảnh không hợp lệ hoặc không được cung cấp.");
    }
    const publicUrl = await ImageUpload(validatedAlbum.imageFile);

    const { data, error } = await supabase
      .from("albums")
      .insert([
        {
          title: validatedAlbum.title,
          content: validatedAlbum.content ?? null,
          image_url: publicUrl,
          author_id: user.id, // TỰ ĐỘNG GÁN AUTHOR_ID KHI TẠO MỚI
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    const albumId = data?.id;
    if (validatedAlbum.categoryIds?.length > 0) {
      const categoryRows = validatedAlbum.categoryIds.map((categoryId) => ({
        album_id: albumId,
        category_id: categoryId,
      }));

      await supabase.from("album_categories").insert(categoryRows);
    }
    console.log("✅ Thêm truyện thành công!");
    return data;
  } catch (error: any) {
    console.error("Lỗi trong quá trình đăng album:", error.message);
    return null;
  }
};

export const UpdateAlbum = async (id: number, data: AlbumInput) => {
  try {
    const { supabase } = await getCurrentUserSession();
    const validatedAlbum = safeParseAlbum(data);
    let newImageUrl: string | undefined;

    if (validatedAlbum.imageFile) {
      if (!(validatedAlbum.imageFile instanceof File)) {
        throw new Error("File ảnh không hợp lệ.");
      }

      const { data: currentAlbum } = await supabase
        .from("albums")
        .select("image_url")
        .eq("id", id)
        .single();

      if (currentAlbum?.image_url) {
        const oldImageUrlParts = currentAlbum.image_url.split("/");
        const oldFileName = oldImageUrlParts[oldImageUrlParts.length - 1];

        if (oldFileName) {
          await supabase.storage
            .from("album-images")
            .remove([`public/${oldFileName}`]);
        }
      }
      newImageUrl = await ImageUpload(validatedAlbum.imageFile);
    }

    const { error } = await supabase
      .from("albums")
      .update({
        title: validatedAlbum.title,
        content: validatedAlbum.content ?? null,
        image_url: newImageUrl,
        status: validatedAlbum.status, // Cập nhật trạng thái (PENDING, PUBLISHED, etc.)
      })
      .eq("id", id); // RLS SẼ CHẶN NẾU KHÔNG PHẢI CHỈNH SỬA TRUYỆN CỦA MÌNH

    if (error) throw new Error(error.message);

    if (validatedAlbum.categoryIds) {
      await supabase.from("album_categories").delete().eq("album_id", id);
      const categoryData = validatedAlbum.categoryIds.map((category_id) => ({
        album_id: id,
        category_id,
      }));
      await supabase.from("album_categories").insert(categoryData);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Lỗi khi cập nhật album:", error.message);
    throw error;
  }
};

export const DeleteAlbum = async (id: number) => {
  try {
    const { supabase } = await getCurrentUserSession();
    const { data: album } = await supabase
      .from("albums")
      .select("image_url")
      .eq("id", id)
      .single();

    if (album?.image_url) {
      const fileName = album.image_url.split("/").pop();
      if (fileName) {
        await supabase.storage.from("album-images").remove([`public/${fileName}`]);
      }
    }

    const { error } = await supabase.from("albums").delete().eq("id", id);
    if (error) throw new Error(error.message);

    return { success: true };
  } catch (error: any) {
    console.error("Lỗi xóa album:", error.message);
    return { success: false };
  }
};
