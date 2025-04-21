"use client";
import React, { useState, useCallback } from "react";
import { IoSend } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaReply } from "react-icons/fa";
import { supabase } from "../../lib/supabase/supabaseClient";
import { Comment, getComment_ChapterId } from "../(action)/comment";
import LeaderLine from "leader-line";

// Interface cho props của các component
interface SendMessageParams {
  chapter_id: number;
  content: string;
  parent_id?: string;
}

interface TreeCommentProps {
  comments: Comment[];
  onComment: (params: SendMessageParams) => Promise<void>;
}

// Gửi comment lên Supabase
const sendMessage = async ({ chapter_id, content, parent_id }: SendMessageParams) => {
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

const TreeComment: React.FC<TreeCommentProps> = ({ comments, onComment }) => {
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyMessages, setReplyMessages] = useState<Record<string, string>>({});
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({}); // State để kiểm soát mở/đóng

  const handleReplyChange = (commentId: string, value: string) => {
    setReplyMessages((prev) => ({ ...prev, [commentId]: value }));
  };

  const toggleReplies = (commentId: string) => {
    setOpenReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
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
                <FaReply onClick={() => setReplyId(comment.id)} className="absolute right-2 top-[50%] translate-y-[-50%] cursor-pointer" />
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
                  onClick={() => {
                    onComment({ chapter_id: comment.chapter_id, content: replyMessages[comment.id]!, parent_id: comment.id });
                    setReplyMessages((prev) => ({ ...prev, [comment.id]: "" }));
                    setReplyId(null);
                  }}
                  className="flex z-10 absolute top-50 translate-x-[50%] cursor-pointer right-5 justify-center items-center"
                />
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <span
                onClick={() => toggleReplies(comment.id)}
                className="text-color_white text-sm ml-12 hover:underline"
              >
                {openReplies[comment.id] ? "Ẩn phản hồi" : `Xem phản hồi (${comment.replies.length})`}
              </span>
            )}

            {openReplies[comment.id] && comment.replies && (
              <div className="pl-10 text-white">
                <TreeComment comments={comment.replies} onComment={onComment} />
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};


// Component chính
const CommentComponents: React.FC<{ params: { chapter_id?: number; }; }> = ({ params }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [messages, setMessages] = useState<string>("");

  React.useEffect(() => {
    const fetchComments = async () => {
      if (params.chapter_id) {
        const commentTree = await getComment_ChapterId(params.chapter_id);
        setComments(commentTree);
      }
    };
    fetchComments();
  }, [params]);

  const handleMessages = useCallback(async ({ chapter_id, content, parent_id }: SendMessageParams) => {
    await sendMessage({ chapter_id, content, parent_id });
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
          onClick={() => {
            handleMessages({ chapter_id: params.chapter_id!, content: messages });
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
