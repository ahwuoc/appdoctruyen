"use client";

import React, { useState, useCallback, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaReply, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MessageSquare, Heart, Share2, Send, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "../../lib/supabase/supabaseClient";
import { Comment, getComment_ChapterId } from "../(action)/comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Interface for parameters
interface SendMessageParams {
  chapter_id: number;
  content: string;
  parent_id?: string;
}

interface TreeCommentProps {
  comments: Comment[];
  onComment: (params: SendMessageParams) => Promise<void>;
  depth?: number;
}

// Send comment to Supabase
const sendMessage = async ({ chapter_id, content, parent_id }: SendMessageParams) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.warn("Bạn cần đăng nhập để bình luận!");
    return null;
  }

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        user_id: user.id,
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

const TreeComment: React.FC<TreeCommentProps> = ({ comments, onComment, depth = 0 }) => {
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyMessages, setReplyMessages] = useState<Record<string, string>>({});
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});

  const toggleReplies = (commentId: string) => {
    setOpenReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <div className="space-y-6">
      {comments.map((comment) => {
        const profile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
        const hasReplies = comment.replies && comment.replies.length > 0;
        const isOpen = openReplies[comment.id];

        return (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex flex-col gap-4 ${depth > 0 ? "ml-4 md:ml-10" : ""}`}
          >
            <div className="flex gap-4">
              <Avatar className="w-10 h-10 border border-white/10 ring-2 ring-blue-500/20 shadow-lg shrink-0">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-white/5 text-gray-400">
                  {profile?.username?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 shadow-inner">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-blue-400 text-sm">{profile?.username || "Ẩn danh"}</span>
                    <span className="text-[10px] text-gray-500 font-medium">1 giờ trước</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>

                <div className="flex items-center gap-6 px-2 text-xs text-gray-500">
                  <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                    <Heart className="w-3 h-3" />
                    Thích
                  </button>
                  <button
                    onClick={() => setReplyId(replyId === comment.id ? null : comment.id)}
                    className={`flex items-center gap-2 transition-colors ${replyId === comment.id ? "text-blue-400" : "hover:text-blue-400"}`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    Trình trả lời
                  </button>
                  <button className="flex items-center gap-2 hover:text-gray-300">
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                </div>

                <AnimatePresence>
                  {replyId === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-2 px-2"
                    >
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            autoFocus
                            placeholder={`Trả lời @${profile?.username}...`}
                            onChange={(e) => setReplyMessages((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                            value={replyMessages[comment.id] || ""}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500/50 transition-all pr-12"
                          />
                          <button
                            onClick={() => {
                              if (!replyMessages[comment.id]) return;
                              onComment({
                                chapter_id: comment.chapter_id,
                                content: replyMessages[comment.id]!,
                                parent_id: comment.id
                              });
                              setReplyMessages((prev) => ({ ...prev, [comment.id]: "" }));
                              setReplyId(null);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-500"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setReplyId(null)}>Hủy</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {hasReplies && (
                  <div className="pt-2">
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="text-xs font-bold text-gray-500 hover:text-gray-300 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full transition-all"
                    >
                      <div className="w-6 h-px bg-white/10" />
                      {isOpen ? (
                        <><FaChevronUp className="text-[10px]" /> Ẩn phản hồi</>
                      ) : (
                        <><FaChevronDown className="text-[10px]" /> Xem thêm {comment.replies!.length} câu trả lời</>
                      )}
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {isOpen && comment.replies && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden border-l border-white/5 mt-4"
                    >
                      <TreeComment comments={comment.replies} onComment={onComment} depth={depth + 1} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Main Component
const CommentComponents: React.FC<{ params: { chapter_id?: number; }; }> = ({ params }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [messages, setMessages] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<{ username: string; avatar_url: string; } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single();
        if (profile) setUserProfile(profile);
      }
    };
    fetchUser();
  }, []);

  const fetchComments = useCallback(async () => {
    if (params.chapter_id) {
      setLoading(true);
      try {
        const commentTree = await getComment_ChapterId(params.chapter_id);
        setComments(commentTree);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [params.chapter_id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleMessages = useCallback(async ({ chapter_id, content, parent_id }: SendMessageParams) => {
    if (!content.trim()) return;
    await sendMessage({ chapter_id, content, parent_id });
    await fetchComments();
  }, [fetchComments]);

  return (
    <div className="w-full space-y-10">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <MessageSquare className="text-blue-500 w-5 h-5" />
          Bình luận
          <span className="text-sm font-normal text-gray-500">({comments.length})</span>
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-gray-500 text-xs">Mới nhất</Button>
          <Button variant="ghost" size="sm" className="text-gray-500 text-xs">Phổ biến</Button>
        </div>
      </div>

      {/* Main Comment Input */}
      <div className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/10">
        <Avatar className="w-12 h-12 shadow-xl shrink-0">
          <AvatarImage src={userProfile?.avatar_url} />
          <AvatarFallback className="bg-white/10 text-gray-500">
            {userProfile?.username?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <Textarea
            value={messages}
            onChange={(e) => setMessages(e.target.value)}
            placeholder="Chia sẻ suy nghĩ của bạn về chương này..."
            className="w-full min-h-[100px] bg-transparent border-none focus-visible:ring-0 text-gray-200 resize-none px-0 py-1"
          />
          <div className="flex justify-between items-center border-t border-white/5 pt-3">
            <div className="flex gap-2 text-gray-500">
              {/* Add emojis or image attachment icon later */}
            </div>
            <Button
              size="sm"
              disabled={!messages.trim()}
              onClick={() => {
                handleMessages({ chapter_id: params.chapter_id!, content: messages });
                setMessages("");
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6"
            >
              Gửi bình luận
            </Button>
          </div>
        </div>
      </div>

      {/* Comment List */}
      <div className="py-2">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-1/4 h-4 bg-white/5 animate-pulse rounded" />
                  <div className="w-full h-16 bg-white/5 animate-pulse rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          params.chapter_id !== undefined && (
            <TreeComment comments={comments} onComment={handleMessages} />
          )
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <MessageSquare className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentComponents;
