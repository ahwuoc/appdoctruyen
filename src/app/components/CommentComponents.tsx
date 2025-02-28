"use client";
import React, { useState } from "react";
import { LuMessagesSquare } from "react-icons/lu";
import { IoSend } from "react-icons/io5";
import { CiFaceSmile } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Comment {
  id: number;
  name: string;
  avatar: string;
  content: string;
  children: Comment[];
  created_at: string;
  likes:number;
  dislikes:number;

}

type DropdownStates = Record<number, boolean>;
type ToggleDropdown = (id: number) => void;

const initialComments: Comment[] = [
  {
    id: 1,
    name: "Nguyễn Anh Quốc",
    avatar: "https://github.com/shadcn.png",
    content: "Bô này hay vãi lồn",
    created_at: "2025-01-28 21:09:22",
    likes: 10,
    dislikes: 2,
    children: [
      {
        id: 2,
        name: "Nguyễn Văn A",
        avatar: "https://github.com/shadcn.png",
        content: "Bình luận trả lời 1",
        created_at: "2025-01-28 21:09:22",
        likes: 5,
        dislikes: 1,
        children: [
          {
            id: 3,
            name: "Nguyễn Văn B",
            avatar: "https://github.com/shadcn.png",
            content: "Bình luận trả lời 1.1",
            created_at: "2025-01-28 21:09:22",
            likes: 3,
            dislikes: 0,
            children: [
              {
                id: 5,
                name: "Nguyễn Văn C",
                avatar: "https://github.com/shadcn.png",
                content: "Bình luận trả lời 1.1.1",
                created_at: "2025-01-28 21:09:22",
                likes: 7,
                dislikes: 0,
                children: [
                  {
                    id: 6,
                    name: "Nguyễn Văn D",
                    avatar: "https://github.com/shadcn.png",
                    content: "Bình luận trả lời 1.1.1.1",
                    created_at: "2025-01-28 21:09:22",
                    likes: 9,
                    dislikes: 1,
                    children: [
                      {
                        id: 7,
                        name: "Nguyễn Văn E",
                        avatar: "https://github.com/shadcn.png",
                        content: "Bình luận trả lời 1.1.1.1.1",
                        created_at: "2025-01-28 21:09:22",
                        likes: 4,
                        dislikes: 0,
                        children: [
                          {
                            id: 8,
                            name: "Nguyễn Văn F",
                            avatar: "https://github.com/shadcn.png",
                            content: "Bình luận trả lời 1.1.1.1.1.1",
                            created_at: "2025-01-28 21:09:22",
                            likes: 8,
                            dislikes: 1,
                            children: [
                              {
                                id: 9,
                                name: "Nguyễn Văn G",
                                avatar: "https://github.com/shadcn.png",
                                content: "Bình luận trả lời 1.1.1.1.1.1.1",
                                created_at: "2025-01-28 21:09:22",
                                likes: 6,
                                dislikes: 2,
                                children: [
                                  {
                                    id: 10,
                                    name: "Nguyễn Văn H",
                                    avatar: "https://github.com/shadcn.png",
                                    content: "Bình luận trả lời 1.1.1.1.1.1.1.1",
                                    created_at: "2025-01-28 21:09:22",
                                    likes: 3,
                                    dislikes: 0,
                                    children: [],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 4,
        name: "Nguyễn Văn C",
        avatar: "https://github.com/shadcn.png",
        content: "Bình luận trả lời 2",
        created_at: "2025-01-28 21:09:22",
        likes: 2,
        dislikes: 0,
        children: [],
      },
    ],
  },
];


const CommentComponents: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [dropdownStates, setDropdownStates] = useState<DropdownStates>({});
  const [showReply, setShowReply] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<Record<number, string>>({});

  const toggleDropdown: ToggleDropdown = (id) => {
    setDropdownStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReplyToggle = (id: number) => {
    setShowReply((prev) => (prev === id ? null : id));
  };

  const handleReply = (id: number, content: string) => {
    setReplyContent((prev) => ({
      ...prev,
      [id]: content,
    }));
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const newCommentObject: Comment = {
      id: comments.length + 1,
      name: "Người dùng mới",
      avatar: "https://github.com/shadcn.png",
      content: newComment,
      children: [],
      likes:1,
      dislikes:1,
      created_at: new Date().toISOString(),
    };
    setComments([...comments, newCommentObject]);
    setNewComment("");
  };

  const handleSubmitReply = (id: number) => {
    if (replyContent[id]?.trim() === "") return;

    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        return {
          ...comment,
          children: [
            ...comment.children,
            {
              id: comment.children.length + 1,
              name: "Người dùng mới",
              avatar: "https://github.com/shadcn.png",
              content: replyContent[id],
              children: [],
              likes:1,
              dislikes:1,
              created_at: new Date().toISOString(),
            },
          ],
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyContent((prev) => ({ ...prev, [id]: "" }));
    setShowReply(null);
  };

  const renderComments = (
    comments: Comment[],
    dropdownStates: DropdownStates,
    toggleDropdown: ToggleDropdown,
    handleReplyToggle: (id: number) => void,
    showReply: number | null,
    handleReply: (id: number, content: string) => void
  ) => {
    return comments.map((comment) => (
      <div key={comment.id} className="comment relative pl-4 mb-2">
        <div className="content mt-2 flex items-center gap-x-2 rounded-xl">
          <Avatar>
            <AvatarImage src={comment.avatar} />
            <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="user_content flex-wrap border-2 rounded-xl p-2 border-customBg2 w-full">
            <p className="font-bold text-white">{comment.name}</p>
            <hr />
            <span className="text-white w-full content">{comment.content}</span>
            <div className="flex pl-4 gap-2 text-gray-500 items-center">
              <span>Thích</span>
              <span
                className="cursor-pointer"
                onClick={() => handleReplyToggle(comment.id)}
              >
                Trả lời
              </span>

            </div>
          </div>
        </div>
        {showReply === comment.id && (
            <div className="ml-12 mt-2 reply-to-parent relative flex items-center">
              <Input
                className="min-h-2 flex text-white"
                type="text"
                placeholder="Trả lời"
                onChange={(e) => handleReply(comment.id, e.target.value)}
              />
              <IoSend
                className="mr-2 absolute right-0  text-white"
                onClick={() => handleSubmitReply(comment.id)}
              />
            </div>
          )}
        {comment.children.length > 0 && (
          <div className="child relative  ml-4 pl-4">

            {!dropdownStates[comment.id] ? (
              <p
                onClick={() => toggleDropdown(comment.id)}
                className="cursor-pointer mt-2 text-white ml-5"
              >
                Xem thêm {comment.children.length} bình luận
              </p>
            ) : (
              <>
                {renderComments(
                  comment.children,
                  dropdownStates,
                  toggleDropdown,
                  handleReplyToggle,
                  showReply,
                  handleReply
                )}
                <span
                  onClick={() => toggleDropdown(comment.id)}
                  className="cursor-pointer ml-5 text-blue-500"
                >
                  Ẩn bình luận
                </span>
              </>
            )}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="comment mt-2 bg-customBg2 bg-opacity-20 p-4 rounded-lg container gap-y-5 flex flex-col">
      <div className="comment__header text-white flex items-center gap-2">
        <LuMessagesSquare /> {comments.length} Bình Luận
      </div>
      <div className="comment_center text-white relative">
        <Input
          className="min-h-20"
          type="text"
          placeholder="Viết bình luận"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="absolute right-0 flex justify-center items-center bottom-0">
          <Button
            className="bg-inherit hover:bg-inherit"
            onClick={handleAddComment}
          >
            <IoSend />
          </Button>
          <Button className="bg-inherit hover:bg-inherit">
            <CiFaceSmile />
          </Button>
        </div>
      </div>
      <div className="comment_bottom">
        <div className="list_comment">
          {renderComments(
            comments,
            dropdownStates,
            toggleDropdown,
            handleReplyToggle,
            showReply,
            handleReply
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentComponents;