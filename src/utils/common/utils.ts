import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import slugify from "slugify";
import { NextResponse } from "next/server";
import { STATUS_Response } from "../types/status";
import { supabase } from "../../lib/supabase/supabaseClient";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(time: string | Date): string {
  if (!time) return "Đang cập nhật";

  const parsedTime = typeof time === "string" ? new Date(time) : time;

  if (isNaN(parsedTime.getTime())) return "Thời gian không hợp lệ";
  return formatDistanceToNow(parsedTime, { addSuffix: true, locale: vi });
}

export function createSlug(name: string) {
  const slug = slugify(name, {
    lower: true,
    strict: true,
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

type ResponseType = {
  status: STATUS_Response;
  data?: unknown;
  message?: string;
};

export const Response = ({ status, data, message }: ResponseType) => {
  return NextResponse.json(
    { message: message, data: data },
    { status: status }
  );
};
export const getAuthentication = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }
  return session;
};
