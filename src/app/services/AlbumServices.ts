import { supabase } from "../../lib/supabase/supabaseClient";
import { mapAlbumData, RawAlbumFromSupabase } from "../utils/common/mappers";
import { AlbumType, CategoryType } from "../utils/types/type";

interface FetchAlbumDataResponse {
  albums: AlbumType[];
  maxViews: number;
  maxFollowers: number;
  categories: CategoryType[];
}

interface SelectCategory {
  id: number;
  title: string;
}

export const albumsAdvanced = async (): Promise<RawAlbumFromSupabase[]> => {
  const { data, error } = await supabase.from("albums").select(`
      *,
      album_categories (
        category_id,
        categories (title)
      ),
      chapters (
        id,
        title,
        views,
        created_at,
        order_sort
      )
    `);

  if (error) throw error;
  return data ?? [];
};

export const fetchAlbumData = async (): Promise<FetchAlbumDataResponse> => {
  const queryAlbums = await albumsAdvanced();
  const formattedData = ((queryAlbums as RawAlbumFromSupabase[]) || []).map(
    mapAlbumData
  );

  const viewsResponse = await supabase
    .from("chapters")
    .select("views")
    .order("views", { ascending: false })
    .limit(1)
    .single();
  if (viewsResponse.error) throw viewsResponse.error;

  const followersResponse = await supabase.rpc("get_most_followed_album");
  if (followersResponse.error) throw followersResponse.error;

  const categoriesResponse = await supabase
    .from("categories")
    .select("*")
    .limit(14);
  if (categoriesResponse.error) throw categoriesResponse.error;

  return {
    albums: formattedData as AlbumType[],
    maxViews: viewsResponse.data.views,
    maxFollowers: followersResponse.data.follower_count,
    categories: categoriesResponse.data,
  };
};

export const fetchFilteredAlbums = async ({
  selectedCategories,
  rangeViews,
  maxViews,
  rangeFollower,
  maxFollowers,
  searchTerm,
}: {
  selectedCategories: SelectCategory[];
  rangeViews: [number, number];
  maxViews: number;
  rangeFollower: [number, number];
  maxFollowers: number;
  searchTerm: string;
}): Promise<AlbumType[]> => {
  let query = supabase.from("albums").select(`
      *,
      album_categories (
        category_id,
        categories (title)
      ),
      chapters (
        id,
        title,
        views,
        created_at,
        order_sort
      )
    `);

  if (selectedCategories.length > 0) {
    query = query.in(
      "album_categories.category_id",
      selectedCategories.map((c) => c.id)
    );
  }

  if (rangeViews[0] > 0 || rangeViews[1] < maxViews) {
    query = query
      .gte("chapters.views", rangeViews[0])
      .lte("chapters.views", rangeViews[1]);
  }

  if (rangeFollower[0] > 0 || rangeFollower[1] < maxFollowers) {
    query = query
      .gte("followers", rangeFollower[0])
      .lte("followers", rangeFollower[1]);
  }

  if (searchTerm.trim() !== "") {
    query = query.ilike("title", `%${searchTerm}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((album) => ({
    ...album,
    title: album.title ?? "No Title",
  }));
};
