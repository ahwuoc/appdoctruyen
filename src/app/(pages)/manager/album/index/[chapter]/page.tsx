"use client";
import React, { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { RiDraggable, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { getAlbumId } from "../../../../../(action)/album";
import ImageComponents from "../../../../../components/ImageComponents";
import { Button } from "antd";
import { TbTrashX } from "react-icons/tb";





interface Images {
    id: number;
    title?: string;
    image_url: string;
    order_sort: number;
}

interface Chapter {
    id: number;
    title: string;
    content: string;
    image_url: string;
    chapter_images: Images[];
    order_sort: number;
}

interface ResponseData {
    id: number;
    title: string;
    content: string;
    image_url: string;
    chapters: Chapter[];
}

export default function ChapterSort() {
    const [albumData, setAlbumData] = useState<ResponseData | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const data = await getAlbumId(1);
                if (data) {
                    setAlbumData(data);
                    const mappedChapters = data.chapters.map((chapter, index) => ({
                        ...chapter,
                        order_sort: chapter.order_sort ?? index + 1,
                        chapter_images: chapter.chapter_images.map((img, imgIndex) => ({
                            ...img,
                            order_sort: img.order_sort ?? imgIndex + 1,
                        })),
                    }));
                    setChapters(mappedChapters);
                }
            } catch (error) {
                console.error("Error fetching album:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlbum();
    }, []);


    const handleChapterSort = (newOrder: Chapter[]) => {
        const updatedChapters = newOrder.map((chapter, index) => ({
            ...chapter,
            order_sort: index + 1,
        }));
        setChapters(updatedChapters);
    };

    const handleImageSort = (chapterId: number, newImages: Images[]) => {
        const updatedImages = newImages.map((image, index) => ({
            ...image,
            order_sort: index + 1,
        }));
        setChapters((prev) =>
            prev.map((chapter) =>
                chapter.id === chapterId ? { ...chapter, chapter_images: updatedImages } : chapter
            )
        );
    };

    const toggleChapter = (chapterId: number) => {
        setExpandedChapters((prev) => {
            const newSet = new Set(prev);
            const idStr = chapterId.toString();
            if (newSet.has(idStr)) {
                newSet.delete(idStr);
            } else {
                newSet.add(idStr);
            }
            return newSet;
        });
    };

    const sortedChapters = [...chapters].sort((a, b) => a.order_sort - b.order_sort);

    if (loading) {
        return <div className="container mx-auto p-6">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Tên truyện: {albumData?.title}</h2>
            <div className="border border-dotted rounded-md p-4">
                <div className="flex items-center justify-between">
                    <h2 className="p-2 text-white text-xl">Danh sách chapter</h2>
                    <div className="flex">
                        <Button>+</Button>
                    </div>
                </div>
                <ReactSortable
                    list={sortedChapters}
                    setList={handleChapterSort}
                    animation={200}
                    handle=".drag-handle"
                    className="space-y-2"
                >
                    {sortedChapters.map((chapter) => (
                        <Chapter
                            key={chapter.id}
                            chapter={chapter}
                            onImageSort={handleImageSort}
                            isExpanded={expandedChapters.has(chapter.id.toString())}
                            toggleExpand={() => toggleChapter(chapter.id)}
                        />
                    ))}
                </ReactSortable>
            </div>
        </div>
    );
}

const Chapter = ({
    chapter,
    onImageSort,
    isExpanded,
    toggleExpand,

}: {
    chapter: Chapter;
    onImageSort: (chapterId: number, newImages: Images[]) => void;
    isExpanded: boolean;
    toggleExpand: () => void;
}) => {

    const sortedImages = [...chapter.chapter_images].sort((a, b) => a.order_sort - b.order_sort);

    return (
        <div className="border p-4 bg-white rounded-lg shadow">
            <div className="flex gap-5 items-center">
                <RiDraggable className="drag-handle text-gray-500 cursor-move" size={20} />
                <h3 className="font-bold flex-1">{chapter.title}</h3>
                <h3 className="font-bold">Chapter {chapter.order_sort}</h3>
                {chapter.chapter_images.length > 0 && (
                    <button onClick={toggleExpand} className="mr-2">
                        {isExpanded ? (
                            <RiArrowUpSLine size={20} className="text-gray-500" />
                        ) : (
                            <RiArrowDownSLine size={20} className="text-gray-500" />
                        )}
                    </button>
                )}
            </div>
            {isExpanded && chapter.chapter_images.length > 0 && (
                <ReactSortable
                    list={sortedImages}
                    setList={(newImages) => onImageSort(chapter.id, newImages)}
                    animation={200}
                    handle=".drag-handle"
                    className="flex flex-wrap gap-2 mt-2"
                >
                    {sortedImages.map((image) => (
                        <ImageItem key={image.id} image={image} />
                    ))}
                    <div className='mt-auto border rounded-md w-48 bg-gray-100  h-48 flex justify-center items-center'>
                        <Button
                        >

                            + Upload
                        </Button>
                    </div>
                </ReactSortable>

            )}

        </div>
    );
};

const ImageItem = ({ image }: { image: Images; }) => {
    return (
        <div className="border p-2 bg-gray-100 rounded-md flex items-center h-48 w-48">
            <div className="ml-2 flex-1">
                <div className='flex gap-2'>
                    <RiDraggable className="drag-handle text-gray-500 cursor-move" size={20} />
                    <p className="truncate">{image.order_sort || "Untitled Image"}</p>
                </div>
                <div className="w-40 h-40 relative group">
                    {/* Overlay tối khi hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md"></div>
                    {/* Nút thùng rác */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <TbTrashX size={40} className="text-white cursor-pointer p-1 border-2 rounded-md border-white border-dotted" />
                    </div>
                    <ImageComponents
                        image={{
                            src: image.image_url,
                            name: image.title || "Untitled Image",
                        }}
                    />

                </div>
            </div>
        </div>
    );
};