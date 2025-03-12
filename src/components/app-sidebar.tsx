"use client";

import * as React from "react";
import
{
  Settings2,
} from "lucide-react";
import { GiTrophyCup } from "react-icons/gi";
import { FaHome } from "react-icons/fa";
import { BiPhotoAlbum } from "react-icons/bi";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";

import
{
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
      title: "Tìm kiếm nâng cao",
      url: "/album/advanced",
      icon: Settings2,
    },
  ],
  navManager: [
    {
      title: "Quản lý truyện tranh",
      url: "#",
      icon: BiPhotoAlbum,
      items: [
        { title: "Đăng truyện", url: "/manager/album/create" },
        { title: "Chỉnh sữa", url: "#" },
        { title: "Kho lưu trữ", url: "#" },
      ],
    },
  ]
};
import Image from "next/image";
import { useRouter } from 'next/navigation';
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>)
{
  const router = useRouter();

  return (
    <Sidebar className="min-h-screen !h-[calc(100svh-var(--header-height))]" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a onClick={() => router.push('/')}>
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
        <NavMain items={data.navMain} title={"Tác vụ"} />
        <NavMain items={data.navManager} title={"Quản lý"} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
