"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaTrashAlt } from "react-icons/fa";
import AlbumsList from "../../../../components/list-productnew";
import { Checkbox, Tag } from "antd";
import { AlbumType, CategoryType } from "../../../../utils/types/type";
import SliderRange from "../../../../components/slider";
import { Button } from "../../../../../components/ui/button";
import { fetchAlbumData, fetchFilteredAlbums } from "../../../../services/AlbumServices";

interface SelectCategory {
    id: number;
    title: string;
}

export default function StoryAdvancedFilter() {
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [maxViews, setMaxViews] = useState<number>(0);
    const [maxFollowers, setMaxFollowers] = useState<number>(0);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<SelectCategory[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [rangeFollower, setRangeFollower] = useState<[number, number]>([0, 1]);
    const [rangeViews, setRangeViews] = useState<[number, number]>([0, 1]);

    useEffect(() => {
        const fetchData = async () => {
            const { albums: fetchedAlbums, maxViews, maxFollowers, categories } = await fetchAlbumData();
            setAlbums(fetchedAlbums);
            setMaxViews(maxViews);
            setMaxFollowers(maxFollowers);
            setCategories(categories);
        };
        fetchData();
    }, []);

    const handleRangeFollower = (value: [number, number]) => {
        setRangeFollower(value);
    };

    const handleRangeViews = (value: [number, number]) => {
        setRangeViews(value);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCategories([]);
        setRangeFollower([0, 1]);
        setRangeViews([0, 1]);
    };

    const fetchFilterAlbum = async () => {
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
        }
    };

    const handleRemoveCategory = (id: number) => {
        setSelectedCategories((prev) => prev.filter((c) => c.id !== id));
    };

    const handleCategoryChange = (category: CategoryType) => {
        setSelectedCategories((prev) =>
            prev.some((c) => c.id === category.id)
                ? prev.filter((c) => c.id !== category.id)
                : [...prev, { id: category.id, title: category.title }]
        );
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Tìm kiếm album..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all duration-300"
                        />
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center h-12 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                        >
                            <FaFilter className="mr-2" />
                            {isFilterOpen ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
                        </Button>
                    </div>
                </div>

                {/* Advanced Filter Section */}
                {isFilterOpen && (
                    <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Category Filter */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Danh mục</h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {categories.map((item) => (
                                        <Checkbox
                                            key={item.id}
                                            checked={selectedCategories.some((c) => c.id === item.id)}
                                            onChange={() => handleCategoryChange(item)}
                                            className="text-gray-700"
                                        >
                                            {item.title}
                                        </Checkbox>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Lượt xem</h3>
                                <SliderRange
                                    params={{
                                        maxRange: maxViews,
                                        onChange: handleRangeViews,
                                    }}
                                />
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Người theo dõi</h3>
                                <SliderRange
                                    params={{
                                        maxRange: maxFollowers,
                                        onChange: handleRangeFollower,
                                    }}
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-3">Tag</h2>
                                {selectedCategories.map((item) => (
                                    <Tag key={item.id} closable onClose={() => handleRemoveCategory(item.id)}>
                                        {item.title}
                                    </Tag>
                                ))}
                            </div>

                            <div className="w-full flex gap-2">
                                <Button className="flex-1" onClick={fetchFilterAlbum}>
                                    <FaFilter className="mr-2" />
                                    Lọc
                                </Button>
                                <Button className="flex-1" onClick={handleClearFilters}>
                                    <FaTrashAlt className="mr-2" />
                                    Dọn
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="rounded-xl shadow-lg">
                <AlbumsList albums={albums} column={4} />
            </div>
        </div>
    );
}
