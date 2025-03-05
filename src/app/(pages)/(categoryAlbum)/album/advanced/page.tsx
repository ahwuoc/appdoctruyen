"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaEye, FaHeart, FaBookmark, FaAngleLeft, FaAngleRight } from "react-icons/fa";

// Định nghĩa type cho truyện
interface StoryType
{
    id: number;
    title: string;
    category: string | undefined;
    views: number;
    follows: number;
    chapters: number;
    status: "ongoing" | "completed";
    image_url: string;
    lastUpdated: string;
}

// API giả lập (thay bằng API thật nếu có)
const fetchStories = async (filters: {
    categories: string[];
    minViews: number;
    minFollows: number;
    status: "All" | "ongoing" | "completed";
    searchQuery: string;
    sortBy: "views" | "follows" | "lastUpdated" | "";
}): Promise<StoryType[]> =>
{
    // Giả lập dữ liệu từ server
    const mockStories: StoryType[] = Array.from({ length: 50 }, (_, i) => ({
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

    // Áp dụng các bộ lọc từ client
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
    const [stories, setStories] = useState<StoryType[]>([]);
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

    // Xử lý chọn danh mục
    const handleCategoryChange = (category: string) =>
    {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category],
        }));
    };

    // Fetch dữ liệu khi bấm nút tìm kiếm
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
            setStories(fetchedStories);
            setCurrentPage(1); // Reset về trang 1 khi tìm kiếm mới
        } catch (error) {
            console.error("Error fetching stories:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch lần đầu khi component mount
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
        <div className="container mx-auto min-h-screen py-8 px-4 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            {/* Thanh tìm kiếm */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Tìm kiếm truyện..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-purple-500 transition shadow-lg"
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md transition"
                >
                    <FaFilter /> Bộ lọc nâng cao
                </button>
            </div>

            {/* Panel bộ lọc nâng cao */}
            {isFilterPanelOpen && (
                <div className="bg-gray-700 p-6 rounded-lg mb-8 shadow-xl animate-slide-down">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Chọn nhiều danh mục */}
                        <div>
                            <label className="block mb-2 font-semibold">Danh mục</label>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map((cat) => (
                                    <label key={cat} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.categories.includes(cat)}
                                            onChange={() => handleCategoryChange(cat)}
                                            className="form-checkbox text-purple-500"
                                        />
                                        <span>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Lượt xem tối thiểu */}
                        <div>
                            <label className="block mb-2 font-semibold">Lượt xem tối thiểu</label>
                            <input
                                type="number"
                                min="0"
                                value={filters.minViews}
                                onChange={(e) => setFilters({ ...filters, minViews: Number(e.target.value) })}
                                className="w-full p-2 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* Lượt theo dõi tối thiểu */}
                        <div>
                            <label className="block mb-2 font-semibold">Lượt theo dõi tối thiểu</label>
                            <input
                                type="number"
                                min="0"
                                value={filters.minFollows}
                                onChange={(e) => setFilters({ ...filters, minFollows: Number(e.target.value) })}
                                className="w-full p-2 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label className="block mb-2 font-semibold">Trạng thái</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value as "All" | "ongoing" | "completed" })}
                                className="w-full p-2 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-purple-500"
                            >
                                <option value="All">Tất cả</option>
                                <option value="ongoing">Đang cập nhật</option>
                                <option value="completed">Hoàn thành</option>
                            </select>
                        </div>

                        {/* Sắp xếp */}
                        <div>
                            <label className="block mb-2 font-semibold">Sắp xếp theo</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as "views" | "follows" | "lastUpdated" | "")}
                                className="w-full p-2 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-purple-500"
                            >
                                <option value="">Không sắp xếp</option>
                                <option value="views">Lượt xem</option>
                                <option value="follows">Lượt theo dõi</option>
                                <option value="lastUpdated">Cập nhật gần nhất</option>
                            </select>
                        </div>
                    </div>

                    {/* Nút tìm kiếm */}
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
                    >
                        <FaSearch /> {loading ? "Đang tìm..." : "Tìm kiếm"}
                    </button>
                </div>
            )}

            {/* Danh sách truyện */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-10 text-gray-400">Đang tải...</div>
                ) : paginatedStories.length > 0 ? (
                    paginatedStories.map((story) => (
                        <div
                            key={story.id}
                            className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="relative h-72">
                                <img
                                    src={story.image_url}
                                    alt={story.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4">
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1 bg-purple-500 px-2 py-1 rounded-full">
                                            <FaEye /> {story.views.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1 bg-red-500 px-2 py-1 rounded-full">
                                            <FaHeart /> {story.follows.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <button className="absolute top-2 right-2 text-white bg-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaBookmark />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg truncate">{story.title}</h3>
                                <p className="text-gray-400 text-sm">{story.category} • {story.chapters} chương</p>
                                <p className="text-gray-500 text-xs mt-1">
                                    {story.status === "ongoing" ? "Đang cập nhật" : "Hoàn thành"} • {story.lastUpdated}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-400">Không tìm thấy truyện nào phù hợp</div>
                )}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && !loading && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="p-2 bg-gray-700 rounded-full text-white hover:bg-purple-600 disabled:opacity-50 transition"
                    >
                        <FaAngleLeft size={20} />
                    </button>
                    <span className="text-sm">
                        Trang {currentPage} / {totalPages} ({totalItems} truyện)
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 bg-gray-700 rounded-full text-white hover:bg-purple-600 disabled:opacity-50 transition"
                    >
                        <FaAngleRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

// CSS animation cho panel lọc
const animationStyles = `
  @keyframes slide-down {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-slide-down {
    animation: slide-down 0.3s ease-out;
  }
`;