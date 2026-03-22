"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    ShieldCheck,
    Calendar,
    LogOut,
    Edit3,
    Star,
    BookOpen,
    Settings,
    ShieldAlert
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import { logoutUserAction } from "@/app/(action)/auth";
import { useToast } from "@/hooks/use-toast";

interface UserData {
    id: string;
    email?: string;
    username?: string;
    role?: string;
    avatar_url?: string;
    created_at?: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                router.push("/login");
                return;
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", authUser.id)
                .single();

            setUser({
                id: authUser.id,
                email: authUser.email,
                username: profile?.username || "Người dùng",
                role: profile?.role || "USER",
                avatar_url: profile?.avatar_url,
                created_at: authUser.created_at
            });
            setLoading(false);
        };

        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        const result = await logoutUserAction();
        if (result.success) {
            toast({
                title: "Đã đăng xuất",
                description: "Hẹn gặp lại bạn sớm!",
            });
            router.push("/login");
            router.refresh();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const roleColors: Record<string, string> = {
        ADMIN: "text-red-400 bg-red-400/10 border-red-400/20",
        AUTHOR: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        USER: "text-gray-400 bg-gray-400/10 border-gray-400/20",
    };

    return (
        <div className="min-h-screen bg-[#070B14] text-white p-4 md:p-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header Profile */}
                <div className="relative mb-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/5 rounded-[40px] p-8 md:p-12 overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <User size={200} />
                    </div>

                    <div className="relative flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] bg-gradient-to-tr from-blue-500 to-purple-500 p-1">
                                <div className="w-full h-full rounded-[28px] bg-[#0C1121] flex items-center justify-center overflow-hidden">
                                    {user?.avatar_url ? (
                                        <Image 
                                            src={user.avatar_url} 
                                            alt="Avatar" 
                                            width={160} 
                                            height={160} 
                                            className="w-full h-full object-cover" 
                                            unoptimized
                                        />
                                    ) : (
                                        <User size={64} className="text-gray-500" />
                                    )}
                                </div>
                            </div>
                            <button className="absolute bottom-2 right-2 p-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/50">
                                <Edit3 size={18} />
                            </button>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user?.username}</h1>
                                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase border tracking-widest ${roleColors[user?.role || "USER"]}`}>
                                    {user?.role}
                                </span>
                            </div>
                            <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mb-6">
                                <Mail size={16} /> {user?.email}
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <button className="px-6 py-3 bg-white text-black rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                                    <Settings size={18} /> Cài đặt
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all"
                                >
                                    <LogOut size={18} /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thống kê nhanh */}
                    <div className="bg-[#0C1121] border border-white/5 rounded-[32px] p-6 space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Star size={18} className="text-yellow-400" /> Thông tin chung
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-gray-400">Trạng thái</span>
                                </div>
                                <span className="font-bold text-green-400">Kích hoạt</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                                        <Calendar size={20} />
                                    </div>
                                    <span className="text-gray-400">Tham gia từ</span>
                                </div>
                                <span className="font-bold">{user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : "..."}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quyền hạn */}
                    <div className="bg-[#0C1121] border border-white/5 rounded-[32px] p-6 space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <ShieldAlert size={18} className="text-red-500" /> Quyền hạn hệ thống
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 bg-white/5 rounded-2xl">
                                <div className="w-1.5 h-auto bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="font-bold mb-1">Quyền truy cập: {user?.role}</p>
                                    <p className="text-sm text-gray-500">
                                        {user?.role === 'ADMIN' && "Bạn có toàn quyền quản trị hệ thống, người dùng và nội dung."}
                                        {user?.role === 'AUTHOR' && "Bạn có quyền đăng truyện, quản lý chương và xem thống kê truyện của mình."}
                                        {user?.role === 'USER' && "Bạn có quyền đọc truyện, bình luận và theo dõi các tác giả yêu thích."}
                                    </p>
                                </div>
                            </div>
                            {user?.role !== 'USER' && (
                                <button
                                    onClick={() => router.push("/manager/album/index")}
                                    className="w-full py-4 bg-blue-600/10 text-blue-500 border border-blue-500/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <BookOpen size={18} /> Đi tới Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
