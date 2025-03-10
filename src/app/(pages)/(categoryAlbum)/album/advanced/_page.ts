// app/story-advanced-filter/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { mapAlbumData } from "@/lib/mappers";
import StoryAdvancedFilter from "@/components/StoryAdvancedFilter";

// Server-side: Fetch dữ liệu ban đầu
async function fetchInitialData()
{
    const queryAlbums = await supabase.from("albums").select(`
    *,
    album_categories (
      category_id,
      categories (title)
    ),
    chapters (
      id, title, views, created_at, order_sort
    )
  `);
    const viewsResponse = await supabase
        .from("chapters")
        .select("views")
        .order("views", { ascending: false })
        .limit(1)
        .single();
    const followersResponse = await supabase.rpc("get_most_followed_album");
    const categoriesResponse = await supabase.from("categories").select("*").limit(14);

    if (queryAlbums.error || viewsResponse.error || followersResponse.error || categoriesResponse.error) {
        throw new Error("Failed to fetch initial data");
    }

    return {
        albums: (queryAlbums.data || []).map(mapAlbumData),
        maxViews: viewsResponse.data.views,
        maxFollowers: followersResponse.data.follower_count,
        categories: categoriesResponse.data,
    };
}

// Server Action: Xử lý lọc dữ liệu
export async function filterAlbums({ selectedCategories, rangeViews, rangeFollower, searchTerm, maxViews, maxFollowers })
{
    "use server";
    let query = supabase.from("albums").select(`
    *,
    album_categories (
      category_id,
      categories (title)
    ),
    chapters (
      id, title, views, created_at, order_sort
    )
  `);

    if (selectedCategories.length > 0) {
        query = query.in("album_categories.category_id", selectedCategories.map((c) => c.id));
    }
    if (rangeViews[0] > 0 || rangeViews[1] < maxViews) {
        query = query.gte("chapters.views", rangeViews[0]).lte("chapters.views", rangeViews[1]);
    }
    if (rangeFollower[0] > 0 || rangeFollower[1] < maxFollowers) {
        query = query.gte("followers", rangeFollower[0]).lte("followers", rangeFollower[1]);
    }
    if (searchTerm.trim() !== "") {
        query = query.ilike("title", `%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(mapAlbumData);
}

// Server Component: Entry point
export default async function StoryAdvancedFilterPage()
{
    const { albums, maxViews, maxFollowers, categories } = await fetchInitialData();

    return (
        <StoryAdvancedFilter
      initialAlbums= { albums };
    initialMaxViews = { maxViews };
    initialMaxFollowers = { maxFollowers };
    initialCategories = { categories }
        />
  );
}