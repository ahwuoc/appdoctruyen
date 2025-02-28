"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { GiTrophyCup } from "react-icons/gi";
import { FaHome } from "react-icons/fa";
import { BiPhotoAlbum } from "react-icons/bi";

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
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
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Truyện tranh",
      url: "#",
      icon: BiPhotoAlbum,
      items: [
        { title: "Mới cập nhật", url: "#" },
        { title: "Nổi bật", url: "#" },
        { title: "View khủng", url: "#" },
        { title: "Nhiều chapter", url: "#" },
      ],
    },
    {
      title: "Tìm kiếm ",
      url: "#",
      icon: Settings2,
      items: [
        { title: "Danh mục", url: "#" },
        { title: "Bài viết", url: "#" },
        { title: "Tìm kiếm nâng cao", url: "#" },
      ],
    },

  ],
};
import Image from "next/image";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="min-h-screen !h-[calc(100svh-var(--header-height))]" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="">
                <Image
                  src={"https://nettruyenvie.com/assets/images/logo-nettruyen.png"}
                  width={50}
                  height={50}
                  alt="bame"
                  className="w-full h-full object-contain"
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
