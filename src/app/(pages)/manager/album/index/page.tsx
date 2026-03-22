"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Plus,
    Pencil,
    Trash2,
    ListOrdered,
    Image as ImageIcon,
    Filter
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getAlbums, DeleteAlbum } from "../../../../(action)/album";
import { logoutUserAction } from "../../../../(action)/auth";
import { AlbumType } from "../../../../utils/types/type";
import FormAlbum from "./AlbumFormDrawer";
import { Badge } from "@/components/ui/badge";
import { useToast } from "../../../../../hooks/use-toast";

const ComicAlbumPage = () => {
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<AlbumType | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const fetchAlbums = async () => {
        setLoading(true);
        try {
            const data = await getAlbums();
            const cleanedData = data.map((album) => ({
                ...album,
                title: album.title ?? "Không có tiêu đề",
                content: album.content ?? "",
                image_url: album.image_url ?? "",
            }));
            setAlbums(cleanedData as AlbumType[]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    const openForm = (album?: AlbumType) => {
        setSelectedAlbum(album);
        setIsOpen(true);
    };

    const closeForm = () => {
        setIsOpen(false);
        setSelectedAlbum(undefined);
    };

    const handleDeleteAlbum = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa album này? Toàn bộ chapter và ảnh sẽ bị mất vĩnh viễn!")) return;

        try {
            const result = await DeleteAlbum(id);
            if (result.success) {
                toast({
                    title: "Thành công",
                    description: "Đã xóa bộ truyện khỏi hệ thống!",
                });
                fetchAlbums();
            } else {
                throw new Error("Xóa thất bại");
            }
        } catch (error) {
            toast({
                title: "Lỗi",
                description: "Không thể xóa bộ truyện. Vui lòng thử lại sau!",
                variant: "destructive"
            });
        }
    };



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-mimi-dark text-white p-4 md:p-10 selection:bg-mimi-cyan/30 overflow-x-hidden relative"
        >
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Global Glow Effects */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
                </div>

                {/* Header */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-[2px] w-12 bg-gradient-to-r from-mimi-cyan to-transparent rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-mimi-cyan/80 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                                Command Center / Content
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter uppercase italic leading-none bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent">
                            KHO <span className="bg-gradient-to-r from-mimi-cyan to-mimi-blue bg-clip-text text-transparent drop-shadow-2xl">TRUYỆN</span>
                        </h1>
                        <div className="flex items-center gap-4 text-mimi-muted border-l-2 border-mimi-cyan/30 pl-6 py-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black tracking-widest text-mimi-muted">Database Status</span>
                                <span className="text-white font-black text-xl tabular-nums">{albums.length} <span className="text-mimi-muted text-sm font-bold italic">Tác phẩm</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            className="h-16 px-6 bg-white/[0.02] border-white/5 rounded-2xl hover:bg-white/10 text-mimi-muted transition-all gap-2 group"
                        >
                            <Filter className="w-5 h-5 group-hover:text-mimi-cyan transition-colors" />
                            <span className="hidden sm:inline font-black uppercase text-[10px] tracking-widest">Filter System</span>
                        </Button>

                        <div className="flex items-center gap-4">

                            <Button
                                onClick={() => {
                                    setSelectedAlbum(undefined);
                                    setIsOpen(true);
                                }}
                                className="relative overflow-hidden bg-mimi-blue text-white hover:bg-mimi-blue/80 hover:scale-105 transition-all duration-300 rounded-2xl h-16 px-10 font-black flex items-center gap-3 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] active:scale-95"
                            >
                                <Plus size={24} strokeWidth={3} />
                                <span className="uppercase italic tracking-tighter text-lg">Phát hành mới</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="relative z-10">
                    <Card className="bg-mimi-card/40 backdrop-blur-3xl border-white/[0.05] rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-white/[0.02]">
                                        <TableRow className="border-white/[0.05] hover:bg-transparent">
                                            <TableHead className="w-24 text-center font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em] py-8">UID</TableHead>
                                            <TableHead className="w-32 font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em]">Visual</TableHead>
                                            <TableHead className="font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em]">Metadata & Info</TableHead>
                                            <TableHead className="hidden lg:table-cell font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em] text-center">Classification</TableHead>
                                            <TableHead className="text-right font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em] pr-12">Control</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-[500px] text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                                                        <span className="text-slate-500 uppercase font-black tracking-[0.3em] text-xs">Accessing Database...</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            albums.map((album) => (
                                                <TableRow key={album.id} className="border-white/[0.03] hover:bg-white/[0.02] transition-all group">
                                                    <TableCell className="text-center">
                                                        <span className="font-mono text-mimi-muted group-hover:text-mimi-cyan transition-colors font-bold">
                                                            ID_{album.id.toString().padStart(4, '0')}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-8">
                                                        <div className="relative w-24 h-32 rounded-[2rem] overflow-hidden border-2 border-white/[0.05] group-hover:border-mimi-cyan/50 group-hover:scale-105 transition-all duration-500 shadow-2xl">
                                                            <Image src={album.image_url || "https://placehold.co/400x600/121624/white?text=No+Cover"} alt="Cover" fill className="object-cover" unoptimized />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-2">
                                                            <h3 className="font-black text-2xl text-white group-hover:text-mimi-cyan transition-colors uppercase italic tracking-tighter">
                                                                {album.title}
                                                            </h3>
                                                            <div className="flex items-center gap-4">
                                                                <p className="text-mimi-muted text-sm font-medium line-clamp-2 leading-relaxed max-w-md group-hover:text-slate-400 transition-colors">
                                                                    {album.content || "No intel available for this asset."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden lg:table-cell text-center">
                                                        <div className="flex flex-wrap justify-center gap-2">
                                                            {album.categories?.slice(0, 3).map(cat => (
                                                                <Badge key={cat.id} variant="outline" className="bg-cyan-500/5 border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                                                                    {cat.title}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-12">
                                                        <div className="flex justify-end gap-3 transition-all duration-300">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-12 h-12 rounded-2xl bg-white/15 border border-white/10 hover:bg-mimi-cyan hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all shadow-lg"
                                                                onClick={() => openForm(album)}
                                                            >
                                                                <Pencil className="w-5 h-5 text-mimi-cyan" />
                                                            </Button>
                                                            <Link href={`/manager/album/index/${album.id}`}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-12 h-12 rounded-2xl bg-white/15 border border-white/10 hover:bg-mimi-blue hover:text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all shadow-lg"
                                                                >
                                                                    <ListOrdered className="w-5 h-5 text-mimi-blue" />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-12 h-12 rounded-2xl bg-white/15 border border-white/10 hover:bg-rose-600 hover:text-white hover:shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all shadow-lg"
                                                                onClick={() => handleDeleteAlbum(album.id)}
                                                            >
                                                                <Trash2 className="w-5 h-5 text-rose-600" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Premium Sheet */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent className="w-full sm:max-w-xl bg-mimi-deep/95 backdrop-blur-[50px] border-white/5 p-0 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] z-[100]">
                    <SheetHeader className="p-10 border-b border-white/5 bg-white/[0.02]">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-mimi-cyan">Asset Management</span>
                            <SheetTitle className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                                {selectedAlbum ? "Update Operations" : "Initialize New Asset"}
                            </SheetTitle>
                        </div>
                    </SheetHeader>
                    <div className="h-full overflow-y-auto px-10 py-10 pb-40 scrollbar-hide">
                        <FormAlbum album={selectedAlbum} onSuccess={() => { closeForm(); fetchAlbums(); }} />
                    </div>
                </SheetContent>
            </Sheet>
        </motion.div>
    );
};

export default ComicAlbumPage;