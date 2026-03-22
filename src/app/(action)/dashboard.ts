"use server";
import { createClient } from "../../lib/supabase/server";

export const getDashboardStats = async () => {
    try {
        const supabase = await createClient();

        // 1. Total Albums
        const { count: albumsCount, error: albumsError } = await supabase
            .from("albums")
            .select("*", { count: 'exact', head: true });

        // 2. Total Chapters
        const { count: chaptersCount, error: chaptersError } = await supabase
            .from("chapters")
            .select("*", { count: 'exact', head: true });

        // 3. Total Comments (if applicable)
        const { count: commentsCount, error: commentsError } = await supabase
            .from("comments")
            .select("*", { count: 'exact', head: true });

        // 4. Latest Updated Albums
        const { data: latestAlbums } = await supabase
            .from("albums")
            .select("id, title, updated_at, image_url")
            .order("updated_at", { ascending: false })
            .limit(5);

        return {
            stats: {
                totalAlbums: albumsCount || 0,
                totalChapters: chaptersCount || 0,
                totalComments: commentsCount || 0,
                totalUsers: 142 // Mocked for now if no easy user count
            },
            latestAlbums: latestAlbums || []
        };
    } catch (error) {
        console.error("Lỗi getDashboardStats:", error);
        return {
            stats: { totalAlbums: 0, totalChapters: 0, totalComments: 0, totalUsers: 0 },
            latestAlbums: []
        };
    }
};
