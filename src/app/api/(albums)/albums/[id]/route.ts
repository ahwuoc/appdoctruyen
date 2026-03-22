// app/api/albums/[id]/route.js
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // Đổi sang Server Client
import { mapAlbumData, RawAlbumFromSupabase } from "@/app/utils/common/mappers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Thêm Promise cho Next.js 15
) {
  const { id } = await params;
  const supabase = await createClient(); // Khởi tạo Server Client

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
        *,
        chapter_images!chapter_images_chapter_id_fkey (
          *
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Lỗi lấy album API:", error.message);
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
