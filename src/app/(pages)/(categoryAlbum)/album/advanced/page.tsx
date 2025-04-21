"use client";
import React, { useState, useEffect, Suspense } from "react";
import { FaSearch, FaFilter, FaSortUp, FaSortDown, FaTimes, FaTrashAlt } from "react-icons/fa";
import AlbumsList from "../../../../components/list-productnew";
import { supabase } from "../../../../../lib/supabase/supabaseClient";
import { Checkbox, Tag } from "antd";
import { AlbumType, CategoryType } from "../../../../../utils/types/type";
import { mapAlbumData, RawAlbumFromSupabase } from '../../../../../utils/common/mappers';
import SliderRange from '../../../../components/slider';
import { Button } from '../../../../../components/ui/button';
interface SelectCategory {
    id: number,
    title: string,
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

    const handleRangeFollower = React.useCallback((value: [number, number]) => {
        setRangeFollower(value);
    }, []);

    const handleRangeViews = React.useCallback((value: [number, number]) => {
        setRangeViews(value);
    }, []);
    useEffect(() => {
        const fetchData = async () => {

            const queryAlbums = await supabase.from('albums').select(`
                *,
                album_categories (
                  category_id,
                  categories (title)
                ),
                chapters (
                  id,
                  title,
                  views,
                  created_at,
                  order_sort
                )
              `);
            if (queryAlbums.error) throw queryAlbums.error;
            const formattedData = (queryAlbums.data as RawAlbumFromSupabase[] || []).map(mapAlbumData);
            setAlbums(formattedData as AlbumType[]);
            const viewsResponse = await supabase
                .from("chapters")
                .select("views")
                .order("views", { ascending: false })
                .limit(1)
                .single();
            if (viewsResponse.error) throw viewsResponse.error;
            setMaxViews(viewsResponse.data.views);
            const followersResponse = await supabase.rpc("get_most_followed_album");
            if (followersResponse.error) throw followersResponse.error;
            setMaxFollowers(followersResponse.data.follower_count);
            const categoriesResponse = await supabase
                .from("categories")
                .select("*")
                .limit(14);
            if (categoriesResponse.error) throw categoriesResponse.error;
            setCategories(categoriesResponse.data);
        };
        fetchData();
    }, []);
    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCategories([]);
        setRangeFollower([0, 1]);
        setRangeViews([0, 1]);


    };
    const fetchFilterAlbum = async () => {
        let query = supabase.from('albums')
            .select(`
            *,
            album_categories (
                category_id,
                categories (title)
            ),
            chapters (
                id,
                title,
                views,
                created_at,
                order_sort
            )
        `);
        // lọc
        if (selectedCategories.length > 0) {
            query = query.in('album_categories.category_id', selectedCategories.map(c => c.id));
        }
        if (rangeViews[0] > 0 || rangeViews[1] < maxViews) {
            query = query.gte('chapters.views', rangeViews[0]).lte('chapters.views', rangeViews[1]);
        }
        // lọc theo số lượng
        if (rangeFollower[0] > 0 || rangeFollower[1] < maxFollowers) {
            query = query.gte("followers", rangeFollower[0]).lte('followers', rangeFollower[1]);
        }
        if (searchTerm.trim() !== "") {
            query = query.ilike('title', `%${searchTerm}%`);
        }
        const { data, error } = await query;
        if (error) {
            console.error("Lỗi khi fetch dữ liệu: ", error);
            return;
        }
        setAlbums(data.map(album => ({
            ...album,
            title: album.title ?? "No Title"
        })));
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
                            {<FaFilter />}
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
                                            className="text-gray-700">
                                            {item.title}
                                        </Checkbox>


                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Lượt xem</h3>
                                <SliderRange params={
                                    {
                                        maxRange: maxViews,
                                        onChange: handleRangeViews,
                                    }
                                } />
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Người theo dõi</h3>
                                <SliderRange params={
                                    {
                                        maxRange: maxFollowers,
                                        onChange: handleRangeFollower,
                                    }
                                } />
                            </div>

                            <div className=''>
                                <h2>Tag</h2>
                                {selectedCategories.map((item) => (
                                    <Tag key={item.id} closable onClose={() => handleRemoveCategory(item.id)}>
                                        {item.title}
                                    </Tag>
                                ))}

                            </div>
                            <div className='w-full flex gap-2'>
                                <Button className='flex-1' onClick={fetchFilterAlbum}>
                                    <FaFilter className="mr-2" />
                                    Lọc
                                </Button>
                                <Button className='flex-1' onClick={handleClearFilters}>
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