"use client";

import React, { useState, useEffect } from "react";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "@/app/(action)/category";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Save,
    X,
    Tag,
    Info,
    RefreshCcw,
    Layers,
    Layout
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Category {
    id: number;
    title: string;
    content: string | null;
}

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ title: "", content: "" });
    const [newForm, setNewForm] = useState({ title: "", content: "" });
    const [showNewForm, setShowNewForm] = useState(false);
    const { toast } = useToast();

    const fetchCategories = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data as Category[]);
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể lấy danh sách thể loại", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCreate = async () => {
        if (!newForm.title.trim()) return toast({ title: "Lỗi", description: "Tiêu đề không được để trống", variant: "destructive" });
        try {
            await createCategory(newForm.title, newForm.content);
            toast({ title: "Thành công", description: "Đã thêm thể loại mới" });
            setNewForm({ title: "", content: "" });
            setShowNewForm(false);
            fetchCategories();
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể thêm thể loại", variant: "destructive" });
        }
    };

    const handleUpdate = async (id: number) => {
        if (!editForm.title.trim()) return toast({ title: "Lỗi", description: "Tiêu đề không được để trống", variant: "destructive" });
        try {
            await updateCategory(id, editForm.title, editForm.content);
            toast({ title: "Thành công", description: "Đã cập nhật thể loại" });
            setIsEditing(null);
            fetchCategories();
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể cập nhật", variant: "destructive" });
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc muốn xóa thể loại này? Các truyện thuộc thể loại này có thể bị ảnh hưởng.")) return;
        try {
            await deleteCategory(id);
            toast({ title: "Thành công", description: "Đã xóa thể loại" });
            fetchCategories();
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể xóa thể loại", variant: "destructive" });
        }
    };

    const startEditing = (category: Category) => {
        setIsEditing(category.id);
        setEditForm({ title: category.title, content: category.content || "" });
    };

    const filteredCategories = categories.filter(cat =>
        cat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-mimi-dark text-white p-4 md:p-10 selection:bg-mimi-blue/30 overflow-x-hidden relative">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-mimi-cyan/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-mimi-purple/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-12 relative z-10"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-[2px] w-12 bg-gradient-to-r from-mimi-cyan to-transparent rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-mimi-cyan/80 opacity-80">
                                Taxonomy Structure Interface
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-display font-black tracking-tighter uppercase italic leading-none bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent">
                            GENRE <span className="bg-gradient-to-r from-mimi-cyan to-mimi-purple bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">CORE</span>
                        </h1>
                        <p className="text-mimi-muted font-medium text-sm border-l-2 border-mimi-cyan/30 pl-4 py-1 italic">
                            Phân loại nội dung, quản lý cấu trúc thẻ và danh mục hệ thống.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mimi-muted group-focus-within:text-mimi-cyan transition-colors" />
                            <Input
                                placeholder="Filter taxonomy by title..."
                                className="h-14 w-64 pl-12 bg-mimi-deep border-mimi-border rounded-2xl focus:border-mimi-cyan/50 focus:ring-0 transition-all font-bold placeholder:text-mimi-muted/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => setShowNewForm(true)}
                            className="h-14 px-8 rounded-2xl bg-mimi-blue text-white hover:bg-mimi-blue/80 transition-all font-black uppercase text-[10px] tracking-widest gap-2 shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
                        >
                            <Plus className="w-4 h-4" />
                            Initialize Genre
                        </Button>
                        <Button
                            onClick={fetchCategories}
                            className="h-14 w-14 rounded-2xl bg-mimi-deep border border-mimi-border hover:bg-mimi-hover transition-all p-0 flex items-center justify-center"
                        >
                            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* New Form Section */}
                <AnimatePresence>
                    {showNewForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <Card className="bg-mimi-glass/10 backdrop-blur-3xl border-mimi-cyan/20 rounded-[2.5rem] p-8 shadow-2xl relative">
                                <div className="absolute top-6 right-6">
                                    <Button variant="ghost" size="icon" onClick={() => setShowNewForm(false)} className="rounded-full hover:bg-white/10">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                                <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-mimi-cyan ml-1">Genre Label</label>
                                            <Input
                                                placeholder="e.g., Cyberpunk, Fantasy"
                                                className="h-14 bg-mimi-deep border-mimi-border rounded-2xl focus:border-mimi-cyan/50 focus:ring-0 text-white font-bold"
                                                value={newForm.title}
                                                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-mimi-muted ml-1">Description Metadata</label>
                                            <Textarea
                                                placeholder="Describe the aesthetic and characteristic themes of this genre..."
                                                className="h-14 min-h-[56px] bg-mimi-deep border-mimi-border rounded-2xl focus:border-mimi-cyan/50 focus:ring-0 text-white font-medium scrollbar-hide"
                                                value={newForm.content}
                                                onChange={(e) => setNewForm({ ...newForm, content: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex justify-end pt-2">
                                            <Button
                                                onClick={handleCreate}
                                                className="h-14 px-12 rounded-2xl bg-mimi-cyan text-black hover:bg-mimi-cyan/80 transition-all font-black uppercase text-[10px] tracking-widest shadow-[0_10px_30px_rgba(6,182,212,0.3)]"
                                            >
                                                Commit to Ledger
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Table Section */}
                <Card className="bg-mimi-card/40 backdrop-blur-3xl border-mimi-border rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-mimi-deep/50">
                                <TableRow className="border-mimi-border hover:bg-transparent">
                                    <TableHead className="w-20 text-center font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em] py-8 border-r border-mimi-border/20">ID</TableHead>
                                    <TableHead className="w-1/4 font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em] px-8">Taxonomy Label</TableHead>
                                    <TableHead className="font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em]">Context & Definition</TableHead>
                                    <TableHead className="text-right font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em] pr-12 w-48 text-center">Protocol</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-[400px] text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-12 h-12 border-4 border-mimi-cyan/20 border-t-mimi-cyan rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.2)]" />
                                                    <span className="text-mimi-muted uppercase font-black tracking-[0.3em] text-[10px]">Scanning Genre Nodes...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredCategories.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-[400px] text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-30">
                                                    <Layout className="w-16 h-16 text-mimi-muted" />
                                                    <span className="text-mimi-muted uppercase font-black tracking-[0.3em] text-[10px]">No classifications found</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <motion.tr
                                                key={category.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="border-mimi-border hover:bg-white/[0.02] transition-all group"
                                            >
                                                <TableCell className="text-center py-8 border-r border-mimi-border/20">
                                                    <span className="font-mono text-[10px] text-mimi-muted group-hover:text-mimi-cyan transition-colors font-black">
                                                        {category.id.toString().padStart(3, '0')}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-8">
                                                    {isEditing === category.id ? (
                                                        <Input
                                                            className="bg-mimi-deep border-mimi-cyan/30 rounded-xl h-10 font-bold"
                                                            value={editForm.title}
                                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-mimi-cyan/10 flex items-center justify-center text-mimi-cyan border border-mimi-cyan/20 group-hover:scale-110 transition-transform">
                                                                <Tag className="w-4 h-4" />
                                                            </div>
                                                            <h4 className="font-black text-lg text-white group-hover:text-mimi-cyan transition-colors uppercase italic tracking-tighter">
                                                                {category.title}
                                                            </h4>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {isEditing === category.id ? (
                                                        <Textarea
                                                            className="bg-mimi-deep border-mimi-cyan/30 rounded-xl min-h-[40px] font-medium"
                                                            value={editForm.content}
                                                            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                                        />
                                                    ) : (
                                                        <div className="flex items-center gap-2 group/info">
                                                            <Info className="w-4 h-4 text-mimi-muted/50 group-hover/info:text-mimi-cyan transition-colors shrink-0" />
                                                            <p className="text-mimi-muted font-medium text-sm line-clamp-1 italic">
                                                                {category.content || "Null metadata provided."}
                                                            </p>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="pr-12">
                                                    <div className="flex justify-center gap-2 transition-all duration-300">
                                                        {isEditing === category.id ? (
                                                            <>
                                                                <Button
                                                                    onClick={() => handleUpdate(category.id)}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-10 h-10 rounded-xl bg-mimi-cyan text-black hover:bg-mimi-cyan/80 transition-all shadow-lg"
                                                                >
                                                                    <Save className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    onClick={() => setIsEditing(null)}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-10 h-10 rounded-xl bg-white/15 border border-white/10 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    onClick={() => startEditing(category)}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-10 h-10 rounded-xl bg-white/15 border border-white/10 hover:bg-mimi-blue hover:text-white transition-all shadow-lg"
                                                                >
                                                                    <Edit className="w-4 h-4 text-mimi-blue" />
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleDelete(category.id)}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="w-10 h-10 rounded-xl bg-white/15 border border-white/10 hover:bg-rose-600 hover:text-white transition-all shadow-lg"
                                                                >
                                                                    <Trash2 className="w-4 h-4 text-rose-600" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Info Footer */}
                <div className="flex items-center justify-between px-12 text-[10px] font-black uppercase text-mimi-muted tracking-[0.2em] opacity-50 italic">
                    <div className="flex items-center gap-2 border-l border-mimi-cyan/20 pl-4">
                        <Layers className="w-4 h-4" />
                        Total Managed Nodes: {categories.length}
                    </div>
                    <div>
                        System Sync: [SECURE_ENCRYPTED_LINK]
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CategoryManagementPage;
