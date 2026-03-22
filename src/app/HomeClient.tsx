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
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Flame, Sparkles, TrendingUp, Users, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type slug = "new" | "hot";

interface HomeClientProps {
  initialAlbums?: AlbumType[];
  initialAlbumsNew?: AlbumType[];
}

import { siteConfig } from '@/config/site';

export default function HomeClient({ initialAlbums, initialAlbumsNew }: HomeClientProps) {
  const [albums, setAlbums] = React.useState<AlbumType[]>(initialAlbums || []);
  const [albumsNew, setAlbumNew] = React.useState<AlbumType[]>(initialAlbumsNew || []);
  const [loading, setLoading] = React.useState(!initialAlbums || !initialAlbumsNew);

  React.useEffect(() => {
    if (initialAlbums && initialAlbumsNew) return;

    const albumsGet = async () => {
      setLoading(true);
      try {
        const [responseAll, responseNew] = await Promise.all([
          apiProduct.getAlbums(),
          apiProduct.getAlbumsNew()
        ]);
        setAlbumNew(responseNew.payload || []);
        setAlbums(responseAll.payload || []);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      } finally {
        setLoading(false);
      }
    };
    albumsGet();
  }, [initialAlbums, initialAlbumsNew]);

  const router = useRouter();
  const handleClick = (slug: slug) => {
    router.push(`/comic/${slug}/${1}`);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="main__content min-h-screen bg-mimi-dark text-white overflow-x-hidden selection:bg-mimi-blue/30 font-body">
      <motion.section
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full overflow-hidden border-b border-white/5 bg-mimi-dark"
      >
        {loading ? (
          <div className="w-full h-[35rem] md:h-[45rem] bg-mimi-deep/30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-mimi-blue animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-mimi-muted">Syncing main deck...</span>
            </div>
          </div>
        ) : (
          <CarouselComponents albums={albums} />
        )}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-mimi-dark/20 to-mimi-dark"></div>
      </motion.section>

      {/* Main Grid Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container mx-auto px-6 py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Recent Updates: High Contrast/Cyber Look */}
          <motion.div variants={itemVariants} className="lg:col-span-8 space-y-12">
            <div className="relative group p-[1px] rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-white/5 overflow-hidden">
              <div className="relative bg-mimi-dark/40 backdrop-blur-2xl rounded-[23px] overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between p-8 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-500/20 blur-lg animate-pulse"></div>
                      <div className="relative p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                        <Flame className="w-6 h-6 text-orange-500" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-mimi-muted">
                        Mới cập nhật
                      </h2>
                      <p className="text-[10px] text-mimi-muted font-bold uppercase tracking-[0.2em] mt-0.5">LATEST UPDATES</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleClick("hot")}
                    variant="ghost"
                    className="hover:bg-mimi-glass/60 px-6 rounded-xl transition-all gap-2 text-xs font-black uppercase tracking-widest border border-mimi-glass"
                  >
                    Xem tất cả
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex gap-4">
                          <Skeleton className="w-[120px] h-[160px] rounded-2xl shrink-0" />
                          <div className="flex-1 space-y-4 py-2">
                            <Skeleton className="h-4 w-3/4 rounded-full" />
                            <Skeleton className="h-3 w-1/2 rounded-full" />
                            <div className="space-y-2 pt-2">
                              <Skeleton className="h-2 w-full rounded-full" />
                              <Skeleton className="h-2 w-full rounded-full" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <AlbumsList albums={albumsNew} />
                  )}
                </div>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.002, y: -2 }}
              className="relative p-[1px] rounded-[32px] bg-gradient-to-br from-mimi-cyan via-mimi-blue to-mimi-purple shadow-[0_20px_50px_-15px_rgba(37,99,235,0.3)] group cursor-pointer overflow-hidden transition-all duration-500"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
              <div className="bg-mimi-dark rounded-[31px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-mimi-cyan/20 blur-[100px] rounded-full group-hover:bg-mimi-cyan/30 transition-colors"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-mimi-purple/20 blur-[100px] rounded-full group-hover:bg-mimi-purple/30 transition-colors"></div>

                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="px-3 py-1 bg-mimi-cyan/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-mimi-cyan/20 text-mimi-cyan">Join our team</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-display font-black italic tracking-tighter leading-none mb-3">
                    TUYỂN DỤNG <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-mimi-cyan to-white">DỊCH GIẢ</span>
                  </h3>
                  <p className="text-mimi-muted text-sm max-w-md font-medium leading-relaxed">Niềm đam mê của bạn, tác phẩm của chúng tôi. Hãy cùng {siteConfig.name} mang những câu chuyện hay nhất đến độc giả!</p>
                </div>

                <button className="relative z-10 px-10 py-5 bg-mimi-cyan text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-mimi-cyan/40 flex items-center gap-3 active:scale-95">
                  Ứng tuyển ngay
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-10">
            <div className="sticky top-24 space-y-10">
              <div className="relative p-[1px] rounded-[32px] bg-gradient-to-b from-white/10 to-transparent overflow-hidden">
                <div className="bg-mimi-glass/30 backdrop-blur-3xl rounded-[31px] overflow-hidden shadow-2xl">
                  <div className="p-7 border-b border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-mimi-purple/10 rounded-2xl border border-mimi-purple/20">
                        <TrendingUp className="w-5 h-5 text-mimi-purple" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-xl tracking-tight">Bảng Xếp Hạng</h3>
                        <p className="text-[10px] text-mimi-muted font-bold uppercase tracking-widest">TOP TRENDING</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    {loading ? (
                      <div className="space-y-6">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex gap-4">
                            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-3 w-3/4" />
                              <Skeleton className="h-2 w-1/4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ListTopAlbum albums={albums} />
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Tags Selection */}
              <div className="p-8 bg-gradient-to-br from-mimi-dark/10 to-mimi-dark rounded-[32px] border border-white/10 relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-mimi-purple/20 blur-[60px] rounded-full"></div>
                <Sparkles className="absolute top-6 right-6 text-yellow-400/20 group-hover:text-yellow-400/60 transition-all duration-700" />
                <h4 className="font-display font-black text-lg text-mimi-purple mb-3 italic">Khám phá thể loại</h4>
                <p className="text-sm text-mimi-muted mb-6 font-medium leading-relaxed">Đắm chìm trong hàng nghìn thế giới giả tưởng hấp dẫn nhất.</p>
                <div className="flex flex-wrap gap-2.5">
                  {['Hành Động', 'Xuyên Không', 'Tu Tiên', 'Huyền Huyễn', 'Manhwa', 'Ngôn Tình'].map((tag, i) => (
                    <motion.span
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-1.5 bg-mimi-glass/40 hover:bg-mimi-glass/60 rounded-full text-[11px] font-bold text-mimi-muted hover:text-white border border-mimi-glass/30 hover:border-mimi-purple/50 transition-all cursor-pointer shadow-sm"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Horizontal Full-Width Sections */}
        <div className="mt-24 space-y-24">
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-mimi-blue rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]"></div>
                <div>
                  <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter">Manga Phổ Biến</h2>
                  <p className="text-[10px] text-mimi-muted font-bold tracking-[0.3em] uppercase">POPULAR MANGA</p>
                </div>
              </div>
              <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-mimi-muted hover:text-white">Xem thêm</Button>
            </div>
            <div className="relative p-10 bg-mimi-glass/10 rounded-[48px] border border-white/5 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
              <SlideCard albums={albums} />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-8 pb-12">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-mimi-purple rounded-full shadow-[0_0_15px_rgba(147,51,234,0.6)]"></div>
                <div>
                  <h2 className="text-3xl font-display font-black uppercase italic tracking-tighter">Gợi Ý Hôm Nay</h2>
                  <p className="text-[10px] text-mimi-muted font-bold tracking-[0.3em] uppercase">DAILY CURATED</p>
                </div>
              </div>
              <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-mimi-muted hover:text-white">Xem thêm</Button>
            </div>
            <div className="relative p-10 bg-mimi-glass/10 rounded-[48px] border border-white/5 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
              <SlideCard albums={albums} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
