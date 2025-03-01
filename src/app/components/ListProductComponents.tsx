"use client";
import React from "react";
import Image from "next/image";

import { EyeOutlined , HeartFilled } from '@ant-design/icons';




import Pagination from "./Pagination";
import { time, createSlug } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from '@/lib/store';





const ListProductComponents = () => {
    const router = useRouter();
    const products = useSelector((state: RootState) => state.products.products)
    const totalPages = useSelector((state: RootState) => state.page.totalPages)
    const currentPage = useSelector((state: RootState) => state.page.currentPage)
    const slug_category = useSelector((state: RootState) => state.categories.slug_category);
    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
            router.push(`/${slug_category}/page/${pageNumber}`);
        }
    };
    const handlePageAlbumChange = (name: string, id: number) => {
        const url = createSlug(name) + "-" + id;
        router.push(`/album/${url}`);
    }
    return (
        <>
            <div className="lg:p-4 flex-col items-center flex lg:flex-row lg:items-stretch lg:flex-wrap">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="product-card flex w-full  lg:flex-col lg:w-1/4 lg:p-4 p-2">
                            <div className="image flex-[1] h-full  relative">
                                <Image
                                    src={product.image_url || "/placeholder-image.png"}
                                    width={150}
                                    height={200}
                                    onClick={() => handlePageAlbumChange(product.title, product.id)}
                                    alt="Product"
                                    className="object-cover w-full cursor-pointer h-full rounded-sm"
                                />
                                <div className="book_detail flex justify-evenly bottom-0 absolute w-full py-2 bg-gray-700 opacity-70">
                                    <span className="flex gap-2 items-center">
                                        <EyeOutlined />
                                        {product.chapters?.reduce(
                                            (total, chapter) => total + (chapter.view || 0),
                                            0
                                        ) || 0}
                                    </span>
                                    <span className="flex gap-2 items-center">
                                        <HeartFilled />
                                        {product.follow || 0}
                                    </span>
                                </div>
                                <div className=" book_tags flex text-sm absolute top-2 left-0 right-0">
                                    <div className="ml-auto mr-2 gap-2 flex">
                                        {product?.tags?.map((tag, index) => (
                                            <span
                                                key={index}
                                                className={`rounded-sm px-2 ${tag === "Hot" ? "bg-red-500" : "bg-blue-500"
                                                    }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:mt-auto flex-[2] lg:h-1/5 flex-col product__content flex items-center lg:flex-col">
                                <div className="mt-10 lg:mt-5 w-full text-center product__title">
                                    <h1 className="font-bold hover:text-customBg2 lg:text-sm text-xl">{product.title}</h1>
                                </div>
                                <div className="lg:mt-auto mt-auto product_last_chapter flex items-center justify-around">
                                    {product.chapters && product.chapters.length > 0 ? (
                                        product.chapters.map((item, index) => (
                                            <div key={index} className="flex lg:text-xs lg:mt-5 gap-2 items-center">
                                                <span>{item.name}</span> -{" "}
                                                <span>{time(item.created_at)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="lg:text-sm">Không có chương nào</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center py-4">Không có sản phẩm nào để hiển thị.</div>
                )}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pagelimit={4}
            />
        </>
    );
};
export default ListProductComponents;
