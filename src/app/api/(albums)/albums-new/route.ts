import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mapAlbumData, RawAlbumFromSupabase } from "@/app/utils/common/mappers";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
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
    .order("id", { ascending: false })
    .limit(16);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Chuyển đổi dữ liệu chuẩn cho Frontend
  const formattedData = (data as RawAlbumFromSupabase[]).map(album => mapAlbumData(album));

  return NextResponse.json(formattedData);
}
