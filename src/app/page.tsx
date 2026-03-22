'use client';

import React from 'react';
import CarouselComponents from '@/app/components/Carousel';
import SlideCard from '@/app/components/SlideCard';
import { AlbumType } from "@/app/utils/types/type";
import { apiProduct } from "./api/apiRequest/apiProduct";
import ListTopAlbum from '@/app/components/list-album-bxh';
import AlbumsList from '@/app/components/list-productnew';

import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Suspense } from 'react';
import Loading from './loading';
import { motion } from 'framer-motion';
import { Flame, Sparkles, TrendingUp, Users } from 'lucide-react';

type slug = "new" | "hot";

export default function Page() {
  const [albums, setAlbums] = React.useState<AlbumType[]>([]);
  const [albumsNew, setAlbumNew] = React.useState<AlbumType[]>([]);

  React.useEffect(() => {
    const albumsGet = async () => {
      try {
        const responseAll = await apiProduct.getAlbums();
        const responseNew = await apiProduct.getAlbumsNew();
        setAlbumNew(responseNew.payload || []);
        setAlbums(responseAll.payload || []);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      }
    };
    albumsGet();
  }, []);

  const router = useRouter();
  const handleClick = (slug: slug) => {
    router.push(`/comic/${slug}/${1}`);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="main__content min-h-screen bg-[#0C1121] text-white overflow-x-hidden">
        {/* Hero Section with Carousel */}
        <section className="relative w-full overflow-hidden border-b border-white/5">
          <CarouselComponents albums={albums} />
        </section>

        {/* Main Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left: Latest Updates */}
            <motion.div
              className="lg:col-span-8 space-y-8"
              {...fadeInUp}
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-[#151d35]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                      </div>
                      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Truyện mới cập nhật
                      </h2>
                    </div>
                    <Button
                      onClick={() => handleClick("hot")}
                      variant="ghost"
                      className="hover:bg-white/10 transition-colors gap-2"
                    >
                      Xem tất cả
                      <TrendingUp className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <AlbumsList albums={albumsNew} />
                  </div>
                </div>
              </div>

              {/* Recruitment Banner */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative p-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 overflow-hidden cursor-pointer"
              >
                <div className="bg-[#0C1121] rounded-[15px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-10 -mt-10"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full border border-white/10">
                      <Users className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold italic tracking-tight underline">TUYỂN DỤNG DỊCH GIẢ</h3>
                      <p className="text-gray-400 text-sm">Gia nhập đội ngũ biên dịch truyện của chúng tớ!</p>
                    </div>
                  </div>
                  <button className="relative z-10 px-8 py-3 bg-white text-[#0C1121] font-bold rounded-xl hover:bg-gray-200 transition-all shadow-lg hover:shadow-white/5">
                    Ứng tuyển ngay
                  </button>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Charts */}
            <motion.div
              className="lg:col-span-4 space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="sticky top-24 space-y-8">
                {/* Ranking Section */}
                <div className="bg-[#151d35]/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="p-5 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <h3 className="font-bold text-lg tracking-tight">Bảng Xếp Hạng</h3>
                    </div>
                  </div>
                  <div className="p-2">
                    <ListTopAlbum albums={albums} />
                  </div>
                </div>

                {/* Popular Genres or Small Banner */}
                <div className="p-6 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl border border-white/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
                  <Sparkles className="absolute top-4 right-4 text-yellow-400/30 group-hover:text-yellow-400 transition-colors duration-500" />
                  <h4 className="font-bold text-purple-200 mb-2 italic">Khám phá thể loại</h4>
                  <p className="text-sm text-gray-400 mb-4">Hàng nghìn bộ truyện hấp dẫn đang chờ bạn khám phá!</p>
                  <div className="flex flex-wrap gap-2">
                    {['Hành Động', 'Xuyên Không', 'Tu Tiên'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10 hover:border-purple-500 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Featured Sections (Full Width) */}
          <div className="mt-16 space-y-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 px-2">
                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-black uppercase italic tracking-wider">Manga Phổ Biến</h2>
              </div>
              <div className="relative p-6 bg-[#151d35]/30 rounded-3xl border border-white/5 shadow-inner">
                <SlideCard albums={albums} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 px-2">
                <div className="w-1 h-8 bg-purple-600 rounded-full"></div>
                <h2 className="text-2xl font-black uppercase italic tracking-wider">Gợi Ý Hôm Nay</h2>
              </div>
              <div className="relative p-6 bg-[#151d35]/30 rounded-3xl border border-white/5 shadow-inner">
                <SlideCard albums={albums} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
