"use server";
import { mapAlbumData, RawAlbumFromSupabase } from "../../utils/common/mappers";
import { supabase } from "../../lib/supabase/supabaseClient";
import { AlbumInput, albumSchema } from "../schema/schema-album";

export const getAlbumTopChapters = async () => {
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
  console.log(albumsWithViews);

  return albumsWithViews;
};
export const getAlbums = async () => {
  const supabaseQuery = supabase
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
  const bucketName = "album-images";
  const filePath = `public/${image.name}`;
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
  const { data: validatedAlbum } = parseResult;
  return parseResult.data;
};

export const PostAlbum = async (album: AlbumInput) => {
  try {
    const validatedAlbum = safeParseAlbum(album);
    if (
      !validatedAlbum.imageFile ||
      !(validatedAlbum.imageFile instanceof File)
    ) {
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
        },
      ])
      .select()
      .single();
    if (error) {
      console.error("L��i thêm album:", error.message);
    }
    const albumId = data?.id;
    if (validatedAlbum.categoryIds?.length > 0) {
      const categoryRows = validatedAlbum.categoryIds.map((categoryId) => ({
        album_id: albumId,
        category_id: categoryId,
      }));

      const { error: categoryError } = await supabase
        .from("album_categories")
        .insert(categoryRows);

      if (categoryError) {
        throw new Error(`Lỗi thêm danh mục: ${categoryError.message};`);
      }
    }
    console.log("✅ Thêm sản phẩm thành công:", data);
    return data;
  } catch (error) {
    console.error("Lỗi trong quá trình đăng album:", error);
    return null;
  }
};

export const UpdateAlbum = async (id: number, data: AlbumInput) => {
  try {
    const validatedAlbum = safeParseAlbum(data);
    let newImageUrl: string | undefined;

    if (validatedAlbum.imageFile) {
      if (!(validatedAlbum.imageFile instanceof File)) {
        throw new Error("File ảnh không hợp lệ.");
      }

      const { data: currentAlbum, error: fetchError } = await supabase
        .from("albums")
        .select("image_url")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw new Error(`Không tìm thấy album: ${fetchError.message}`);
      }
      newImageUrl = currentAlbum?.image_url;
      if (currentAlbum?.image_url) {
        const oldImageUrlParts = currentAlbum.image_url.split("/");
        const oldFileName = oldImageUrlParts[oldImageUrlParts.length - 1];

        if (oldFileName) {
          await supabase.storage
            .from("album-images")
            .remove([`public/${oldFileName}`]);
        }
        newImageUrl = await ImageUpload(validatedAlbum.imageFile);
      }
      newImageUrl = await ImageUpload(validatedAlbum.imageFile);
    }
    const { error } = await supabase
      .from("albums")
      .update({
        title: validatedAlbum.title,
        content: validatedAlbum.content ?? null,
        image_url: newImageUrl,
      })
      .eq("id", id);

    if (error) {
      throw new Error("Lỗi cập nhật album: " + error.message);
    }

    if (validatedAlbum.categoryIds) {
      await supabase.from("album_categories").delete().eq("album_id", id);
      const categoryData = validatedAlbum.categoryIds.map((category_id) => ({
        album_id: id,
        category_id,
      }));
      const { error: categoryError } = await supabase
        .from("album_categories")
        .insert(categoryData);

      if (categoryError) {
        throw new Error(`Lỗi cập nhật danh mục: ${categoryError.message}`);
      }
    }

    console.log("✅ Cập nhật album thành công!");
    return { success: true };
  } catch (error) {
    console.error("Lỗi khi cập nhật album:", error);
    throw error;
  }
};
