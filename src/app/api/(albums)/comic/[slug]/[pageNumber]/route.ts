import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";
import { mapAlbumData, RawAlbumFromSupabase } from "@/app/utils/common/mappers";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; pageNumber: string } }
) {
  const { slug, pageNumber } = params;

  if (slug !== "new" && slug !== "hot") {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const page = parseInt(pageNumber, 10);
  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  const itemsPerPage = 20;
  const offset = (page - 1) * itemsPerPage;

  let query = supabase
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
        title,
        views,
        created_at,
        order_sort
      )
    `
    )
    .order("created_at", { ascending: slug === "new" });

  if (slug === "new") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query = query.gte("created_at", thirtyDaysAgo.toISOString());
  }

  const { data, error } = await query.range(offset, offset + itemsPerPage - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let countQuery = supabase
    .from("albums")
    .select("*", { count: "exact", head: true });

  if (slug === "new") {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    countQuery = countQuery.gte("created_at", thirtyDaysAgo.toISOString());
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const formattedData = ((data as RawAlbumFromSupabase[]) || []).map(
    mapAlbumData
  );

  return NextResponse.json({
    slug,
    pageNumber: page,
    data: formattedData,
    pagination: {
      currentPage: page,
      itemsPerPage,
      totalItems,
      totalPages,
    },
  });
}
