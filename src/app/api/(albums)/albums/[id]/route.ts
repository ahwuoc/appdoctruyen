// app/api/albums/[id]/route.js
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";
import { mapAlbumData, RawAlbumFromSupabase } from "@/utils/common/mappers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("albums")
    .select(
      `
      *,
      album_categories (
        category_id,
        categories (
          title
        )
      ),
      chapters (
        id,
        title,
        views,
        created_at,
        order_sort
      )
    `
    )
    .eq("id", id)
    .single();
  if (error) {
    return NextResponse.json(
      { error: "Không thể lấy album", details: error.message },
      { status: 500 }
    );
  }
  if (!data) {
    return NextResponse.json(
      { error: "Không tìm thấy album với id này" },
      { status: 404 }
    );
  }
  const formattedData = mapAlbumData(data as RawAlbumFromSupabase);
  return NextResponse.json(formattedData, { status: 200 });
}
