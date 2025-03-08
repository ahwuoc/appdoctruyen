"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaEye, FaHeart, FaBookmark, FaAngleLeft, FaAngleRight } from "react-icons/fa";

import AlbumsList from '../../../../components/list-productnew';
import { Button } from 'antd';

// API giả lập (thay bằng API thật nếu có)
const fetchStories = async (filters: {
    categories: string[];
    minViews: number;
    minFollows: number;
    status: "All" | "ongoing" | "completed";
    searchQuery: string;
    sortBy: "views" | "follows" | "lastUpdated" | "";
}) =>
{
    const mockStories = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        title: `Truyện ${i + 1}`,
        category: ["Phiêu lưu", "Lãng mạn", "Kiếm hiệp", "Kinh dị", "Hài hước"][i % 5],
        views: Math.floor(Math.random() * 20000) + 1000,
        follows: Math.floor(Math.random() * 5000) + 500,
        chapters: Math.floor(Math.random() * 100) + 10,
        status: i % 2 === 0 ? "ongoing" : "completed",
        image_url: `/story${(i % 3) + 1}.jpg`,
        lastUpdated: `2025-${String(Math.floor(Math.random() * 3) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    }));

    let filteredStories = [...mockStories];

    if (filters.searchQuery) {
        filteredStories = filteredStories.filter((story) =>
            story.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
    }

    if (filters.categories.length > 0) {
        filteredStories = filteredStories.filter((story) => filters.categories.includes(story.category!));
    }

    if (filters.minViews > 0) {
        filteredStories = filteredStories.filter((story) => story.views >= filters.minViews);
    }

    if (filters.minFollows > 0) {
        filteredStories = filteredStories.filter((story) => story.follows >= filters.minFollows);
    }

    if (filters.status !== "All") {
        filteredStories = filteredStories.filter((story) => story.status === filters.status);
    }

    if (filters.sortBy === "views") {
        filteredStories.sort((a, b) => b.views - a.views);
    } else if (filters.sortBy === "follows") {
        filteredStories.sort((a, b) => b.follows - a.follows);
    } else if (filters.sortBy === "lastUpdated") {
        filteredStories.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    }

    return filteredStories;
};

export default function StoryAdvancedFilter()
{
    const [products, setProducts] = React.useState([]);
    const [stories, setStories] = React.useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        categories: [] as string[],
        minViews: 0,
        minFollows: 0,
        status: "All" as "All" | "ongoing" | "completed",
    });
    const [sortBy, setSortBy] = useState<"views" | "follows" | "lastUpdated" | "">("");
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 12;

    const categories = ["Phiêu lưu", "Lãng mạn", "Kiếm hiệp", "Kinh dị", "Hài hước"];

    const handleCategoryChange = (category: string) =>
    {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category],
        }));
    };
    const handleSearch = async () =>
    {
        setLoading(true);
        try {
            const fetchedStories = await fetchStories({
                categories: filters.categories,
                minViews: filters.minViews,
                minFollows: filters.minFollows,
                status: filters.status,
                searchQuery,
                sortBy,
            });
            // setStories(fetchedStories);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error fetching stories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() =>
    {
        handleSearch();
    }, []);

    const totalItems = stories.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedStories = stories.slice(startIndex, endIndex);

    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="container mx-auto">
            <div className='flex flex-col min-h-screen'>
                <div className="flex flex-col list--product new--update">
                    <div className="title">
                        <h2 className='text-color_white w-full text-center p-4 font-bold text-2xl'>{title}</h2>
                    </div>
                    <AlbumsList albums={products} />
                    <div className="pagination flex mt-auto justify-center gap-2 p-4">
                        {displayPages.map((item, index) => (
                            typeof item === 'number' ? (
                                <Button
                                    key={index}
                                    onClick={() => handlePageChange(item)}
                                    className={`rounded-full ${item === currentPage ? 'bg-customBg2' : ''}`}
                                >
                                    {item}
                                </Button>
                            ) : (
                                <Button key={index} className="px-2">...</Button>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

