"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Bookmark, Clock, BookOpen, Layers } from "lucide-react";

import { AlbumType, CategoryType } from "@/app/utils/types/type";
import { timeAgo } from "@/app/utils/common/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAlbum } from "../utils/provider/ProviderContext";

interface CardAlbumProps {
    album: AlbumType;
    style?: React.CSSProperties;
    className?: string;
}

export default function CardAlbum({ album, style, className }: CardAlbumProps) {
    const goToAlbumDetails = useAlbum();

    const latestChapter = album.chapters?.[0];
    const chapterName = latestChapter?.title ?? "Đang cập nhật";
    const chapterTime = timeAgo(latestChapter?.created_at ?? "Đang cập nhật");
    const totalViews = album.chapters?.reduce((acc, curr) => acc + (curr.view ?? 0), 0) ?? 0;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            style={style}
            className={`group relative ${className}`}
            onClick={() => goToAlbumDetails(album.title, album.id)}
        >
            <div className="bg-white/5 backdrop-blur-md border border-white/5 hover:border-blue-500/30 transition-all rounded-2xl overflow-hidden h-40 flex shadow-xl cursor-pointer">
                {/* Thumbnail Area */}
                <div className="w-1/3 relative overflow-hidden group">
                    <Image
                        src={album.image_url}
                        alt={album.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Badge className="bg-blue-600 border-none shadow-lg">CLICK ĐỌC</Badge>
                    </div>
                </div>

                {/* Content Area */}
                <div className="w-2/3 p-4 flex flex-col justify-between text-white relative">
                    <div className="space-y-1">
                        <h3 className="font-white text-sm md:text-base  line-clamp-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight text-gray-50">
                            {album.title}
                        </h3>

                        {/* Categories */}
                        <div className="flex gap-1.5 overflow-hidden">
                            {album.categories?.slice(0, 2).map((cat) => (
                                <span key={cat.id} className="text-[10px] font-bold text-gray-200 bg-white/10 border border-white/10 py-0.5 px-2 rounded-md whitespace-nowrap">
                                    {cat.title}
                                </span>
                            ))}
                            {album.categories && album.categories.length > 2 && (
                                <span className="text-[10px] text-gray-300 font-bold bg-white/10 px-2 py-0.5 rounded-md">...</span>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 py-1">
                        <div className="flex items-center gap-1 text-[11px] font-black text-blue-400">
                            <Eye className="w-3.5 h-3.5" />
                            {totalViews.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-black text-purple-400">
                            <Layers className="w-3.5 h-3.5" />
                            {album.chapters?.length || 0}
                        </div>
                    </div>

                    {/* Footer / Latest Chapter */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-blue-300 font-black text-xs min-w-0">
                            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{chapterName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-100 text-[10px] flex-shrink-0 font-bold whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            {chapterTime}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
