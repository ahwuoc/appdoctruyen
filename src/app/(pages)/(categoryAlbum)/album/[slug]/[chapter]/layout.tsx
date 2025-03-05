"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaHome } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { FaBookmark } from "react-icons/fa";
import { BiArrowToTop } from "react-icons/bi";

export default function LayoutChapter({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [showScrollButton, setShowScrollButton] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setShowScrollButton(false);
            } else {
                setShowScrollButton(true);
            }
            setLastScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);
    return (
        <>
            <main>{children}</main>
            {showScrollButton && (
                <div className="w-full  bg-customBg bg-opacity-80 text-color_white fixed bottom-0 left-0 p-5">
                    <div className="container flex items-center justify-between mx-auto lg:w-[80%]">
                        <div className="navigation-left gap-x-5 flex">
                            <div className="flex gap-x-2 items-center">
                                <FaHome /> Trang chủ
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <MdErrorOutline />Báo lỗi
                            </div>
                        </div>
                        <div className="navigation-center items-center gap-x-1 flex">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="bg-gray-400 bg-opacity-25 border-white p-2 rounded-3xl">
                                    Chapter 1
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Chapter 1</DropdownMenuItem>
                                    <DropdownMenuItem>Chapter 2</DropdownMenuItem>
                                    <DropdownMenuItem>Chapter 3</DropdownMenuItem>
                                    <DropdownMenuItem>Chapter 4</DropdownMenuItem>
                                    <DropdownMenuItem>Chapter 5</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Chapter 1</DropdownMenuLabel>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button className="rounded-full">&gt;</Button>
                        </div>
                        <div className="navigation-right gap-x-5 flex">
                            <div className="flex gap-x-2 items-center">
                                <FaBookmark />Theo dõi
                            </div>
                          
                                <div className="flex gap-x-2 items-center">
                                    <BiArrowToTop />Cuộn lên
                                </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
