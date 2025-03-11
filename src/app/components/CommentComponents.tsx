"use client";
import React, { useState, useCallback } from "react";
import { IoSend } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaReply } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import { Comment, getComment_ChapterId } from '../(action)/comment';

const sendMessage = async (chapter_id: number, content: string, parent_id?: string) =>
{
  const user = await supabase.auth.getUser();
  if (user.error || !user.data.user) {
    console.error("Lỗi lấy user hoặc user chưa đăng nhập:", user.error);
    return null;
  }

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        user_id: user.data.user.id,
        content,
        chapter_id,
        parent_id: parent_id ?? null,
      },
    ])
    .select("id");

  if (error) {
    console.error("Lỗi khi gửi comment:", error);
    return null;
  }

  return data;
};

const TreeComment = ({ comments, onComment }: { comments: Comment[]; onComment: (chapter_id: number, content: string, parent_id?: string) => Promise<void>; }) =>
{
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyMessages, setReplyMessages] = useState<Record<string, string>>({});

  const handleReplyChange = (commentId: string, value: string) =>
  {
    setReplyMessages((prev) => ({ ...prev, [commentId]: value }));
  };

  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="flex mt-2 gap-2 flex-col">
          <div className="flex flex-col gap-3">
            <div className="flex">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="bg-purple-700 text-white relative pr-4 w-full p-2 rounded-lg">
                <p>{comment.content}</p>
                <FaReply onClick={() => setReplyId(comment.id)} className="absolute right-2 top-[50%] translate-y-[-50%]" />
              </div>
            </div>
            {replyId === comment.id && (
              <div className="flex text-gray-700 relative border-none rounded-md px-2 items-center">
                <input
                  onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                  value={replyMessages[comment.id] || ""}
                  type="text"
                  className="w-full h-full p-2 pr-10 rounded-md outline-none"
                />
                <IoSend
                  onClick={() =>
                  {
                    onComment(comment.chapter_id, replyMessages[comment.id]!, comment.id);
                    setReplyMessages((prev) => ({ ...prev, [comment.id]: "" }));
                    setReplyId(null);
                  }}
                  className="flex z-10 absolute top-50 translate-x-[50%] cursor-pointer right-5 justify-center items-center"
                />
              </div>
            )}
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div className="pl-10 text-white">
              <TreeComment comments={comment.replies} onComment={onComment} />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

const CommentComponents = ({ params }: { params: { chapter_id?: number; }; }) =>
{
  const [comments, setComments] = useState<Comment[]>([]);
  const [messages, setMessages] = useState<string>("");

  React.useEffect(() =>
  {
    const fetchComments = async () =>
    {
      if (params.chapter_id) {
        const commentTree = await getComment_ChapterId(params.chapter_id);
        setComments(commentTree);
      }
    };
    fetchComments();
  }, [params]);

  const handleMessages = useCallback(async (chapter_id: number, content: string, parent_id?: string) =>
  {
    await sendMessage(chapter_id, content, parent_id);
    const updatedComments = await getComment_ChapterId(chapter_id);
    setComments(updatedComments);
  }, []);

  return (
    <div className="container mx-auto">
      <h2 className="text-white">Comments</h2>
      <div className="comment_input relative flex items-center">
        <input
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
          type="text"
          className="w-full h-full p-4 pr-10 rounded-md outline-none"
        />
        <IoSend
          onClick={() =>
          {
            handleMessages(params.chapter_id!, messages);
            setMessages("");
          }}
          className="flex z-10 absolute top-50 translate-x-[50%] cursor-pointer right-5 justify-center items-center"
        />
      </div>
      {params.chapter_id !== undefined && (
        <div className="container mx-auto p-4">
          <TreeComment comments={comments} onComment={handleMessages} />
        </div>
      )}
    </div>
  );
};

export default CommentComponents;
