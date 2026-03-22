import { supabase } from "@/lib/supabase/supabaseClient";
import { convertToWebP } from "@/app/utils/common/image-optimizer";

/**
 * Uploads a chapter image to the storage bucket, optimizing it to WebP first.
 * WebP can be 30-50% smaller in file size than JPG/PNG with similar quality.
 */
export const uploadChapterImageClient = async (file: File, bucket = "album-images") => {
    let uploadFile: File | Blob = file;
    let fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}`;

    try {
        if (file.type.startsWith("image/")) {
            uploadFile = await convertToWebP(file, 0.7);
            fileName = `${fileName}.webp`;
        } else {
            const fileExt = file.name.split('.').pop();
            fileName = `${fileName}.${fileExt}`;
        }
    } catch (error) {
        console.error("Optimization failed, uploading original:", error);
        const fileExt = file.name.split('.').pop();
        fileName = `${fileName}.${fileExt}`;
    }

    const filePath = `chapters/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, uploadFile, {
            contentType: uploadFile instanceof Blob ? 'image/webp' : undefined,
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) {
        throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
};
