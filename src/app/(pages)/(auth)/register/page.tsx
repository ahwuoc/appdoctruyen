"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInput, registerSchema } from "../../../../lib/schema/schema-register";
import apiAuth from "../../../api/apiRequest/apiAuth";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"; // ✅ Dùng Lucide thay Fa icons
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Shadcn/UI Button
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Shadcn/UI Form
import { Input } from "@/components/ui/input"; // Shadcn/UI Input

const RegisterComponents = () => {
    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const [showPassword, setShowPassword] = React.useState(false);

    const onSubmit = async (data: RegisterInput) => {
        try {
            const response = await apiAuth.register(data);
            console.log("Đăng ký thành công:", response.payload);
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
        }
    };

    const handleGoogleRegister = () => {
        console.log("Đăng ký bằng Gmail");
    };

    return (
        <div className="container h-full flex text-white justify-center items-center mx-auto p-6">
            <div className="max-w-md w-1/2 bg-color_puppy p-4 border rounded-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3"> {/* ✅ Giảm gap từ 4 xuống 3 */}
                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng ký</h2> {/* ✅ Giảm font và margin */}

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4.ConcurrentModificationException w-4 text-gray-500" />
                                            <Input {...field} className="pl-10" placeholder="Tên" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <Input {...field} className="pl-10" placeholder="Email" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                {...field}
                                                className="pl-10 pr-10"
                                                placeholder="Mật khẩu"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                {...field}
                                                className="pl-10 pr-10"
                                                placeholder="Xác nhận mật khẩu"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Links */}
                        <div className="flex justify-between text-sm text-blue-500 mt-2"> {/* ✅ Thêm mt-2 cho gọn */}
                            <Link href="/forgot-password" className="hover:underline">
                                Quên mật khẩu?
                            </Link>
                            <Link href="/login" className="hover:underline">
                                Đăng nhập
                            </Link>
                        </div>

                        {/* Buttons */}
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 mt-3" // ✅ Thêm mt-3
                        >
                            {form.formState.isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleRegister}
                            className="flex text-black gap-2"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.35-1.01 2.49-2.15 3.24v2.69h3.47c2.03-1.87 3.2-4.63 3.2-7.89z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.47-2.69c-1.01.68-2.3 1.08-3.81 1.08-2.93 0-5.41-1.98-6.29-4.64H2.01v2.91C3.83 20.36 7.67 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.71 13.36c-.23-.69-.36-1.43-.36-2.19s.13-1.5.36-2.19V6.07H2.01C1.36 7.49 1 9.19 1 11s.36 3.51 1.01 4.93l3.7-2.57z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 4.96c1.61 0 3.05.55 4.18 1.62l3.13-3.13C17.46 1.64 14.97.5 12 .5 7.67.5 3.83 3.14 2.01 6.07l3.7 2.57C6.59 6.98 9.07 4.96 12 4.96z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Đăng ký bằng Gmail
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default RegisterComponents;