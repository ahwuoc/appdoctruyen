"use client";

import * as React from "react";
import {
  Settings2,
  LayoutDashboard,
  PlusSquare,
  BookCopy,
  LogIn,
  UserPlus,
  Activity,
  Users,
  Tag,
} from "lucide-react";
import { GiTrophyCup } from "react-icons/gi";
import { FaHome } from "react-icons/fa";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { NavHistory } from "@/components/nav-history";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter, usePathname } from 'next/navigation';

const sidebarData = {
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
      title: "Hệ thống quản trị",
      url: "/manager/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Tổng quan",
          url: "/manager/dashboard",
          icon: Activity
        },
        {
          title: "Quản lý truyện",
          url: "/manager/album/index",
          icon: BookCopy
        },
      ],
    },
  ]
};

import { siteConfig } from "@/config/site";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<{
    username: string;
    email: string;
    avatar_url: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setUserProfile({
          username: profile?.username || "Người dùng",
          email: user.email || "",
          avatar_url: profile?.avatar_url || "",
          role: profile?.role || "USER",
        });
      } else {
        setUserProfile(null);
      }
    };

    fetchUserProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUserProfile({
          username: profile?.username || "Người dùng",
          email: session.user.email || "",
          avatar_url: profile?.avatar_url || "",
          role: profile?.role || "USER",
        });
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // Re-run on navigation to pick up cookie-based session changes from Server Actions
  }, [pathname]);

  const isAdminOrAuthor = userProfile?.role === "ADMIN" || userProfile?.role === "AUTHOR";
  const isAdmin = userProfile?.role === "ADMIN";

  const dynamicSidebarData = {
    ...sidebarData,
    navManager: [
      {
        title: "Hệ thống quản trị",
        url: "/manager/dashboard",
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: "Tổng quan",
            url: "/manager/dashboard",
            icon: Activity
          },
          {
            title: "Quản lý truyện",
            url: "/manager/album/index",
            icon: BookCopy
          },
          {
            title: "Quản lý thể loại",
            url: "/manager/categories",
            icon: Tag
          },
          ...(isAdmin ? [{
            title: "Quản lý người dùng",
            url: "/manager/users",
            icon: Users
          }] : [])
        ],
      },
    ]
  };

  return (
    <Sidebar
      className="border-r border-mimi-border bg-mimi-dark !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader className="border-b border-mimi-border p-4 bg-mimi-deep shadow-2xl z-20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-mimi-hover transition-colors h-14">
              <div onClick={() => router.push('/')} className="cursor-pointer flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg overflow-hidden bg-white/5 border border-white/10">
                  <Image
                    src={siteConfig.logo}
                    alt={`${siteConfig.name} logo`}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-black italic tracking-tighter text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {siteConfig.name}
                  </span>
                  <span className="truncate text-xs text-mimi-muted font-medium uppercase tracking-widest text-[8px]">Next-Gen Comic Arch</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="scrollbar-hide px-2 pt-4 bg-mimi-dark relative z-10">
        <NavMain items={dynamicSidebarData.navMain} title={"Core Operations"} />
        <NavHistory />
        {isAdminOrAuthor && (
          <>
            <div className="my-6 border-t border-mimi-border/50 mx-4" />
            <NavMain items={dynamicSidebarData.navManager} title={"Admin Protocol"} />
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-mimi-border p-4 bg-mimi-deep shadow-[0_-20px_40px_rgba(0,0,0,0.5)] z-20">
        {userProfile ? (
          <NavUser
            user={{
              name: userProfile.username,
              email: userProfile.email,
              avatar: userProfile.avatar_url || "",
            }}
          />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem className="px-1 py-1">
              <SidebarMenuButton asChild className="bg-mimi-cyan/5 hover:bg-mimi-cyan/15 border border-mimi-cyan/10 hover:border-mimi-cyan/30 text-white group/item transition-all rounded-xl h-12 px-3 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                <Link href="/login" className="flex items-center gap-3 w-full">
                  <LogIn className="w-5 h-5 text-mimi-cyan group-hover/item:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                  <span className="font-black uppercase tracking-widest text-[10px] italic">Đăng nhập</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="px-1 py-1">
              <SidebarMenuButton asChild className="bg-mimi-purple/5 hover:bg-mimi-purple/15 border border-mimi-purple/10 hover:border-mimi-purple/30 text-white group/item transition-all rounded-xl h-12 px-3 shadow-[0_0_20px_rgba(139,92,246,0.05)]">
                <Link href="/register" className="flex items-center gap-3 w-full">
                  <UserPlus className="w-5 h-5 text-mimi-purple group-hover/item:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
                  <span className="font-black uppercase tracking-widest text-[10px] italic">Tạo tài khoản</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
