import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import slugify from "slugify";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(time: string | number |undefined| Date): string {
  if (time === null || time === undefined) {
    return "Đang cập nhật";
  }
  return formatDistanceToNow(new Date(time), { addSuffix: true, locale: vi });
}

export function createSlug(name:string){
     const slug = slugify(name,{
      lower:true,
      strict:true,
     });
     return slug;
}

export const getNumberSlug = (slug: string): number | null => {
  if (!slug) {
    return null;
  }
  const parts = slug.split("-");
  const id = Number(parts.pop());
  if (isNaN(id)) {
    return null;
  }
  return id;
};