"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "@/lib/schema/schema-auth";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { loginUserAction } from "../../../(action)/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: LoginInput) => {
        try {
            const result = await loginUserAction(data);
            if (result.success) {
                toast({
                    title: "Đăng nhập thành công!",
                    description: "Chào mừng bạn đã quay trở lại hệ thống quản trị.",
                });

                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 1500);
            } else {
                toast({
                    title: "Lỗi đăng nhập",
                    description: result.error || "Email hoặc mật khẩu không chính xác.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Login fatal error:", error);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#060914] px-4 py-20">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-[450px]"
            >
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                    <div className="text-center mb-10">
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-black text-white mb-2 tracking-tight italic"
                        >
                            ĐĂNG <span className="text-blue-500">NHẬP</span>
                        </motion.h1>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Hệ thống quản trị Comic</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-gray-400 font-bold ml-1 uppercase text-[10px] tracking-widest">Email Address</FormLabel>
                                        <FormControl>
                                            <div className="group relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <Input
                                                    {...field}
                                                    placeholder="name@example.com"
                                                    className="h-14 pl-12 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-gray-600 font-medium"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs ml-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <div className="flex justify-between items-center ml-1">
                                            <FormLabel className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Password</FormLabel>
                                            <Link href="/forgot-password" className="text-[10px] text-blue-500 hover:text-blue-400 font-black uppercase tracking-wider">
                                                Quên mật khẩu?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="group relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    {...field}
                                                    placeholder="••••••••"
                                                    className="h-14 pl-12 pr-12 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-gray-600 font-medium"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs ml-1" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-lg font-black shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all group active:scale-95"
                            >
                                {form.formState.isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        ĐANG XÁC THỰC...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 tracking-widest uppercase">
                                        Đăng nhập hệ thống
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </Button>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/5" />
                                </div>
                                <div className="relative flex justify-center text-[10px] font-black uppercase">
                                    <span className="bg-[#0b101f] px-4 text-gray-500 tracking-widest">Hoặc đăng nhập bằng</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-14 bg-white/5 border-white/10 text-white rounded-2xl hover:bg-white/10 transition-colors gap-3 font-bold text-xs"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.35-1.01 2.49-2.15 3.24v2.69h3.47c2.03-1.87 3.2-4.63 3.2-7.89z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.47-2.69c-1.01.68-2.3 1.08-3.81 1.08-2.93 0-5.41-1.98-6.29-4.64H2.01v2.91C3.83 20.36 7.67 23 12 23z" fill="#34A853" />
                                        <path d="M5.71 13.36c-.23-.69-.36-1.43-.36-2.19s.13-1.5.36-2.19V6.07H2.01C1.36 7.49 1 9.19 1 11s.36 3.51 1.01 4.93l3.7-2.57z" fill="#FBBC05" />
                                        <path d="M12 4.96c1.61 0 3.05.55 4.18 1.62l3.13-3.13C17.46 1.64 14.97.5 12 .5 7.67.5 3.83 3.14 2.01 6.07l3.7 2.57C6.59 6.98 9.07 4.96 12 4.96z" fill="#EA4335" />
                                    </svg>
                                    GOOGLE
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-14 bg-white/5 border-white/10 text-white rounded-2xl hover:bg-white/10 transition-colors gap-3 font-bold text-xs"
                                >
                                    <Github className="w-5 h-5" />
                                    GITHUB
                                </Button>
                            </div>

                            <div className="text-center text-xs text-gray-500 mt-8 font-medium">
                                CHƯA CÓ TÀI KHOẢN?{" "}
                                <Link href="/register" className="text-blue-500 hover:text-blue-400 font-black hover:underline transition-colors uppercase ml-1">
                                    Đăng ký ngay
                                </Link>
                            </div>
                        </form>
                    </Form>
                </div>
            </motion.div>
        </div>
    );
}
