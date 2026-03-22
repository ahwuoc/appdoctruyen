"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Layers,
    Users,
    MessageSquare,
    TrendingUp,
    ArrowUpRight,
    Plus,
    Activity,
    Zap,
    Clock,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { getDashboardStats } from "@/app/(action)/dashboard";
import Image from "next/image";
import Link from "next/link";

interface DashboardStats {
    totalAlbums: number;
    totalChapters: number;
    totalComments: number;
    totalUsers: number;
}

interface RecentAlbum {
    id: number;
    title: string;
    updated_at: string;
    image_url: string;
}

import { siteConfig } from "@/config/site";

const DashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalAlbums: 0,
        totalChapters: 0,
        totalComments: 0,
        totalUsers: 0
    });
    const [latestAlbums, setLatestAlbums] = useState<RecentAlbum[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = React.useCallback(async () => {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data.stats);
        setLatestAlbums(data.latestAlbums);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    // --- Custom SVG Chart (Cyber Look) ---
    const chartData = [10, 25, 15, 45, 30, 65, 55, 80, 70, 95];
    const chartMax = Math.max(...chartData);
    const chartHeight = 120;
    const chartWidth = 500;
    const points = chartData.map((val, i) => ({
        x: (i / (chartData.length - 1)) * chartWidth,
        y: chartHeight - (val / chartMax) * chartHeight
    }));
    const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

    return (
        <div className="min-h-screen bg-mimi-deep text-white p-6 md:p-10 selection:bg-mimi-cyan/30 font-sans overflow-x-hidden">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto space-y-12 relative z-10"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full shadow-[0_0_10px_#3b82f6]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 opacity-80">
                                Global Control Matrix
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-display font-black tracking-tighter uppercase italic leading-none bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent">
                            DASH<span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">BOARD</span>
                        </h1>
                        <p className="text-mimi-muted font-medium text-sm border-l-2 border-mimi-blue/30 pl-4 py-1 italic">
                            Giám sát hiệu năng và quản trị nội dung hệ thống {siteConfig.name}.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex items-center gap-4">
                        <Button
                            asChild
                            className="h-16 px-10 bg-mimi-blue text-white hover:bg-mimi-blue/80 hover:scale-105 transition-all duration-300 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] active:scale-95 border-none"
                        >
                            <Link href="/manager/album/index">
                                <Plus size={20} strokeWidth={4} />
                                Đăng truyện mới
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Tổng Tác Phẩm"
                        value={stats.totalAlbums}
                        icon={<BookOpen className="w-6 h-6" />}
                        trend="+12%"
                        color="blue"
                        loading={loading}
                    />
                    <StatCard
                        label="Tổng Chapters"
                        value={stats.totalChapters}
                        icon={<Layers className="w-6 h-6" />}
                        trend="+4.5%"
                        color="purple"
                        loading={loading}
                    />
                    <StatCard
                        label="Người dùng"
                        value={stats.totalUsers}
                        icon={<Users className="w-6 h-6" />}
                        trend="+28%"
                        color="cyan"
                        loading={loading}
                    />
                    <StatCard
                        label="Bình luận"
                        value={stats.totalComments}
                        icon={<MessageSquare className="w-6 h-6" />}
                        trend="+8%"
                        color="orange"
                        loading={loading}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Activity Chart Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
                        <Card className="bg-mimi-card/40 backdrop-blur-3xl border-mimi-border rounded-[40px] overflow-hidden shadow-2xl relative">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-display font-black tracking-tight uppercase italic flex items-center gap-3">
                                            <TrendingUp className="text-mimi-blue w-5 h-5" />
                                            Lưu lượng truy cập
                                        </CardTitle>
                                        <CardDescription className="text-mimi-muted font-medium">Thống kê lượt xem trong 30 ngày qua</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="h-[250px] w-full flex items-end justify-center relative mt-4">
                                    <svg width="100%" height="200" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" className="overflow-visible">
                                        <path d={pathData} fill="none" stroke="url(#gradient-line)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        <defs>
                                            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#3b82f6" />
                                                <stop offset="50%" stopColor="#8b5cf6" />
                                                <stop offset="100%" stopColor="#06b6d4" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute bottom-[-20px] left-0 w-full flex justify-between text-[10px] font-black uppercase text-mimi-muted tracking-widest px-1">
                                        <span>JAN</span>
                                        <span>OCT</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                            <QuickAction label="Sửa Truyện" icon={<Zap className="w-5 h-5" />} color="blue" href="/manager/album/index" />
                            <QuickAction label="Quản lý Tag" icon={<TrendingUp className="w-5 h-5" />} color="purple" href="#" />
                            <QuickAction label="Cài đặt Site" icon={<Zap className="w-5 h-5" />} color="cyan" href="#" />
                        </div>
                    </motion.div>

                    {/* Recent Activity Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                        <div className="relative p-[1px] rounded-[40px] bg-gradient-to-b from-mimi-border to-transparent overflow-hidden h-full">
                            <div className="bg-mimi-card/30 backdrop-blur-3xl rounded-[39px] h-full overflow-hidden shadow-2xl flex flex-col">
                                <div className="p-8 border-b border-mimi-border bg-gradient-to-br from-mimi-hover to-transparent">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-mimi-blue/10 rounded-2xl border border-mimi-blue/20">
                                            <Activity className="w-5 h-5 text-mimi-cyan" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-black text-xl tracking-tight uppercase italic">Hoạt động</h3>
                                            <p className="text-[10px] text-mimi-muted font-bold uppercase tracking-widest">LIVE UPDATES</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 space-y-6 overflow-y-auto scrollbar-hide">
                                    {loading ? (
                                        <div className="p-4 text-center text-mimi-muted uppercase font-black text-xs tracking-widest">Loading...</div>
                                    ) : (
                                        latestAlbums.map((album, i) => (
                                            <ActivityItem
                                                key={album.id}
                                                title={album.title}
                                                time={format(new Date(album.updated_at), 'HH:mm')}
                                                date={format(new Date(album.updated_at), 'dd/MM')}
                                                image={album.image_url}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

const StatCard = ({ label, value, icon, trend, color, loading }: { label: string, value: number, icon: React.ReactNode, trend: string, color: string, loading: boolean }) => {
    const textColors: Record<string, string> = {
        blue: "text-mimi-blue",
        purple: "text-mimi-purple",
        cyan: "text-mimi-cyan",
        orange: "text-orange-500"
    };

    return (
        <motion.div whileHover={{ y: -4 }} className="relative group cursor-pointer">
            <div className="relative p-7 bg-mimi-card border border-mimi-border rounded-[35px] shadow-2xl overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-mimi-hover rounded-2xl border border-mimi-border">
                        {icon}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/5 border border-green-500/10 rounded-full">
                        <ArrowUpRight className="w-3 h-3 text-green-400" />
                        <span className="text-[10px] font-black text-green-400">{trend}</span>
                    </div>
                </div>
                <div>
                    <p className="text-mimi-muted text-[10px] uppercase font-black tracking-widest">{label}</p>
                    <h4 className={`text-4xl font-display font-black tracking-tighter tabular-nums leading-none ${textColors[color]}`}>
                        {loading ? "..." : value.toLocaleString()}
                    </h4>
                </div>
            </div>
        </motion.div>
    );
};

const ActivityItem = ({ title, time, date, image }: { title: string, time: string, date: string, image: string }) => (
    <div className="flex items-center gap-4 group cursor-pointer p-2 rounded-2xl hover:bg-mimi-hover transition-colors">
        <div className="relative w-12 h-16 rounded-xl overflow-hidden border border-mimi-border shrink-0">
            <Image src={image || "https://placehold.co/400x600/121624/white?text=No+Cover"} alt={title} fill className="object-cover" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-white/90 truncate uppercase italic">{title}</h4>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-mimi-muted font-bold">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{time}</span>
                <span className="text-mimi-blue/60 uppercase tracking-widest">{date}</span>
            </div>
        </div>
    </div>
);

const QuickAction = ({ label, icon, color, href }: { label: string, icon: React.ReactNode, color: string, href: string }) => {
    const hoverColors: Record<string, string> = {
        blue: "hover:border-blue-500/50 hover:bg-blue-500/10",
        purple: "hover:border-purple-500/50 hover:bg-purple-500/10",
        cyan: "hover:border-cyan-500/50 hover:bg-cyan-500/10",
    };

    return (
        <Link href={href} className={`flex flex-col items-center justify-center gap-4 p-8 bg-mimi-card/50 border border-mimi-border rounded-[32px] transition-all group ${hoverColors[color]}`}>
            <div className="p-4 bg-mimi-hover rounded-2xl border border-mimi-border group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
        </Link>
    );
};

export default DashboardPage;
