"use server";
import { createClient } from "../../lib/supabase/server";
import { ChapterInput } from "../../lib/schema/schema-chapter";
import { ImageUpload } from "./album";

export const getAlbumChapters = async (albumId: number) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("chapters")
        .select(`
            *,
            chapter_images!chapter_images_chapter_id_fkey(*)
        `)
        .eq("album_id", albumId)
        .order("order_sort", { ascending: true });

    if (error) {
        console.error("Lỗi lấy chapters:", error.message);
        return [];
    }
    return data;
};

export const PostChapter = async (albumId: number, data: ChapterInput) => {
    try {
        const supabase = await createClient();
        const { data: chapter, error: chapterError } = await supabase
            .from("chapters")
            .insert([
                {
                    album_id: albumId,
                    title: data.title,
                    content: data.content ?? "",
                    order_sort: data.order_sort ?? 0,
                    views: 0
                }
            ])
            .select()
            .single();

        if (chapterError) throw new Error(chapterError.message);

        if (data.imageUrls && data.imageUrls.length > 0) {
            await AddImagesToChapter(chapter.id, data.imageUrls);
        }

        return chapter;
    } catch (error: any) {
        console.error("Lỗi PostChapter:", error.message);
        return null;
    }
};

export const UpdateChapterDetails = async (id: number, details: { title: string; content?: string; order_sort?: number; imageUrls?: string[] }) => {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from("chapters")
            .update({
                title: details.title,
                content: details.content,
                order_sort: details.order_sort
            })
            .eq("id", id);

        if (error) throw new Error(error.message);

        // If new image URLs are provided, add them
        if (details.imageUrls && details.imageUrls.length > 0) {
            await AddImagesToChapter(id, details.imageUrls);
        }

        return { success: true };
    } catch (error: any) {
        console.error("Lỗi UpdateChapterDetails:", error.message);
        return { success: false };
    }
};

export const DeleteChapter = async (id: number) => {
    try {
        const supabase = await createClient();
        // 1. Get image URLs to delete from storage
        const { data: images } = await supabase.from("chapter_images").select("image_url").eq("chapter_id", id);

        if (images && images.length > 0) {
            const fileNames = images.map(img => img.image_url.split("/").pop()).filter(Boolean) as string[];
            if (fileNames.length > 0) {
                await supabase.storage.from("album-images").remove(fileNames.map(name => `public/${name}`));
            }
        }

        const { error } = await supabase.from("chapters").delete().eq("id", id);
        if (error) throw new Error(error.message);
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi DeleteChapter:", error.message);
        return { success: false };
    }
};

export const UpdateChapterOrder = async (chapters: { id: number, order_sort: number }[]) => {
    try {
        const supabase = await createClient();
        const updates = chapters.map(ch => (
            supabase.from("chapters").update({ order_sort: ch.order_sort }).eq("id", ch.id)
        ));
        await Promise.all(updates);
        return { success: true };
    } catch (error: any) {
        console.error("Lỗi UpdateChapterOrder:", error.message);
        return { success: false };
    }
};

export const AddImagesToChapter = async (chapterId: number, imageUrls: string[]) => {
    try {
        const supabase = await createClient();
        const { data: currentImages } = await supabase
            .from("chapter_images")
            .select("order_sort")
            .eq("chapter_id", chapterId)
            .order("order_sort", { ascending: false })
            .limit(1);

        const startOrder = (currentImages && currentImages.length > 0 && currentImages[0]) ? (currentImages[0].order_sort ?? 0) + 1 : 1;

        const imageRows = imageUrls.map((url, index) => ({
            chapter_id: chapterId,
            image_url: url,
            order_sort: startOrder + index
        }));

        if (imageRows.length > 0) {
            const { error } = await supabase.from("chapter_images").insert(imageRows);
            if (error) throw new Error(error.message);
        }

        return { success: true };
    } catch (error: any) {
        console.error("Lỗi AddImagesToChapter:", error.message);
        return { success: false };
    }
};

export const DeleteImage = async (id: number, imageUrl: string) => {
    try {
        const supabase = await createClient();
        const fileName = imageUrl.split("/").pop();
        if (fileName) {
            await supabase.storage.from("album-images").remove([`public/${fileName}`]);
        }
        const { error } = await supabase.from("chapter_images").delete().eq("id", id);
        if (error) throw new Error(error.message);

        return { success: true };
    } catch (error: any) {
        console.error("Lỗi DeleteImage:", error.message);
        return { success: false };
    }
};
