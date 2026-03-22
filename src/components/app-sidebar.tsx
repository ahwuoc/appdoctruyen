"use client";

import * as React from "react";
import {
  Settings2,
  LayoutDashboard,
  PlusSquare,
  FolderOpen,
  BookCopy,
} from "lucide-react";
import { GiTrophyCup } from "react-icons/gi";
import { FaHome } from "react-icons/fa";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/avatar.jpg",
  },
  navMain: [
    {
      title: "Trang chủ",
      url: "/",
      icon: FaHome,
      isActive: true,
    },
    {
      title: "Bảng xếp hạng",
      url: "#",
      icon: GiTrophyCup,
      items: [
        { title: "Nhiều lượt xem", url: "/comic/hot/1" },
        { title: "Nhiều chapter", url: "/comic/new/1" },
      ],
    },
    {
      title: "Truyện tranh",
      url: "#",
      icon: BookCopy,
      items: [
        { title: "Mới cập nhật", url: "/comic/new/1" },
        { title: "Nổi bật", url: "/comic/hot/1" },
      ],
    },
    {
      title: "Tìm kiếm nâng cao",
      url: "/album/advanced",
      icon: Settings2,
    },
  ],
  navManager: [
    {
      title: "Quản lý nội dung",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Đăng truyện mới",
          url: "/manager/album/index",
          icon: PlusSquare
        },
      ],
    },
  ]
};

import Image from "next/image";
import { useRouter } from 'next/navigation';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  return (
    <Sidebar
      className="border-r border-white/5 bg-[#0C1121] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader className="border-b border-white/5 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-white/5 transition-colors">
              <a onClick={() => router.push('/')} className="cursor-pointer flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-sidebar-primary-foreground">
                  <FaHome className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-black italic tracking-tighter text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    mimi
                  </span>
                  <span className="truncate text-xs text-gray-500">Đọc truyện online</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="scrollbar-hide px-2 pt-4">
        <NavMain items={data.navMain} title={"Tác vụ"} />
        <div className="my-4 border-t border-white/5 mx-4" />
        <NavMain items={data.navManager} title={"Quản lý Truyện"} />
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-4 bg-[#0C1121]/50 backdrop-blur-md">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
