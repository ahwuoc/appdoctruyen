"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ImagePlus,
    Type,
    AlignLeft,
    Tags,
    X,
    Check,
    Loader2,
    Sparkles
} from "lucide-react";

import { AlbumInput, albumSchema } from "../../../../../lib/schema/schema-album";
import { PostAlbum, UpdateAlbum } from "../../../../(action)/album";
import { getCategories } from "../../../../(action)/category";
import { AlbumType, CategoryType } from "../../../../utils/types/type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "../../../../../hooks/use-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    album?: AlbumType;
    onSuccess: () => void;
}

const FromAlbum: React.FC<Props> = ({ album, onSuccess }) => {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const { control, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<AlbumInput>({
        resolver: zodResolver(albumSchema),
        defaultValues: {
            title: "",
            content: "",
            categoryIds: [],
            imageFile: undefined
        },
    });

    const categoryIds = watch("categoryIds");

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (album) {
            setValue("title", album.title);
            setValue("content", album.content);
            setValue("categoryIds", album.categories.map(c => c.id));
            setPreviewImage(album.image_url);
        } else {
            reset();
            setPreviewImage(null);
        }
    }, [album, setValue, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("imageFile", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const toggleCategory = (id: number) => {
        const currentIds = [...categoryIds];
        const index = currentIds.indexOf(id);
        if (index > -1) {
            currentIds.splice(index, 1);
        } else {
            currentIds.push(id);
        }
        setValue("categoryIds", currentIds);
    };

    const onFinish = async (data: AlbumInput) => {
        setIsLoading(true);
        try {
            if (album) {
                await UpdateAlbum(album.id, data);
                toast({ title: "Thành công", description: "Cập nhật bộ truyện thành công!" });
            } else {
                await PostAlbum(data);
                toast({ title: "Thành công", description: "Đăng đăng bộ truyện mới thành công!" });
            }
            onSuccess();
        } catch (error) {
            console.error("Lỗi:", error);
            toast({ title: "Lỗi", description: "Không thể lưu bộ truyện. Vui lòng kiểm tra lại!", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative h-full pb-32">
            <form onSubmit={handleSubmit(onFinish)}>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-10"
                >
                    {/* Image Upload Area */}
                    <div className="group relative">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-4 block flex items-center gap-2">
                            <ImagePlus className="w-4 h-4" /> ẢNH BÌA TRUYỆN (3:4.5)
                        </Label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative aspect-[3/4.5] w-full max-w-[220px] mx-auto rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-white/5 overflow-hidden transition-all duration-500 cursor-pointer flex flex-col items-center justify-center gap-4 group/img shadow-2xl ${previewImage ? 'border-solid' : ''}`}
                        >
                            {previewImage ? (
                                <>
                                    <Image
                                        src={previewImage}
                                        alt="Preview"
                                        fill
                                        className="object-cover group-hover/img:scale-110 transition-transform duration-700"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <div className="bg-white/20 p-4 rounded-full border border-white/40 shadow-2xl scale-50 group-hover/img:scale-100 transition-transform">
                                            <ImagePlus className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-6 space-y-4">
                                    <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto border border-blue-600/20 group-hover:bg-blue-600/30 transition-all">
                                        <ImagePlus className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <div className="space-y-1 px-4">
                                        <p className="text-[10px] font-black text-white tracking-widest uppercase mb-1">Upload Poster</p>
                                        <p className="text-[8px] text-gray-500 uppercase tracking-tighter opacity-50 italic leading-tight">Click để chọn ảnh bìa sắc nét (600x900px)</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {errors.imageFile && <p className="text-red-500 text-[10px] font-black text-center mt-3 uppercase tracking-widest animate-bounce">{errors.imageFile.message}</p>}
                    </div>

                    {/* Title */}
                    <div className="space-y-4">
                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2 pr-2">
                            <Type className="w-4 h-4" /> THÔNG TIN TÊN TÁC PHẨM
                        </Label>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    className="h-16 bg-white/[0.03] border-white/5 rounded-2xl focus:border-blue-500/50 focus:ring-blue-500/20 text-white font-black text-xl placeholder:text-gray-800 outline-none transition-all px-8 uppercase tracking-tighter italic"
                                    placeholder="Nhập tên truyện..."
                                />
                            )}
                        />
                        {errors.title && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-2">{errors.title.message}</p>}
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2">
                            <AlignLeft className="w-4 h-4" /> TÓM TẮT CỐT TRUYỆN
                        </Label>
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    className="min-h-[160px] bg-white/[0.03] border-white/5 rounded-[1.5rem] focus:border-blue-500/50 focus:ring-blue-500/20 text-gray-200 leading-relaxed placeholder:text-gray-800 resize-none p-8 text-sm font-medium"
                                    placeholder="Viết lời giới thiệu ấn tượng..."
                                />
                            )}
                        />
                        {errors.content && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-2">{errors.content.message}</p>}
                    </div>

                    {/* Categories Selector */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2">
                                <Tags className="w-4 h-4" /> CHỌN PHÂN LOẠI THỂ LOẠI
                            </Label>
                            <Badge variant="outline" className="bg-blue-600/10 border-blue-500/20 text-blue-400 font-black text-[9px] px-3">{categoryIds.length} ĐÃ CHỌN</Badge>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 max-h-[400px] overflow-y-auto scrollbar-hide">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 active:scale-95 ${categoryIds.includes(cat.id) ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.1)]' : 'bg-transparent border-transparent text-gray-600 hover:bg-white/5'}`}
                                >
                                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${categoryIds.includes(cat.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-800'}`}>
                                        {categoryIds.includes(cat.id) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter truncate">{cat.title}</span>
                                </div>
                            ))}
                        </div>
                        {errors.categoryIds && <p className="text-red-500 text-[10px] font-black uppercase text-center mt-3 tracking-widest">{errors.categoryIds.message}</p>}
                    </div>

                    {/* Action Bar Spacer */}
                    <div className="h-40" />
                </motion.div>

                {/* Sticky Action Bar */}
                <div className="absolute -left-10 -right-10 bottom-0 p-10 pt-12 bg-gradient-to-t from-[#0C1121] via-[#0C1121]/95 to-transparent border-t border-white/5 z-50">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg gap-3 shadow-[0_15px_50px_rgba(37,99,235,0.4)] transition-all active:scale-95 group/btn overflow-hidden relative"
                    >
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}
                                    className="flex items-center gap-3"
                                >
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>ĐANG XỬ LÝ DỮ LIỆU...</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}
                                    className="flex items-center gap-3"
                                >
                                    <Sparkles className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />
                                    <span>{album ? "LƯU THÔNG TIN CẬP NHẬT" : "XÁC NHẬN ĐĂNG BỘ TRUYỆN"}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FromAlbum;
