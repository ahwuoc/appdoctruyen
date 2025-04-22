"use server";
import { supabase } from "../../lib/supabase/supabaseClient";
import { buildCommentTree } from "../components/commentree";
export interface Comment {
  id: string;
  parent_id: string;
  chapter_id: number;
  content: string;
  replies?: Comment[];
  profiles?: {
    username: string;
    avatar_url: string;
  }[];
}

export const getCommentAlbumId = async (id: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .or(`album_id.eq.${id}`);

  if (error) {
    throw error;
  }

  return data as Comment[];
};

export const getComment_ChapterId = async (chapterId: number) => {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      parent_id,
      chapter_id,
      user_id,
      profiles!inner (
        username,
        avatar_url
      )
    `
    )
    .or(`chapter_id.eq.${chapterId}`);

  if (error) {
    console.error("🔥 Lỗi Supabase:", error);
    throw error;
  }
  return buildCommentTree(data as Comment[]);
};
