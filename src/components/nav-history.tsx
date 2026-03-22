"use client";

import { History, Trash2, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useReadingHistory } from "@/hooks/use-reading-history";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupAction,
} from "@/components/ui/sidebar";
import { timeAgo } from "@/app/utils/common/utils";

export function NavHistory() {
  const { history, clearHistory } = useReadingHistory();

  if (history.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center gap-2 text-mimi-cyan/70 font-black uppercase tracking-widest text-[10px]">
        <History className="w-3 h-3" />
        Lịch sử đọc
      </SidebarGroupLabel>
      <SidebarGroupAction
        onClick={clearHistory}
        title="Xóa lịch sử"
        className="hover:bg-red-500/10 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-3 h-3" />
      </SidebarGroupAction>
      <SidebarMenu>
        {history.map((item) => (
          <SidebarMenuItem key={`${item.albumId}-${item.chapterId}`}>
            <SidebarMenuButton
              asChild
              className="h-auto py-2 hover:bg-white/5 group/history"
            >
              <Link
                href={`/album/${item.albumSlug}/${item.chapterTitle.toLowerCase().replace(/\s+/g, '-')}-${item.chapterId}`}
                className="flex gap-3 items-start"
              >
                <div className="relative w-10 h-14 shrink-30 rounded-md overflow-hidden border border-white/10 group-hover/history:border-mimi-cyan/50 transition-colors">
                  <Image
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.albumTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-white truncate group-hover/history:text-mimi-cyan transition-colors">
                    {item.albumTitle}
                  </span>
                  <span className="text-[10px] text-mimi-muted truncate">
                    {item.chapterTitle}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-mimi-muted/50 italic">
                    <Clock className="w-2 h-2" />
                    {timeAgo(new Date(item.updatedAt))}
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
