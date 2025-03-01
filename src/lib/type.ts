export interface AlbumType {
  id: number;
  title: string;
  follow: number;
  image_url: string;
  chapters?: ChapterType[];
  content: string;
  categories?: AlbumCategory[];
  is_active: boolean;
  created_at: string,
  updated_at: string,
  tags?: string[];
}
export interface  CategoryType {
  id: number;
  name: string;
  value:string;
    
}
export interface ChapterType {
  id: number;
  name: string;
  view: number;
  created_at: string;
  images?: ImageType[];
  sort_order: number,
}

export interface ImageType {
  id: number;
  image_path: string;
  sort_order: number,
}
export interface PaginatedProducts {
  data: AlbumType[];
  total: number;
  page: number;
  limit: number;
  per_page: number,
  current_page: number,
}



// ====
interface Category {
  title: string;
}

interface AlbumCategory {
  categories: Category;
  category_id: number;
}