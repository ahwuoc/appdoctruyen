"use client";
import { LuMessagesSquare } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { IoSend } from "react-icons/io5";
import { CiFaceSmile } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const initialComments = [
  {
    id: 1,
    name: "Nguyễn Anh Quốc",
    avatar: "https://github.com/shadcn.png",
    content: "Bình luận gốc",
    children: [
      {
        id: 2,
        name: "Nguyễn Văn A",
        avatar: "https://github.com/shadcn.png",
        content: "Bình luận trả lời 1",
        children: [
          {
            id: 3,
            name: "Nguyễn Văn B",
            avatar: "https://github.com/shadcn.png",
            content: "Bình luận trả lời 1.1",
            children: [],
          },
        ],
      },
      {
        id: 4,
        name: "Nguyễn Văn C",
        avatar: "https://github.com/shadcn.png",
        content: "Bình luận trả lời 2",
        children: [],
      },
    ],
  },
];

// Hàm đệ quy để render comment và các reply (children)
const renderComments = (comments, dropdownStates, toggleDropdown) => {
  return comments.map((comment) => (
    <div key={comment.id} className="comment relative pl-4 mb-2">
      <div className="content mt-2 flex items-center gap-x-2 rounded-xl">
        <Avatar>
          <AvatarImage src={comment.avatar} />
          <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="user_content border-2 rounded-xl p-2 border-customBg2 w-full">
          <p className="font-bold">{comment.name}</p>
          <span className="w-full content">{comment.content}</span>
        </div>
      </div>
      {comment.children && comment.children.length > 0 && (
        <div className="child relative ml-4 border-l-2 pl-4">
          {!dropdownStates[comment.id] ? (
            <span
              onClick={() => toggleDropdown(comment.id)}
              className="cursor-pointer ml-5"
            >
              Xem {comment.children.length} bình luận
            </span>
          ) : (
            <>
              {renderComments(comment.children, dropdownStates, toggleDropdown)}
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

const CommentComponents = () => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [dropdownStates, setDropdownStates] = useState({});

  // Hàm toggle trạng thái dropdown
  const toggleDropdown = (id) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const newCommentObject = {
      id: comments.length + 1,
      name: "Người dùng mới", // Tên người dùng tạm thời (có thể thay bằng dữ liệu thực từ backend)
      avatar: "https://github.com/shadcn.png",
      content: newComment,
      children: [],
    };

    // Thêm bình luận mới vào danh sách bình luận gốc
    setComments([...comments, newCommentObject]);
    setNewComment(""); // Xóa nội dung trong input
  };

  return (
    <div className="comment container gap-y-5 flex flex-col">
      <div className="comment__header flex items-center gap-2">
        <LuMessagesSquare /> {comments.length} Bình Luận
      </div>
      <div className="comment_center relative">
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
          {renderComments(comments, dropdownStates, toggleDropdown)}
        </div>
      </div>
    </div>
  );
};

export default CommentComponents;
