"use client";

import { Button } from '../../components/ui/button';
import { Search, X, Loader2, Sparkles } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import http from '../utils/types/http';
import React, { useState, useEffect, Suspense } from 'react';
import type { AlbumType } from '../utils/types/type';
import AlbumsList from './list-productnew';
import Loading from '../loading';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchComponents() {
    const [search, setSearch] = useState<string>("");
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncetimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const fetchAlbums = async (query: string) => {
        if (!query.trim()) {
            setAlbums([]);
            return;
        }
        setIsLoading(true);
        try {
            const response = await http.get<AlbumType[]>(`/api/albums?query=${encodeURIComponent(query)}`);
            setAlbums(response.payload || []);
        } catch (err) {
            setAlbums([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (debouncetimer) {
            clearTimeout(debouncetimer);
        }

        const timer = setTimeout(() => {
            fetchAlbums(value);
        }, 500);
        setDebounceTimer(timer);
    };

    const clearSearch = () => {
        setSearch("");
        setAlbums([]);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-10 h-10 md:w-auto md:px-4 bg-white/5 border border-white/10 hover:bg-mimi-blue transition-all group rounded-full"
                >
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline-block ml-2 text-sm font-medium">Tìm kiếm...</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl bg-mimi-dark/95 backdrop-blur-3xl border-white/10 p-0 overflow-hidden rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <DialogHeader className="p-6 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                    <DialogTitle className="text-xl font-black italic tracking-tighter flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-mimi-blue" />
                        KHÁM PHÁ TRUYỆN MỚI
                    </DialogTitle>

                    <div className="relative mt-4 group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-mimi-muted group-focus-within:text-mimi-blue transition-colors">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        </div>
                        <Input
                            id="search"
                            className="h-14 pl-12 pr-12 bg-white/5 border-white/10 focus:border-mimi-blue/50 focus:ring-mimi-blue/20 rounded-2xl text-lg placeholder:text-mimi-muted outline-none transition-all"
                            placeholder="Nhập tên bộ truyện bạn yêu thích..."
                            value={search}
                            onChange={handlerSearch}
                            autoFocus
                        />
                        {search && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-mimi-muted" />
                            </button>
                        )}
                    </div>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto px-6 py-4 scrollbar-hide">
                    <AnimatePresence mode="popLayout">
                        {albums.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-4"
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest text-mimi-muted mb-4">Kết quả tìm kiếm ({albums.length})</p>
                                <AlbumsList albums={albums} column={1} />
                            </motion.div>
                        ) : search ? (
                            !isLoading && (
                                <div className="py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-white/10 border border-white/10 rounded-full flex items-center justify-center mx-auto">
                                        <Search className="w-8 h-8 text-mimi-muted" />
                                    </div>
                                    <p className="text-gray-200 font-bold">Không tìm thấy kết quả cho &quot;{search}&quot;</p>
                                </div>
                            )
                        ) : (
                            <div className="py-12 text-center text-mimi-muted space-y-2">
                                <Search className="w-12 h-12 mx-auto opacity-20 mb-2" />
                                <p className="text-sm italic font-bold">Gợi ý: Tìm thử &quot;Conan&quot;, &quot;Naruto&quot;...</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Decor */}
                <div className="h-1 bg-gradient-to-r from-mimi-blue via-mimi-purple to-transparent opacity-50"></div>
            </DialogContent>
        </Dialog>
    );
}
