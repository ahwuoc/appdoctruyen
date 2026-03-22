"use client";

import React, { useState, useEffect, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ImagePlus,
    Type,
    Hash,
    X,
    Loader2,
    ImageIcon,
    CheckCircle2
} from "lucide-react";

import { ChapterInput, chapterSchema } from "../../../../../../lib/schema/schema-chapter";
import { PostChapter, UpdateChapterDetails, DeleteImage } from "../../../../../(action)/chapter";
import { uploadChapterImageClient } from "../../../../../services/UploadService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    albumId: number;
    chapter?: {
        id: number;
        title: string;
        content?: string;
        order_sort: number;
        chapter_images?: { id: number; image_url: string; order_sort: number }[]
    };
    onSuccess: () => void;
    nextOrder?: number;
}

interface PreviewImage {
    id: string | number;
    url: string;
    file?: File;
    isExisting: boolean;
}

const FromChapter: React.FC<Props> = ({ albumId, chapter, onSuccess, nextOrder }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const { control, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<ChapterInput>({
        resolver: zodResolver(chapterSchema),
        defaultValues: {
            title: "",
            content: "",
            order_sort: nextOrder || 1,
            imageFiles: []
        },
    });

    useEffect(() => {
        if (chapter) {
            setValue("title", chapter.title);
            setValue("content", chapter.content);
            setValue("order_sort", chapter.order_sort);

            if (chapter.chapter_images) {
                const existingPreviews = chapter.chapter_images.map(img => ({
                    id: img.id,
                    url: img.image_url,
                    isExisting: true
                }));
                setPreviewImages(existingPreviews);
            }
        } else {
            reset({
                title: `Chương ${nextOrder || 1}`,
                content: "",
                order_sort: nextOrder || 1,
                imageFiles: []
            });
            setPreviewImages([]);
        }
    }, [chapter, setValue, reset, nextOrder]);

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSelectedFiles = Array.from(e.target.files || []);
        if (newSelectedFiles.length > 0) {
            newSelectedFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
            const currentSelectedFiles = watch("imageFiles") || [];
            const allSelectedFiles = [...currentSelectedFiles, ...newSelectedFiles];
            const existingPreviews = previewImages.filter((p) => p.isExisting);
            const newPreviews = allSelectedFiles.map((file, idx) => ({
                id: `new-${Date.now()}-${idx}`,
                file,
                url: URL.createObjectURL(file),
                isExisting: false
            }));
            previewImages.forEach((img) => {
                if (!img.isExisting && img.url) URL.revokeObjectURL(img.url);
            });


            setPreviewImages([...existingPreviews, ...newPreviews]);
            setValue("imageFiles", allSelectedFiles);
        }
    };

    const handleSort = (newList: PreviewImage[]) => {
        setPreviewImages(newList);
        const sortedFiles = newList
            .filter((p) => !p.isExisting && p.file)
            .map((p) => p.file as File);
        setValue("imageFiles", sortedFiles);
    };

    const removeImage = async (index: number) => {
        const preview = previewImages[index];

        if (preview?.isExisting && preview.id) {
            if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn ảnh này khỏi hệ thống?")) return;
            try {
                await DeleteImage(preview.id as number, preview.url);
                toast({ title: "Đã xóa ảnh", description: "Ảnh đã được loại bỏ khỏi hệ thống." });
            } catch (error) {
                toast({ title: "Lỗi", description: "Không thể xóa ảnh!", variant: "destructive" });
                return;
            }
        }

        const newPreviewList = [...previewImages];
        const removed = newPreviewList.splice(index, 1)[0];

        // Revoke if it was a local file
        if (removed?.url && !removed.isExisting) {
            URL.revokeObjectURL(removed.url);
        }

        // Update imageFiles state for newly added files
        const remainingFiles = newPreviewList
            .filter((p) => !p.isExisting && p.file)
            .map((p) => p.file as File);

        setValue("imageFiles", remainingFiles);
        setPreviewImages(newPreviewList);
    };

    const onFinish = async (data: ChapterInput) => {
        setIsLoading(true);
        try {
            const uploadedUrls: string[] = [];

            // 1. Upload images directly from client if any
            if (data.imageFiles && data.imageFiles.length > 0) {
                setUploadProgress({ current: 0, total: data.imageFiles.length });

                for (let i = 0; i < data.imageFiles.length; i++) {
                    const url = await uploadChapterImageClient(data.imageFiles[i]);
                    uploadedUrls.push(url);
                    setUploadProgress(prev => ({ ...prev, current: i + 1 }));
                }
            }

            // 2. Prepare payload for server action
            const payload = {
                ...data,
                imageUrls: uploadedUrls,
                imageFiles: [] // Clear files after upload to avoid sending them to server action
            };

            if (chapter) {
                await UpdateChapterDetails(chapter.id, payload);
                toast({ title: "Thành công", description: "Cập nhật chương thành công!" });
            } else {
                await PostChapter(albumId, payload);
                toast({ title: "Thành công", description: "Đăng chương mới thành công!" });
            }
            onSuccess();
        } catch (error) {
            console.error("Lỗi:", error);
            toast({
                title: "Lỗi",
                description: `Không thể lưu chương: ${error instanceof Error ? error.message : "Vui lòng thử lại!"}`,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
            setUploadProgress({ current: 0, total: 0 });
        }
    };

    return (
        <form onSubmit={handleSubmit(onFinish)} className="relative h-full flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 space-y-8 pb-32"
            >
                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black tracking-widest text-mimi-blue uppercase flex items-center gap-2">
                            <Hash className="w-4 h-4" /> Số thứ tự (Tự động)
                        </Label>
                        <Controller
                            name="order_sort"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold text-center"
                                />
                            )}
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black tracking-widest text-mimi-blue uppercase flex items-center gap-2">
                            <Type className="w-4 h-4" /> Tên chương
                        </Label>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold"
                                    placeholder="Ví dụ: Chapter 1: Khởi đầu..."
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-[10px] font-black tracking-widest text-mimi-blue uppercase flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> TẢI LÊN HÌNH ẢNH NỘI DUNG ({previewImages.length} ảnh)
                    </Label>

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-mimi-blue/5 border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-mimi-blue/10 hover:border-mimi-blue/50 transition-all group"
                    >
                        <div className="w-16 h-16 bg-mimi-blue/20 rounded-full flex items-center justify-center border border-mimi-blue/30 group-hover:scale-110 transition-transform">
                            <ImagePlus className="w-8 h-8 text-mimi-blue" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black text-white uppercase tracking-widest">Chọn nhiều ảnh cùng lúc</p>
                            <p className="text-[10px] text-mimi-muted uppercase mt-1 italic">Kéo thả hoặc nhấp để tải lên toàn bộ chương</p>
                        </div>
                    </div>
                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFilesChange}
                        accept="image/*"
                    />

                    {/* Image Previews with Sortable */}
                    <ReactSortable
                        list={previewImages}
                        setList={handleSort}
                        animation={200}
                        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto p-2 scrollbar-hide"
                    >
                        <AnimatePresence>
                            {previewImages.map((img, index) => (
                                <motion.div
                                    key={img.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-white/5 group/preview cursor-move active:scale-95 transition-transform"
                                >
                                    <Image src={img.url} alt="Preview" fill className="object-cover pointer-events-none" unoptimized />
                                    <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[8px] font-black text-white/50 border border-white/5">
                                        #{index + 1}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-600/80 hover:bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity z-10"
                                    >
                                        <X size={12} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </ReactSortable>
                    {errors.imageFiles && <p className="text-red-500 text-[10px] font-black uppercase text-center">{errors.imageFiles.message}</p>}
                </div>
            </motion.div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-mimi-dark via-mimi-dark/95 to-transparent border-t border-white/5 z-20">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-16 bg-mimi-blue hover:bg-mimi-blue/80 text-white rounded-2xl font-black text-lg gap-3 shadow-[0_15px_40px_rgba(37,99,235,0.4)] active:scale-95 transition-all overflow-hidden relative"
                >
                    {isLoading && (
                        <div
                            className="absolute inset-0 bg-blue-400/20 transition-all duration-300"
                            style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                        {isLoading
                            ? `ĐANG TẢI ẢNH (${uploadProgress.current}/${uploadProgress.total})...`
                            : chapter ? "LƯU THAY ĐỔI CHƯƠNG" : "PHÁT HÀNH CHƯƠNG MỚI"
                        }
                    </span>
                </Button>
            </div>
        </form>
    );
};

export default FromChapter;
