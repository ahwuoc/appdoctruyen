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

export type AlbumConvert = ConvertPartial<toNull<AlbumType>>;

export const mapAlbumData = (album: RawAlbumFromSupabase): AlbumConvert => ({
  id: album.id,
  title: album.title,
  image_url: album.image_url,
  chapters: album.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    view: chapter.views ?? 0,
    created_at: chapter.created_at,
    sort_order: chapter.order_sort,
  })),
  content: album.content,
  categories: album.album_categories.map((cat) => ({
    id: cat.category_id,
    title: cat.categories.title,
  })),
  created_at: album.created_at,
  updated_at: album.updated_at,
});