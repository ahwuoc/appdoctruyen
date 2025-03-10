"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterInput, registerSchema } from "../../../schema/schema-register";
import apiAuth from "@/app/apiRequest/apiAuth";
import Image from "next/image";
import { FaUser, FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import Link from 'next/link';
import { EyeOff, Eye } from 'lucide-react';

const RegisterComponents = () =>
{
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const [showPassword, setShowPassword] = React.useState(false);

    const onSubmit = async (data: RegisterInput) =>
    {
        try {
            const response = await apiAuth.register(data);
            console.log("Đăng ký thành công:", response.payload);
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
        }
    };

    const handleGoogleRegister = () =>
    {
        console.log("Đăng ký bằng Gmail");
    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="flex bg-customBg2 max-w-4xl w-full m-4 rounded-xl shadow-lg overflow-hidden">
                <div className="flex-1 p-8">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Đăng ký</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="gap-4 flex flex-col">
                        <div>
                            <label className="block text-gray-700">Tên</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Tên"
                                        />
                                    )}
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700">Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Email"
                                        />
                                    )}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700">Mật khẩu</label>
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
                                        />
                                    )}
                                />
                                <Eye
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                            </div>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            {...field}
                                            className="w-full px-10 p-3  border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Xác nhận mật khẩu"
                                        />
                                    )}
                                />
                                <Eye
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </div>
                        <div className="flex justify-between items-center space-x-2">
                            <Link href={'/register'} className=" text-color_white  hover:underline">
                                Quên mật khẩu?</Link>
                            <Link href={'/login'} className=" text-color_white font-semibold hover:underline">
                                Đăng nhập</Link>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 text-lg font-semibold"
                            >
                                {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                            </button>

                            <button
                                type="button"
                                onClick={handleGoogleRegister}
                                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg h-12 text-lg font-semibold flex items-center justify-center gap-2"
                            >
                                <FaGoogle className="text-xl" />
                                Đăng ký bằng Gmail
                            </button>
                        </div>


                    </form>
                </div>
                <div className="hidden w-1/2 p-2 md:flex">
                    <Image
                        width={200}
                        height={200}
                        draggable={false}
                        src="https://cmangav.com/assets/tmp/album/54333.png?v=1720016643"
                        alt="Register illustration"
                        className="object-cover w-full rounded-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterComponents;