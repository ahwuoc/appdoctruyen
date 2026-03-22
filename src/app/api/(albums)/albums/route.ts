import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mapAlbumData, RawAlbumFromSupabase } from "@/app/utils/common/mappers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const supabase = await createClient();

  try {
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
          *,
          chapter_images!chapter_images_chapter_id_fkey (*)
        )
      `
      )
      .order("updated_at", { ascending: false });

    if (query) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,content.ilike.%${query}%`
      );
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      return NextResponse.json(
        { message: `Lỗi: ${error.message}` },
        { status: 500 }
      );
    }

    // Map dữ liệu cho từng album trong danh sách
    const formattedData = (data as RawAlbumFromSupabase[]).map(album => mapAlbumData(album));

    return NextResponse.json(formattedData);
  } catch (err: any) {
    return NextResponse.json(
      { message: `Lỗi bất ngờ: ${err.message}` },
      { status: 500 }
    );
  }
}
