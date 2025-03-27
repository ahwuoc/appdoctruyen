"use client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, LoginSchema } from "../../../schema/schema-login";
import apiAuth from "../../../apiRequest/apiAuth";
import { FaEnvelope, FaGoogle, FaLock } from "react-icons/fa";
import Image from "next/image";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const LoginComponents = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema)
    });
    const router = useRouter();
    const onSubmit = async (data: LoginInput) => {
        try {
            const { email, password } = data;
            const handleLogin = apiAuth.login(data);
            router.refresh();
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
        }
    };

    const [showPassword, setShowPassword] = React.useState(false);

    const handleGoogleLogin = () => {
        console.log("Đăng nhập bằng Gmail chua duoc support");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col md:flex-row max-w-4xl w-full bg-customBg2 rounded-xl shadow-lg overflow-hidden">
                {/* Hình ảnh minh họa */}
                <div className="hidden md:flex w-1/2 p-4 items-center justify-center ">
                    <Image
                        width={300}
                        height={300}
                        draggable={false}
                        src="https://cmangav.com/assets/tmp/album/54333.png?v=1720016643"
                        alt="Login illustration"
                        className="object-cover w-full rounded-lg"
                    />
                </div>
                {/* Form đăng nhập */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Đăng nhập</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => {
                                        return (< input
                                            {...field}
                                            className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Email"

                                        />)
                                    }}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>
                        {/* Mật khẩu */}
                        <div>
                            <label className="block text-gray-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            {...field}
                                            className="w-full px-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Mật khẩu"
                                            defaultValue={""}
                                        />
                                    )}
                                />
                                <Eye
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>
                        {/* Liên kết quên mật khẩu và đăng ký */}
                        <div className="flex justify-between items-center text-sm text-blue-500">
                            <Link href="/forgot-password" className="hover:underline text-color_white">
                                Quên mật khẩu?
                            </Link>
                            <Link href="/register" className="font-semibold hover:underline text-color_white">
                                Đăng ký
                            </Link>
                        </div>
                        {/* Nút đăng nhập */}
                        <div className="flex flex-col gap-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 text-lg font-semibold transition"
                            >
                                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>
                            {/* Đăng nhập bằng Gmail */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg h-12 text-lg font-semibold flex items-center justify-center gap-2 transition"
                            >
                                <FaGoogle className="text-xl" />
                                Đăng nhập bằng Gmail
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginComponents;
