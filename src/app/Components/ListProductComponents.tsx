"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { useProducts } from '../Provider/ProductContext';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CiBookmark } from "react-icons/ci";
import { Button } from '@/components/ui/button';
const ListProductComponents = () => {
    const { products } = useProducts();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginatedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 250);
        }
    };

    return (
        <>
            <div className="container  w-full flex flex-wrap">
                {paginatedProducts.map((product) => (
                    <div key={product.id} className="card flex flex-col w-1/4 p-4">
                        <div className="image h-4/5 relative">
                            <Image
                                src={product.image}
                                width={150}
                                height={200}
                                alt="Product"
                                className="object-cover cursor-pointer h-full w-full rounded-sm"
                            />
                            <div className="book_detail flex justify-evenly bottom-0 absolute w-full py-2 bg-gray-700 opacity-70">
                                <span className='flex gap-2 items-center'>
                                    <MdOutlineRemoveRedEye />
                                    {product.view}
                                </span>
                                <span className='flex gap-2 items-center'>
                                    <CiBookmark />
                                    {product.follow}
                                </span>
                            </div>
                            <div className="book_tags flex text-sm absolute top-2 left-0 right-0">
                                <div className="ml-auto mr-2 gap-2 flex">
                                    <span className='rounded-sm bg-red-500 w-[100%] px-2'>Hot</span>
                                    <span className='rounded-sm bg-blue-500 w-[100%] px-2'>Vip</span>
                                </div>
                            </div>
                        </div>
                        <div className='mt-auto h-1/5 product__content flex flex-col'>
                            <div className="mt-1 product__title">
                                <h1 className='font-bold hover:text-customBg2'>{product.name}</h1>
                            </div>
                            <div className="mt-auto product_last_chapter flex items-center justify-around">
                                {product.chapter && product.chapter.length > 0 ? (
                                    product.chapter.map((item, index) => {
                                        return (
                                            <div key={index} className="flex gap-2 items-center">
                                                <span>{item.chapterNew}</span> -
                                                <span>{item.chapterCreate}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <span>Không có chương nào</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Phân trang */}
            <div className="pagination py-4 container gap-2 flex justify-center mt-4">
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                >Prev
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                    <Button className={`hover:bg-customBg2 ${currentPage == index + 1 ? "bg-customBg2" : null}`} onClick={() => handlePageChange(index + 1)} key={index}>
                        {index + 1}
                    </Button>
                ))}
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                >Next
                </Button>
            </div>
        </>
    );
};

export default ListProductComponents;
