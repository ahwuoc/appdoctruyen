"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Star, Calendar } from "lucide-react";
import { AlbumType } from "@/app/utils/types/type";
import ImageComponents from './ImageComponents';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CarouselComponents({ albums }: { albums: AlbumType[]; }) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || albums.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % albums.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, albums.length]);

  if (!albums || albums.length === 0) return null;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % albums.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + albums.length) % albums.length);
    setIsAutoPlaying(false);
  };

  const currentAlbum = albums[current];

  if (!currentAlbum) return null;

  return (
    <div className="relative w-full h-[35rem] md:h-[45rem] overflow-hidden bg-mimi-deep">
      {/* Background Layer with Blur and Grain */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentAlbum.id}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-mimi-deep/40 z-10 backdrop-blur-sm"></div>
          <ImageComponents
            image={{
              src: currentAlbum.image_url,
              name: currentAlbum.title
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-mimi-deep via-mimi-deep/60 to-transparent z-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-mimi-deep via-transparent to-transparent z-20"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-30 pointer-events-none mix-blend-overlay"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className="container mx-auto px-6 h-full relative z-40 flex items-center">
        <div className="max-w-4xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentAlbum.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 md:space-y-8"
            >
              {/* Genre Badges */}
              <div className="flex flex-wrap gap-2">
                {currentAlbum.categories?.slice(0, 3).map((cat, i) => (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    key={cat.id}
                    className="px-4 py-1.5 bg-mimi-purple/20 backdrop-blur-md border border-mimi-purple/30 text-mimi-purple rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(147,51,234,0.2)]"
                  >
                    {cat.title}
                  </motion.span>
                ))}
              </div>

              {/* Massive Title */}
              <div className="relative group">
                <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none select-none">
                  <span className="relative z-10 block drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    {currentAlbum.title.split(' ').map((word, i) => (
                      <span key={i} className="inline-block mr-[0.2em] last:mr-0">
                        {word}
                      </span>
                    ))}
                  </span>
                  {/* Decorative faint title in background */}
                  <span className="absolute -top-10 -left-10 text-[1.2em] opacity-[0.03] pointer-events-none italic whitespace-nowrap hidden md:block">
                    {currentAlbum.title}
                  </span>
                </h2>
              </div>

              {/* Description */}
              <p className="max-w-xl text-mimi-muted text-sm md:text-base font-medium leading-relaxed line-clamp-3 border-l-2 border-mimi-blue/30 pl-6">
                {currentAlbum.content || "Khám phá câu chuyện hấp dẫn trong tác phẩm này tại mimi - nơi hội tụ những siêu phẩm truyện tranh chất lượng cao."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link href={`/comic/details/${currentAlbum.id}`}>
                  <Button className="h-16 px-10 bg-mimi-blue hover:bg-mimi-blue/80 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] gap-3 shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:scale-105 transition-all">
                    <Play className="w-5 h-5 fill-current" /> Đọc ngay
                  </Button>
                </Link>
                <div className="flex items-center gap-6 px-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-black italic">4.9</span>
                    </div>
                    <span className="text-[9px] uppercase font-black text-white/30 tracking-widest">Rating</span>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-mimi-cyan">
                      <Calendar className="w-4 h-4" />
                      <span className="font-black italic">2024</span>
                    </div>
                    <span className="text-[9px] uppercase font-black text-white/30 tracking-widest">Released</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls - Bottom Right */}
      <div className="absolute bottom-12 right-12 z-50 flex items-center gap-4">
        <div className="flex flex-col items-end mr-4">
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Navigation</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black italic text-mimi-blue">No.{current + 1}</span>
            <span className="text-sm font-bold text-white/30 italic">/ {albums.length}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={prevSlide}
            variant="ghost"
            size="icon"
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-mimi-blue hover:text-white hover:border-mimi-blue transition-all shadow-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={nextSlide}
            variant="ghost"
            size="icon"
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-mimi-blue hover:text-white hover:border-mimi-blue transition-all shadow-xl"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 z-50">
        <motion.div
          key={`progress-${current}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          className="h-full bg-mimi-blue shadow-[0_0_15px_rgba(37,99,235,1)]"
        ></motion.div>
      </div>

      {/* Page Indicators (Dashes) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-50 flex gap-2">
        {albums.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setIsAutoPlaying(false); }}
            className={`h-1 rounded-full transition-all duration-500 ${current === i ? 'w-12 bg-mimi-blue shadow-[0_0_10px_rgba(37,99,235,0.8)]' : 'w-4 bg-white/10 hover:bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}