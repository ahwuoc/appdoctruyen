"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Search,
    Filter,
    Trash2,
    X,
    ChevronDown,
    ChevronUp,
    Eye,
    UserPlus,
    Grid2X2,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import AlbumsList from "../../../../components/list-productnew";
import { AlbumType, CategoryType } from "../../../../utils/types/type";
import SliderRange from "../../../../components/slider";
import { Button } from "@/components/ui/button";
import { fetchAlbumData, fetchFilteredAlbums } from "../../../../services/AlbumServices";

interface SelectCategory {
    id: number;
    title: string;
}

export default function StoryAdvancedFilter() {
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [maxViews, setMaxViews] = useState<number>(1000000); // Higher default for better slider
    const [maxFollowers, setMaxFollowers] = useState<number>(50000);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<SelectCategory[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [rangeFollower, setRangeFollower] = useState<[number, number]>([0, 100]);
    const [rangeViews, setRangeViews] = useState<[number, number]>([0, 100]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { albums: fetchedAlbums, maxViews, maxFollowers, categories: fetchedCats } = await fetchAlbumData();
                setAlbums(fetchedAlbums);
                setMaxViews(maxViews || 1000000);
                setMaxFollowers(maxFollowers || 50000);
                setCategories(fetchedCats);
            } catch (error) {
                console.error("Fetch Data error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCategories([]);
        setRangeFollower([0, 100]);
        setRangeViews([0, 100]);
    };

    const fetchFilterAlbum = async () => {
        setLoading(true);
        try {
            const filtered = await fetchFilteredAlbums({
                selectedCategories,
                rangeViews,
                maxViews,
                rangeFollower,
                maxFollowers,
                searchTerm,
            });
            setAlbums(filtered);
        } catch (error) {
            console.error("Lỗi khi lọc album:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category: CategoryType) => {
        setSelectedCategories((prev) =>
            prev.some((c) => c.id === category.id)
                ? prev.filter((c) => c.id !== category.id)
                : [...prev, { id: category.id, title: category.title }]
        );
    };

    return (
        <div className="min-h-screen bg-[#060914] text-white py-12 px-4 md:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10 space-y-10">
                {/* Header & Search */}
                <div className="flex flex-col space-y-8">
                    <div className="flex flex-col space-y-2">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black tracking-tight"
                        >
                            Tìm Kiếm <span className="text-blue-500">Nâng Cao</span>
                        </motion.h1>
                        <p className="text-gray-500">Hàng ngàn bộ truyện đang chờ bạn khám phá. Hãy bắt đầu lọc ngay!</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-stretch">
                        <div className="relative flex-1 group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Nhập tên bộ truyện bạn muốn tìm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchFilterAlbum()}
                                className="w-full h-16 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none text-lg transition-all placeholder:text-gray-600"
                            />
                        </div>
                        <Button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`h-16 px-8 rounded-2xl flex items-center gap-3 text-lg font-bold border transition-all ${isFilterOpen
                                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20"
                                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                            {isFilterOpen ? "Đóng Bộ Lọc" : "Mở Bộ Lọc"}
                            {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                {/* Filter Panel */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.98 }}
                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.98 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                    {/* Categories */}
                                    <div className="lg:col-span-12">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-black uppercase tracking-widest text-gray-400">Thể loại</h3>
                                            <span className="text-sm text-blue-500 font-bold">{selectedCategories.length} đã chọn</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {categories.map((item) => {
                                                const isSelected = selectedCategories.some((c) => c.id === item.id);
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => handleCategoryChange(item)}
                                                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all border flex items-center gap-2 ${isSelected
                                                                ? "bg-blue-600/20 border-blue-500 text-blue-400"
                                                                : "bg-white/5 border-white/10 text-gray-500 hover:border-white/30 hover:text-white"
                                                            }`}
                                                    >
                                                        {isSelected && <Check className="w-4 h-4" />}
                                                        {item.title}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Sliders Area */}
                                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                <Eye className="w-5 h-5 text-blue-500" />
                                                <span className="font-bold uppercase tracking-widest text-sm">Lượt xem tối đa</span>
                                            </div>
                                            <SliderRange
                                                params={{
                                                    maxRange: maxViews,
                                                    onChange: (val) => setRangeViews(val),
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                <UserPlus className="w-5 h-5 text-purple-500" />
                                                <span className="font-bold uppercase tracking-widest text-sm">Người theo dõi</span>
                                            </div>
                                            <SliderRange
                                                params={{
                                                    maxRange: maxFollowers,
                                                    onChange: (val) => setRangeFollower(val),
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="lg:col-span-4 flex flex-col justify-end gap-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-10 lg:pt-0 lg:pl-12">
                                        <Button
                                            className="h-16 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-lg transition-all group shadow-lg shadow-blue-600/20"
                                            onClick={fetchFilterAlbum}
                                        >
                                            <Filter className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                                            ÁP DỤNG BỘ LỌC
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-14 border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 rounded-2xl font-bold"
                                            onClick={handleClearFilters}
                                        >
                                            <Trash2 className="w-5 h-5 mr-3" />
                                            Xoá Tất Cả
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Active Tags */}
                {selectedCategories.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap items-center gap-3 py-2"
                    >
                        <span className="text-gray-600 text-sm font-bold uppercase tracking-widest">Đang lọc:</span>
                        {selectedCategories.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleCategoryChange(item as any)}
                                className="group bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-blue-500/20 transition-all"
                            >
                                {item.title}
                                <X className="w-3 h-3 text-blue-500/50 group-hover:text-blue-500" />
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* Results Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black flex items-center gap-3">
                            <Grid2X2 className="w-6 h-6 text-blue-500" />
                            Kết quả tìm kiếm
                        </h2>
                        <span className="text-gray-500 font-medium italic">Tìm thấy {albums.length} bộ truyện</span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 shadow-xl"
                    >
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                <p className="text-gray-500 animate-pulse font-bold tracking-widest uppercase">Đang tải dữ liệu...</p>
                            </div>
                        ) : albums.length > 0 ? (
                            <AlbumsList albums={albums} column={4} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 text-gray-600">
                                <Search className="w-16 h-16 opacity-20" />
                                <h3 className="text-xl font-bold">Không tìm thấy bộ truyện nào</h3>
                                <p className="max-w-xs text-sm">Hãy thử thay đổi điều kiện lọc hoặc từ khoá tìm kiếm của bạn.</p>
                                <Button onClick={handleClearFilters} variant="link" className="text-blue-500 font-bold underline">Xoá tất cả bộ lọc</Button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
