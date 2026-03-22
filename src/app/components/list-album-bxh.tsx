"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Clock, Medal } from "lucide-react";
import Image from "next/image";
import { AlbumType } from "@/app/utils/types/type";
import { useAlbum } from "../utils/provider/ProviderContext";
import { timeAgo } from "@/app/utils/common/utils";

export default function ListTopAlbum({ albums }: { albums: AlbumType[]; }) {
  const goToAlbumDetails = useAlbum();

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return "from-yellow-400 to-orange-600";
      case 1: return "from-slate-300 to-slate-500";
      case 2: return "from-amber-600 to-amber-800";
      default: return "from-blue-600/20 to-purple-600/20";
    }
  };

  const getRankIconColor = (index: number) => {
    switch (index) {
      case 0: return "text-yellow-400";
      case 1: return "text-slate-300";
      case 2: return "text-amber-600";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="w-full space-y-2 p-1">
      {albums.slice(0, 5).map((item, index) => {
        const latestChapter = item?.chapters?.[0];
        const chapterTitle = latestChapter?.title ?? "Đang cập nhật";
        const chapterTime = latestChapter?.created_at ? timeAgo(latestChapter.created_at) : "N/A";

        return (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => goToAlbumDetails(item.title, item.id)}
            className="group relative cursor-pointer"
          >
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 overflow-hidden relative">
              {/* Rank Badge */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${getRankColor(index)} flex items-center justify-center text-white font-black text-sm shadow-lg`}>
                {index + 1}
              </div>

              {/* Thumbnail */}
              <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-white/10">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-sm font-black text-white truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] text-blue-300 font-black">
                    <BookOpen className="w-3 h-3" />
                    <span className="truncate max-w-[80px]">{chapterTitle}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-200 font-bold whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    {chapterTime}
                  </div>
                </div>
              </div>

              {/* Highlight icon for Top 1-3 */}
              {index < 3 && (
                <Medal className={`absolute -right-1 -top-1 w-6 h-6 rotate-12 opacity-20 group-hover:opacity-100 transition-opacity ${getRankIconColor(index)}`} />
              )}
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
}