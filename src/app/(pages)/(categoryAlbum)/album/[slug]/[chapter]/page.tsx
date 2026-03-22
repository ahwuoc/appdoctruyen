"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  Settings,
  MessageSquare,
  ArrowUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "@/lib/supabase/supabaseClient";
import { getNumberSlug, createSlug, timeAgo } from "@/app/utils/common/utils";
import CommentComponents from "@/app/components/CommentComponents";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type ChapterImage = {
  image_url: string;
};

type ChapterInfo = {
  id: number;
  title: string;
  order_sort: number;
  album_id: number;
};

type AlbumInfo = {
  id: number;
  title: string;
  chapters: ChapterInfo[];
};

export default function Page({ params }: { params: Promise<{ slug: string; chapter: string; }>; }) {
  const router = useRouter();
  const resolvedParams = React.use(params);

  const albumId = useMemo(() => getNumberSlug(resolvedParams.slug), [resolvedParams.slug]);
  const chapterId = useMemo(() => getNumberSlug(resolvedParams.chapter), [resolvedParams.chapter]);

  const [images, setImages] = useState<ChapterImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [albumData, setAlbumData] = useState<AlbumInfo | null>(null);
  const [currentChapter, setCurrentChapter] = useState<ChapterInfo | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > 500) setShowScrollTop(true);
      else setShowScrollTop(false);

      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!chapterId || !albumId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Album and all its chapters for navigation
        const { data: album, error: albumErr } = await supabase
          .from("albums")
          .select("id, title, chapters(id, title, order_sort, album_id)")
          .eq("id", albumId)
          .single();

        if (albumErr) throw albumErr;

        const sortedChapters = (album.chapters || []).sort((a: ChapterInfo, b: ChapterInfo) => a.order_sort - b.order_sort);
        setAlbumData({ ...album, chapters: sortedChapters } as AlbumInfo);

        const chapter = sortedChapters.find((c: ChapterInfo) => c.id === chapterId);
        setCurrentChapter(chapter || null);

        // Fetch Chapter Images
        const { data: imgs, error: imgErr } = await supabase
          .from("chapter_images")
          .select("image_url")
          .eq("chapter_id", chapterId)
          .order("order_sort", { ascending: true });

        if (imgErr) throw imgErr;
        setImages(imgs || []);

        // Update views (optional logic)
        await supabase.rpc('increment_views', { table_name: 'chapters', row_id: chapterId });

      } catch (error) {
        console.error("Error fetching reader data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [chapterId, albumId]);

  const currentIdx = albumData?.chapters.findIndex(c => c.id === chapterId) ?? -1;
  const prevChapter = currentIdx > 0 ? albumData?.chapters[currentIdx - 1] : null;
  const nextChapter = currentIdx < (albumData?.chapters.length ?? 0) - 1 ? albumData?.chapters[currentIdx + 1] : null;

  const navigateToChapter = (chapter: ChapterInfo) => {
    router.push(`/album/${resolvedParams.slug}/${createSlug(chapter.title)}-${chapter.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C1121] flex flex-col items-center p-4">
        <Skeleton className="w-full max-w-3xl h-[800px] bg-white/5 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060914] text-white flex flex-col items-center">
      {/* Sticky Header */}
      <AnimatePresence>
        {headerVisible && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#0C1121]/80 backdrop-blur-xl border-b border-white/5 px-4 h-16"
          >
            <div className="container mx-auto h-full flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href={`/album/${resolvedParams.slug}`} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="hidden md:block">
                  <h1 className="font-bold text-sm truncate max-w-[200px]">{albumData?.title}</h1>
                  <p className="text-xs text-gray-500 truncate">{currentChapter?.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!prevChapter}
                  onClick={() => prevChapter && navigateToChapter(prevChapter)}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="relative">
                  <select
                    value={chapterId?.toString()}
                    onChange={(e) => {
                      const val = e.target.value;
                      const target = albumData?.chapters.find(c => c.id.toString() === val);
                      if (target) navigateToChapter(target);
                    }}
                    className="w-[140px] md:w-[200px] bg-white/5 border border-white/10 h-9 rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    {albumData?.chapters.map((c) => (
                      <option key={c.id} value={c.id.toString()} className="bg-[#0C1121]">
                        Chương {c.order_sort}: {c.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <List className="w-4 h-4" />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!nextChapter}
                  onClick={() => nextChapter && navigateToChapter(nextChapter)}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content: Images */}
      <main className="w-full max-w-4xl mt-20 px-2 flex flex-col items-center gap-0">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div key={index} className="w-full relative shadow-2xl">
              <Image
                src={image.image_url}
                alt={`Trang ${index + 1}`}
                width={1200}
                height={1800}
                className="w-full h-auto object-contain select-none pointer-events-none"
                priority={index < 3}
                unoptimized
              />
            </div>
          ))
        ) : (
          <div className="py-40 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-400">Chưa có nội dung cho chương này</h2>
            <p className="text-gray-600">Vui lòng quay lại sau!</p>
            <Button variant="outline" onClick={() => router.back()}>Quay lại</Button>
          </div>
        )}
      </main>

      {/* Reader Footer Navigation */}
      <div className="w-full max-w-4xl mt-12 mb-20 px-4 space-y-12">
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
            disabled={!prevChapter}
            onClick={() => prevChapter && navigateToChapter(prevChapter)}
          >
            <ChevronLeft className="mr-2" /> Chương trước
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
            disabled={!nextChapter}
            onClick={() => nextChapter && navigateToChapter(nextChapter)}
          >
            Chương sau <ChevronRight className="ml-2" />
          </Button>
        </div>

        {/* Comment Section */}
        <section className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/5 shadow-inner">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="text-blue-500" />
            <h3 className="text-xl font-bold">Thảo luận ({images.length > 0 ? "12" : "0"})</h3>
          </div>
          {chapterId && (
            <CommentComponents params={{ chapter_id: chapterId }} />
          )}
        </section>
      </div>

      {/* Floating Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-[60] bg-blue-600 p-4 rounded-2xl shadow-2xl shadow-blue-500/40 hover:bg-blue-500 transition-colors"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
