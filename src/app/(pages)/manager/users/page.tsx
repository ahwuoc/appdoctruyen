"use client";

import React, { useState, useEffect } from "react";
import {
    getUsers,
    updateUserRole,
    updateUserStatus,
    softDeleteUser,
    hardDeleteUser,
    getAllUsersIncludeDeleted,
    restoreUser
} from "@/app/(action)/user";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Ban,
    Trash2,
    UserCheck,
    Search,
    RefreshCcw,
    AlertCircle,
    UserMinus,
    Trash
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { format } from "date-fns";

interface User {
    id: string;
    username: string | null;
    avatar_url: string | null;
    role: string;
    status: string;
    created_at: string;
    deleted_at?: string | null;
}

const UserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleted, setShowDeleted] = useState(false);
    const { toast } = useToast();

    const fetchUsers = React.useCallback(async () => {
        setLoading(true);
        try {
            const data = showDeleted ? await getAllUsersIncludeDeleted() : await getUsers();
            setUsers(data as User[]);
        } catch (error) {
            console.error(error);
            toast({ title: "Lỗi", description: "Không thể lấy danh sách người dùng", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [showDeleted, toast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await updateUserRole(userId, newRole);
            toast({ title: "Thành công", description: `Đã cập nhật vai trò thành ${newRole}` });
            fetchUsers();
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể cập nhật vai trò", variant: "destructive" });
        }
    };

    const handleStatusChange = async (userId: string, newStatus: string) => {
        try {
            await updateUserStatus(userId, newStatus);
            toast({ title: "Thành công", description: `Đánh dấu người dùng là ${newStatus}` });
            fetchUsers();
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể cập nhật trạng thái", variant: "destructive" });
        }
    };

    const handleSoftDelete = async (userId: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn vô hiệu hóa người dùng này?")) return;
        try {
            await softDeleteUser(userId);
            toast({ title: "Thành công", description: "Đã vô hiệu hóa tài khoản" });
            fetchUsers();
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể thực hiện", variant: "destructive" });
        }
    };

    const handleRestore = async (userId: string) => {
        try {
            await restoreUser(userId);
            toast({ title: "Thành công", description: "Đã khôi phục tài khoản" });
            fetchUsers();
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể khôi phục", variant: "destructive" });
        }
    };

    const handleHardDelete = async (userId: string) => {
        if (!window.confirm("CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn dữ liệu profile. Bạn có chắc chắn?")) return;
        try {
            await hardDeleteUser(userId);
            toast({ title: "Thành công", description: "Đã xóa vĩnh viễn profile người dùng" });
            fetchUsers();
        } catch (error) {
            toast({ title: "Lỗi", description: "Không thể xóa vĩnh viễn", variant: "destructive" });
        }
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-mimi-purple/20 text-mimi-purple border-mimi-purple/30';
            case 'AUTHOR': return 'bg-mimi-cyan/20 text-mimi-cyan border-mimi-cyan/30';
            default: return 'bg-mimi-blue/20 text-mimi-blue border-mimi-blue/30';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'BANNED': return 'bg-red-500/20 text-red-500 border-red-500/30';
            case 'DELETED': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
            default: return 'bg-green-500/20 text-green-500 border-green-500/30';
        }
    };

    return (
        <div className="min-h-screen bg-mimi-dark text-white p-4 md:p-10 selection:bg-mimi-cyan/30 overflow-x-hidden relative">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
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
                            <span className="h-[2px] w-12 bg-gradient-to-r from-mimi-blue to-transparent rounded-full shadow-[0_0_10px_#3b82f6]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-mimi-blue/80 opacity-80">
                                User Identification Matrix
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-display font-black tracking-tighter uppercase italic leading-none bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent">
                            USER <span className="bg-gradient-to-r from-mimi-blue to-mimi-cyan bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">CONTROL</span>
                        </h1>
                        <p className="text-mimi-muted font-medium text-sm border-l-2 border-mimi-blue/30 pl-4 py-1 italic">
                            Quản lý định danh, phân quyền và trạng thái người dùng hệ thống.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mimi-muted group-focus-within:text-mimi-blue transition-colors" />
                            <Input
                                placeholder="Search by ID or Username..."
                                className="h-14 w-64 pl-12 bg-white/[0.03] border-white/5 rounded-2xl focus:border-mimi-blue/50 focus:ring-0 transition-all font-bold placeholder:text-mimi-muted/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleted(!showDeleted)}
                            className={`h-14 px-6 rounded-2xl border-white/5 transition-all gap-2 font-black uppercase text-[10px] tracking-widest ${showDeleted ? 'bg-mimi-blue text-white border-mimi-blue/50' : 'bg-white/[0.03] text-mimi-muted hover:bg-white/10'}`}
                        >
                            <Trash2 className="w-4 h-4" />
                            {showDeleted ? "Hide Deleted" : "Show Deleted"}
                        </Button>
                        <Button
                            onClick={fetchUsers}
                            className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 hover:bg-mimi-cyan hover:text-black transition-all p-0 flex items-center justify-center"
                        >
                            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                <Card className="bg-mimi-card/40 backdrop-blur-3xl border-white/[0.05] rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-white/[0.02]">
                                    <TableRow className="border-white/[0.05] hover:bg-transparent">
                                        <TableHead className="w-24 text-center font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em] py-8">Identity</TableHead>
                                        <TableHead className="font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em]">Profile Info</TableHead>
                                        <TableHead className="font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em] text-center">Authorization</TableHead>
                                        <TableHead className="font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em] text-center">Status Matrix</TableHead>
                                        <TableHead className="text-right font-black text-mimi-muted uppercase text-[9px] tracking-[0.2em] pr-12">Operations</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-[400px] text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="w-12 h-12 border-4 border-mimi-blue/20 border-t-mimi-blue rounded-full animate-spin" />
                                                        <span className="text-mimi-muted uppercase font-black tracking-[0.3em] text-[10px]">Accessing Identity Vault...</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-[400px] text-center">
                                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                                        <AlertCircle className="w-16 h-16 text-mimi-muted" />
                                                        <span className="text-mimi-muted uppercase font-black tracking-[0.3em] text-[10px]">No matches found in database</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <motion.tr
                                                    key={user.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="border-white/[0.03] hover:bg-white/[0.02] transition-all group"
                                                >
                                                    <TableCell className="text-center py-8">
                                                        <span className="font-mono text-[10px] text-mimi-muted group-hover:text-mimi-blue transition-colors font-black uppercase tracking-tighter block mb-1">
                                                            ID: {user.id.slice(0, 8)}...
                                                        </span>
                                                        <span className="text-[9px] text-mimi-muted/50 font-bold uppercase">
                                                            {format(new Date(user.created_at), 'MM/yyyy')}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/[0.05] group-hover:border-mimi-blue/50 transition-all">
                                                                <Image
                                                                    src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                                                                    alt="Avatar"
                                                                    fill
                                                                    className="object-cover"
                                                                    unoptimized
                                                                />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-lg text-white group-hover:text-mimi-blue transition-colors uppercase italic tracking-tighter">
                                                                    {user.username || "UNKNOWN_UNIT"}
                                                                </h4>
                                                                <p className="text-[10px] text-mimi-muted font-bold tracking-widest uppercase">
                                                                    Sync: Active
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline" className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg ${getRoleColor(user.role)}`}>
                                                            {user.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant="outline" className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg ${getStatusColor(user.status)}`}>
                                                            {user.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-12">
                                                        <div className="flex justify-end gap-2 transition-all duration-300">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/15 border border-white/10 hover:bg-mimi-blue hover:text-white transition-all shadow-lg">
                                                                        <Shield className="w-5 h-5 text-mimi-blue" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className="w-48 bg-mimi-glass/95 backdrop-blur-3xl border-mimi-border text-white rounded-2xl p-2 shadow-2xl">
                                                                    <DropdownMenuLabel className="p-3 text-[10px] font-black uppercase text-mimi-muted tracking-widest">Update Authorization</DropdownMenuLabel>
                                                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, "ADMIN")} className="focus:bg-mimi-purple/20 focus:text-mimi-purple rounded-xl cursor-pointer gap-2 p-3 font-black uppercase text-[10px]">
                                                                        <Shield className="w-4 h-4" /> Grant Admin
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, "AUTHOR")} className="focus:bg-mimi-cyan/20 focus:text-mimi-cyan rounded-xl cursor-pointer gap-2 p-3 font-black uppercase text-[10px]">
                                                                        <Shield className="w-4 h-4" /> Grant Author
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, "USER")} className="focus:bg-mimi-blue/20 focus:text-mimi-blue rounded-xl cursor-pointer gap-2 p-3 font-black uppercase text-[10px]">
                                                                        <Shield className="w-4 h-4" /> Demote to User
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>

                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/15 border border-white/10 hover:bg-orange-500 hover:text-white transition-all shadow-lg">
                                                                        <Ban className="w-5 h-5 text-orange-500" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent className="w-48 bg-mimi-glass/95 backdrop-blur-3xl border-mimi-border text-white rounded-2xl p-2 shadow-2xl">
                                                                    <DropdownMenuLabel className="p-3 text-[10px] font-black uppercase text-mimi-muted tracking-widest">Access Protocol</DropdownMenuLabel>
                                                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, "ACTIVE")} className="focus:bg-green-500/20 focus:text-green-500 rounded-xl cursor-pointer gap-2 p-3 font-black uppercase text-[10px]">
                                                                        <UserCheck className="w-4 h-4" /> Set Active
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, "BANNED")} className="focus:bg-red-500/20 focus:text-red-500 rounded-xl cursor-pointer gap-2 p-3 font-black uppercase text-[10px]">
                                                                        <Ban className="w-4 h-4" /> Ban Access
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="bg-white/5" />
                                                                    {user.deleted_at ? (
                                                                        <DropdownMenuItem onClick={() => handleRestore(user.id)} className="focus:bg-mimi-cyan/20 focus:text-mimi-cyan rounded-xl cursor-pointer gap-2 p-3 font-black uppercase text-[10px]">
                                                                            <RefreshCcw className="w-4 h-4" /> Restore Account
                                                                        </DropdownMenuItem>
                                                                    ) : (
                                                                        <DropdownMenuItem onClick={() => handleSoftDelete(user.id)} className="focus:bg-red-500/20 focus:text-red-500 rounded-xl cursor-pointer gap-2 p-3 font-black uppercase text-[10px]">
                                                                            <UserMinus className="w-4 h-4" /> Soft Delete
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>

                                                            <Button
                                                                onClick={() => handleHardDelete(user.id)}
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-10 h-10 rounded-xl bg-white/15 border border-white/10 hover:bg-rose-600 hover:text-white transition-all shadow-lg"
                                                            >
                                                                <Trash className="w-5 h-5 text-rose-600" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default UserManagementPage;
