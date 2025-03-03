import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { AlbumType } from '@/lib/type';
import { Database } from '@/types/supabase';

export type RawAlbumFromSupabase = Database['public']['Tables']['albums']['Row'] & {
  album_categories: (Database['public']['Tables']['album_categories']['Row'] & {
    categories: Database['public']['Tables']['categories']['Row'];
  })[];
  chapters: Database['public']['Tables']['chapters']['Row'][];
};

type toNull<T> = {
  [K in keyof T]: T[K] extends string ? string | null : T[K];
};

type ConvertPartial<T> = {
  [K in keyof T]: T[K] extends (infer U)[] ? Partial<U>[] : T[K];
};

type AlbumConvert = ConvertPartial<toNull<AlbumType>>;

const mapAlbumData = (album: RawAlbumFromSupabase): AlbumConvert => ({
  id: album.id,
  title: album.title,
  image_url: album.image_url,
  chapters: album.chapters.map((chapter) => ({
    id: chapter.id,
    name: chapter.title,
    view: chapter.views ?? 0,
    created_at: chapter.created_at, 
    sort_order: chapter.order_sort,
  })),
  content: album.content,
  categories: album.album_categories.map((cat) => ({
    id: cat.category_id,
    name: cat.categories.title,
  })),
  created_at: album.created_at,
  updated_at: album.updated_at,
});

type Slug = 'new' | 'hot';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; pageNumber: string } }
) {
  const { slug, pageNumber } = params;

  if (slug !== 'new' && slug !== 'hot') {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const page = parseInt(pageNumber, 10);
  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
  }

  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  let query = supabase
    .from('albums')
    .select(`
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
    `)
    .order('created_at', { ascending: slug === 'new' });

  if (slug === 'new') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query = query.gte('created_at', thirtyDaysAgo.toISOString());
  }

  const { data, error } = await query.range(offset, offset + itemsPerPage - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let countQuery = supabase
    .from('albums')
    .select('*', { count: 'exact', head: true });

  if (slug === 'new') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    countQuery = countQuery.gte('created_at', thirtyDaysAgo.toISOString());
  }

  const { count, error: countError } = await countQuery;

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const formattedData = (data || []).map(mapAlbumData);

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