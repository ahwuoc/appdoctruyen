"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, BookOpen, ChevronRight, Hash, List } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAlbumTopChapters } from "../../../(action)/album";
import { createSlug } from "@/app/utils/common/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Album {
    id: number;
    rank: number;
    title: string;
    chapterCount: number;
    image_url: string;
}

const TopMangaRanking: React.FC = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const data = await getAlbumTopChapters();
                setAlbums(data as Album[]);
            } catch (error) {
                console.error("Error fetching rankings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, []);

    const topThree = albums.slice(0, 3);
    const others = albums.slice(3);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#060914] p-8 space-y-8">
                <Skeleton className="w-1/3 h-12 bg-white/5 mx-auto rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 bg-white/5 rounded-[2.5rem]" />)}
                </div>
                <Skeleton className="w-full h-96 bg-white/5 rounded-[2.5rem]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060914] text-white py-16 px-4 md:px-8 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="container mx-auto relative z-10 space-y-16">
                <header className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 text-sm font-bold"
                    >
                        <Trophy className="w-4 h-4" />
                        Bảng Xếp Hạng 2024
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-500"
                    >
                        Top Truyện Nhiều Chương Nhất
                    </motion.h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Khám phá những bộ truyện đã đi cùng năm tháng với số lượng chương đồ sộ nhất trên hệ thống của chúng tôi.
                    </p>
                </header>

                {/* Top 3 Podium */}
                {topThree.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto pt-10">
                        {/* Rank 2 */}
                        <div className="order-2 md:order-1">
                            {topThree[1] && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Link href={`/album/${createSlug(topThree[1].title)}-${topThree[1].id}`}>
                                        <Card className="bg-white/5 backdrop-blur-xl border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all hover:-translate-y-2 group shadow-2xl h-80 relative">
                                            <div className="absolute top-4 left-4 z-20">
                                                <div className="bg-slate-400 p-2 rounded-xl shadow-lg">
                                                    <Medal className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                            <Image src={topThree[1].image_url} fill className="object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt="" unoptimized />
                                            <CardContent className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                                <Badge variant="secondary" className="mb-2 bg-slate-500/20 text-slate-300 border-none">Hạng 2</Badge>
                                                <h3 className="text-xl font-bold truncate text-white">{topThree[1].title}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                                    <BookOpen className="w-4 h-4" />
                                                    {topThree[1].chapterCount} Chương
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        {/* Rank 1 */}
                        <div className="order-1 md:order-2">
                            {topThree[0] && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Link href={`/album/${createSlug(topThree[0].title)}-${topThree[0].id}`}>
                                        <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-[3rem] overflow-hidden border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all hover:-translate-y-4 group shadow-[0_0_50px_rgba(234,179,8,0.15)] h-[24rem] relative">
                                            <div className="absolute top-6 left-6 z-20">
                                                <div className="bg-yellow-500 p-3 rounded-2xl shadow-xl animate-bounce">
                                                    <Crown className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                            <Image src={topThree[0].image_url} fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="" unoptimized />
                                            <CardContent className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent">
                                                <Badge className="mb-3 bg-yellow-500 text-black font-black border-none px-4">QUÁN QUÂN</Badge>
                                                <h3 className="text-2xl font-black truncate text-white uppercase">{topThree[0].title}</h3>
                                                <div className="flex items-center gap-2 text-gray-300 mt-2 font-bold">
                                                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                                                    {topThree[0].chapterCount} Chương truyện
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        {/* Rank 3 */}
                        <div className="order-3">
                            {topThree[2] && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Link href={`/album/${createSlug(topThree[2].title)}-${topThree[2].id}`}>
                                        <Card className="bg-white/5 backdrop-blur-xl border-white/5 rounded-[2.5rem] overflow-hidden hover:border-orange-500/30 transition-all hover:-translate-y-2 group shadow-2xl h-80 relative">
                                            <div className="absolute top-4 left-4 z-20">
                                                <div className="bg-orange-600 p-2 rounded-xl shadow-lg">
                                                    <Medal className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                            <Image src={topThree[2].image_url} fill className="object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt="" unoptimized />
                                            <CardContent className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                                <Badge variant="secondary" className="mb-2 bg-orange-500/20 text-orange-300 border-none">Hạng 3</Badge>
                                                <h3 className="text-xl font-bold truncate text-white">{topThree[2].title}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                                    <BookOpen className="w-4 h-4" />
                                                    {topThree[2].chapterCount} Chương
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}

                {/* Other Rankings Table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <List className="w-5 h-5 text-blue-500" />
                                Bảng chi tiết
                            </h2>
                            <span className="text-sm text-gray-500 font-medium">{others.length} Bộ truyện khác</span>
                        </div>
                        <div className="max-h-[800px] overflow-y-auto custom-scrollbar">
                            <Table>
                                <TableHeader className="bg-white/5 sticky top-0 z-20">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="w-20 text-center font-bold text-gray-400 flex items-center justify-center h-16"><Hash className="w-4 h-4" /></TableHead>
                                        <TableHead className="font-bold text-gray-400 h-16">Truyện tranh</TableHead>
                                        <TableHead className="font-bold text-gray-400 h-16 text-center">Số chương</TableHead>
                                        <TableHead className="w-20"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {others.map((manga) => (
                                            <TableRow 
                                                key={manga.id} 
                                                className="border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                                                onClick={() => window.location.href = `/album/${createSlug(manga.title)}-${manga.id}`}
                                            >
                                                <TableCell className="text-center font-black text-gray-500 py-4">
                                                    #{manga.rank}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-12 h-16 rounded-lg overflow-hidden shadow-lg border border-white/10 shrink-0">
                                                            <Image src={manga.image_url} fill className="object-cover" alt="" unoptimized />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold group-hover:text-blue-400 transition-colors">{manga.title}</p>
                                                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">MANGA</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center py-4">
                                                    <span className="bg-blue-600/10 text-blue-400 font-black px-3 py-1 rounded-full border border-blue-500/20">
                                                        {manga.chapterCount.toLocaleString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right py-4 pr-8">
                                                    <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-blue-500 transition-colors inline-block" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TopMangaRanking;
