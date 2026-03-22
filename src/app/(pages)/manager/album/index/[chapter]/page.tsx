"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ReactSortable } from "react-sortablejs";
import {
    GripVertical,
    ChevronDown,
    ChevronUp,
    Trash2,
    Plus,
    Pencil,
    BookOpen,
    Image as ImageIcon,
    LayoutGrid,
    ArrowLeft,
    Loader2,
    Search,
    Filter,
    ArrowUpDown,
    Eye
} from "lucide-react";
import { getAlbumId } from "../../../../../(action)/album";
import { DeleteChapter, UpdateChapterOrder, DeleteImage } from "../../../../../(action)/chapter";
import ImageComponents from "../../../../../components/ImageComponents";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import FromChapter from "./ChapterFormSheet";

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
    created_at?: string;
}

interface ResponseData {
    id: number;
    title: string;
    content: string;
    image_url: string;
    chapters: Chapter[];
}

export default function ChapterSort() {
    const params = useParams();
    const albumId = parseInt(params.chapter as string);
    const [albumData, setAlbumData] = useState<ResponseData | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | undefined>(undefined);
    const { toast } = useToast();

    const fetchAlbum = async () => {
        setLoading(true);
        try {
            const data = await getAlbumId(albumId);
            if (data) {
                setAlbumData(data);
                const mappedChapters = data.chapters.map((chapter: any, index: number) => ({
                    ...chapter,
                    order_sort: chapter.order_sort ?? index + 1,
                    chapter_images: (chapter.chapter_images || []).map((img: any, imgIndex: number) => ({
                        ...img,
                        order_sort: img.order_sort ?? imgIndex + 1,
                    })),
                }));
                // Mặc định hiển thị mới nhất lên đầu để tác giả dễ làm việc với chương vừa đăng
                setChapters(mappedChapters);
            }
        } catch (error) {
            console.error("Error fetching album:", error);
            toast({ title: "Lỗi", description: "Không thể tải dữ liệu!", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbum();
    }, [albumId]);

    // Lọc và sắp xếp chương
    const filteredChapters = useMemo(() => {
        let result = chapters.filter(ch =>
            ch.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ch.order_sort.toString().includes(searchTerm)
        );

        return result.sort((a, b) => {
            return sortOrder === "asc" ? a.order_sort - b.order_sort : b.order_sort - a.order_sort;
        });
    }, [chapters, searchTerm, sortOrder]);

    const handleChapterSort = async (newOrder: Chapter[]) => {
        // Chỉ cho phép kéo thả khi không search và đang để chế độ ASC (để tránh loạn logic)
        if (searchTerm || sortOrder === "desc") {
            toast({ title: "Lưu ý", description: "Vui lòng tắt tìm kiếm và để sắp xếp Tăng dần để kéo thả chính xác." });
            return;
        }

        const updatedChapters = newOrder.map((chapter, index) => ({
            ...chapter,
            order_sort: index + 1,
        }));
        setChapters(updatedChapters);

        try {
            await UpdateChapterOrder(updatedChapters.map(ch => ({ id: ch.id, order_sort: ch.order_sort })));
            toast({ title: "Đã cập nhật", description: "Thứ tự chương đã được lưu." });
        } catch (error) {
            toast({ title: "Lỗi", description: "Lỗi khi lưu thứ tự!", variant: "destructive" });
        }
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
            if (newSet.has(idStr)) newSet.delete(idStr);
            else newSet.add(idStr);
            return newSet;
        });
    };

    const handleDeleteChapter = async (id: number) => {
        if (!window.confirm("Xóa chương này và tất cả ảnh bên trong?")) return;
        try {
            const res = await DeleteChapter(id);
            if (res.success) {
                toast({ title: "Đã xóa", description: "Chương đã bị loại bỏ." });
                fetchAlbum();
            }
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể xóa!", variant: "destructive" });
        }
    };

    if (loading && !albumData) {
        return (
            <div className="min-h-screen bg-[#0C1121] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0C1121] text-white p-4 md:p-8 pb-32">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Link href="/manager/album/index" className="text-[10px] font-black uppercase text-blue-500 flex items-center gap-2 tracking-[0.2em] hover:opacity-70">
                            <ArrowLeft className="w-4 h-4" /> QUẢN LÝ ALBUM
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
                            Album <span className="text-blue-500">Chapters</span>
                        </h1>
                        <p className="text-gray-500 font-bold border-l-2 border-white/10 pl-4">{albumData?.title}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                placeholder="Tìm số chương hoặc tên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 w-64 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <Button
                            onClick={() => {
                                setSelectedChapter(undefined);
                                setIsSheetOpen(true);
                            }}
                            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black gap-2 shadow-lg"
                        >
                            <Plus className="w-6 h-6" /> THÊM CHƯƠNG
                        </Button>
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                <LayoutGrid className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black uppercase italic">Danh sách chương</h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="bg-white/5 hover:bg-white/10 rounded-xl gap-2 text-[10px] font-black uppercase">
                                        <ArrowUpDown className="w-4 h-4" />
                                        {sortOrder === "desc" ? "Mới nhất trước" : "Cũ nhất trước"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#161B2C] border-white/10 text-white">
                                    <DropdownMenuItem onClick={() => setSortOrder("desc")}>Mới nhất trước</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortOrder("asc")}>Cũ nhất trước</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Lưu ý: Chỉ bật Sortable nếu không tìm kiếm và để thứ tự ASC */}
                        {searchTerm || sortOrder === "desc" ? (
                            <div className="space-y-4">
                                {filteredChapters.map((chapter) => (
                                    <ChapterItem
                                        key={chapter.id}
                                        chapter={chapter}
                                        isExpanded={expandedChapters.has(chapter.id.toString())}
                                        toggleExpand={() => toggleChapter(chapter.id)}
                                        onEdit={() => { setSelectedChapter(chapter); setIsSheetOpen(true); }}
                                        onDelete={() => handleDeleteChapter(chapter.id)}
                                        onImageSort={handleImageSort}
                                        onDeleteImage={(id, url) => { }} // Handle this later
                                        sortable={false}
                                    />
                                ))}
                            </div>
                        ) : (
                            <ReactSortable
                                list={filteredChapters}
                                setList={handleChapterSort}
                                handle=".drag-handle"
                                animation={200}
                                className="space-y-4"
                            >
                                {filteredChapters.map((chapter) => (
                                    <ChapterItem
                                        key={chapter.id}
                                        chapter={chapter}
                                        isExpanded={expandedChapters.has(chapter.id.toString())}
                                        toggleExpand={() => toggleChapter(chapter.id)}
                                        onEdit={() => { setSelectedChapter(chapter); setIsSheetOpen(true); }}
                                        onDelete={() => handleDeleteChapter(chapter.id)}
                                        onImageSort={handleImageSort}
                                        onDeleteImage={(id, url) => { }}
                                        sortable={true}
                                    />
                                ))}
                            </ReactSortable>
                        )}

                        {filteredChapters.length === 0 && (
                            <div className="py-20 text-center opacity-30">
                                <Search className="w-12 h-12 mx-auto mb-4" />
                                <p className="font-black uppercase text-xs tracking-widest">Không tìm thấy chương nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-2xl bg-[#0C1121] border-white/10 p-0 overflow-hidden">
                    <div className="p-8 border-b border-white/5">
                        <SheetTitle className="text-2xl font-black uppercase italic text-white">
                            {selectedChapter ? "Cập nhật chương" : "Đăng chương mới"}
                        </SheetTitle>
                    </div>
                    <div className="p-8 h-full overflow-y-auto pb-32">
                        <FromChapter
                            albumId={albumId}
                            chapter={selectedChapter}
                            nextOrder={chapters.length + 1}
                            onSuccess={() => { setIsSheetOpen(false); fetchAlbum(); }}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

const ChapterItem = ({ chapter, isExpanded, toggleExpand, onEdit, onDelete, onImageSort, onDeleteImage, sortable }: any) => {
    return (
        <div className={`border rounded-[1.5rem] transition-all duration-300 ${isExpanded ? 'bg-white/10 border-blue-500/50 shadow-2xl' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
            <div className="p-6 flex items-center gap-4">
                {sortable && (
                    <div className="drag-handle cursor-move p-2 hover:bg-white/5 rounded-lg text-gray-600">
                        <GripVertical className="w-5 h-5 shadow-lg" />
                    </div>
                )}

                <div className="flex-1 min-w-0" onClick={toggleExpand}>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded italic">Chương {chapter.order_sort}</span>
                        <span className="text-[9px] text-gray-500 uppercase font-bold">{chapter.chapter_images?.length || 0} Ảnh</span>
                    </div>
                    <h3 className="font-black text-lg text-white truncate italic uppercase tracking-tight">{chapter.title || "Tập chưa đặt tên"}</h3>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={onEdit} className="w-10 h-10 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl">
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onDelete} className="w-10 h-10 hover:bg-red-600/10 text-gray-400 hover:text-red-500 rounded-xl">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleExpand}
                        className={`w-10 h-10 rounded-xl ${isExpanded ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 p-6 bg-black/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Quản lý nội dung trang truyện</span>
                            <Button onClick={onEdit} size="sm" className="h-8 bg-blue-600 text-[9px] font-black uppercase px-4 rounded-lg">Thêm ảnh nhanh</Button>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                            {chapter.chapter_images?.map((img: any) => (
                                <div key={img.id} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 group">
                                    <ImageComponents image={{ src: img.image_url, name: "p" }} />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="flex flex-col gap-2">
                                            <Button size="icon" variant="ghost" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20"><Eye className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="destructive" className="w-8 h-8 rounded-full"><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                    <div className="absolute top-1 left-1 bg-black/60 px-1 rounded text-[8px] font-black">{img.order_sort}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};