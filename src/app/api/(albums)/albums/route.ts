import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

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
          id,
          title
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
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { message: `Lỗi bất ngờ: ${err.message}` },
      { status: 500 }
    );
  }
}
