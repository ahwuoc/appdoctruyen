"use client";

import { AlbumType } from "@/app/utils/types/type";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Eye } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAlbum } from "../utils/provider/ProviderContext";
import { Badge } from "@/components/ui/badge";

export default function SlideCard({ albums }: { albums: AlbumType[]; }) {
  const handleClick = useAlbum();
  const [currentPosition, setCurrentPosition] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const totalSlides = albums.length || 0;
  const slideWidth = 100 / itemsPerView;
  const maxPosition = Math.max(totalSlides - itemsPerView, 0);

  const getItemsPerView = () => {
    if (typeof window === "undefined") return 2;
    const width = window.innerWidth;
    if (width >= 1280) return 6;
    if (width >= 1024) return 5;
    if (width >= 768) return 3;
    return 2.5; // Peek next slide on mobile
  };

  useEffect(() => {
    const updateItemsPerView = () => setItemsPerView(getItemsPerView());
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !slideContainerRef.current) return;
    const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
    const distance = (clientX - startX) / slideContainerRef.current.offsetWidth * 100;
    setTranslateX(-currentPosition * slideWidth + distance);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = slideWidth / 4;
    const delta = (translateX + (currentPosition * slideWidth));

    if (Math.abs(delta) > threshold) {
      if (delta > 0) goToPrev();
      else goToNext();
    }
    setTranslateX(0);
  };

  const goToNext = () => setCurrentPosition((prev) => Math.min(prev + 1, maxPosition));
  const goToPrev = () => setCurrentPosition((prev) => Math.max(prev - 1, 0));

  return (
    <div className="relative group/carousel w-full">
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-40 md:opacity-0 group-hover/carousel:opacity-100 transition-all duration-300">
        <button
          className="w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-full hover:bg-blue-600 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-0 transition-all shadow-2xl"
          onClick={goToPrev}
          disabled={currentPosition === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-40 md:opacity-0 group-hover/carousel:opacity-100 transition-all duration-300">
        <button
          className="w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-full hover:bg-blue-600 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-0 transition-all shadow-2xl"
          onClick={goToNext}
          disabled={currentPosition >= maxPosition}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="overflow-hidden px-1 py-10">
        <div
          ref={slideContainerRef}
          className="flex will-change-transform transition-transform duration-500 cubic-bezier(0.23, 1, 0.32, 1)"
          style={{
            transform: `translateX(${translateX || -currentPosition * slideWidth}%)`,
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {albums.length > 0 ? (
            albums.map((album, index) => (
              <div
                key={album.id || index}
                className="px-3 flex-shrink-0 select-none cursor-pointer"
                style={{ width: `${slideWidth}%` }}
                onClick={() => handleClick(album.title, album.id)}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="relative aspect-[3/4.5] rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all shadow-xl group/card"
                >
                  <Image
                    src={album.image_url}
                    alt={album.title}
                    fill
                    className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                    unoptimized
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1121] via-[#0C1121]/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity" />

                  {/* Content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <div className="translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                      <Badge className="bg-blue-600/80 backdrop-blur-md mb-2 border-none font-bold">MỚI</Badge>
                      <h4 className="font-black text-sm md:text-base leading-tight truncate uppercase tracking-tighter text-white">
                        {album.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-blue-500 fill-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Đọc ngay</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Floating */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover/card:opacity-100 transition-all translate-x-4 group-hover/card:translate-x-0">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1 flex items-center gap-1.5 whitespace-nowrap">
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span className="text-[10px] font-bold text-white uppercase">Popular</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-20 text-gray-500 italic">Hệ thống đang cập nhật dữ liệu...</div>
          )}
        </div>
      </div>
    </div>
  );
}