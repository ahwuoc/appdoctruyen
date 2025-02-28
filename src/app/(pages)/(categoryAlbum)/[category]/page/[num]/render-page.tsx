"use client";
import ListProductComponents from "@/app/components/ListProductComponents";
import ListCategories from "@/app/components/ListCategories";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CiBoxList } from "react-icons/ci";
import { useEffect } from "react";
import { apiProduct } from "@/app/apiRequest/apiProduct";
import { useDispatch } from "react-redux";
import { setProducts } from "@/app/redux/product.redux"; 
import { setTotalPages } from "@/app/redux/page.redux";
import { setCurrentPage } from "@/app/redux/page.redux";
export default function RenderPage({slug_category,slug_num}:{slug_category:string,slug_num:string}) {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            const response = await apiProduct.getProductOptions({
                slug_category: slug_category,
                page: Math.max(0, Number(slug_num)),
                limit: 20,
            });
            if (response?.data) {
                dispatch(setProducts(response.data));
                dispatch(setTotalPages(response.last_page));
                dispatch(setCurrentPage(response.current_page));
            }
        }
        fetchData();
    }, [slug_category, slug_num,dispatch])
    return (
        <div className="main_content min-w-full container bg-cusstomBg3">
            <div className="lg:gap-x-5 lg:flex text-color_white lg:w-[80%] w-[95%] mx-auto">
                <div className="lg:flex-[8] flex flex-col gap-y-5">
                    <Image src="https://cmangag.com/assets/img/pr/tuyennhomdich.jpg" width={500}
                        height={500}
                        alt="logo"
                        className="flex-1  w-full object-cover"
                    />
                    <div className="album_suggest flex gap-y-5 flex-col ">
                        <h1 className="flex gap-2 items-center p-2 lg:p-2 border-l-4  bg-bg_color " >
                            <svg className="w-5 svg-inline--fa fa-stars" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="stars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M325.8 152.3c1.3 4.6 5.5 7.7 10.2 7.7s8.9-3.1 10.2-7.7L360 104l48.3-13.8c4.6-1.3 7.7-5.5 7.7-10.2s-3.1-8.9-7.7-10.2L360 56 346.2 7.7C344.9 3.1 340.7 0 336 0s-8.9 3.1-10.2 7.7L312 56 263.7 69.8c-4.6 1.3-7.7 5.5-7.7 10.2s3.1 8.9 7.7 10.2L312 104l13.8 48.3zm-112.4 5.1c-8.8-17.9-34.3-17.9-43.1 0l-46.3 94L20.5 266.5C.9 269.3-7 293.5 7.2 307.4l74.9 73.2L64.5 483.9c-3.4 19.6 17.2 34.6 34.8 25.3l92.6-48.8 92.6 48.8c17.6 9.3 38.2-5.7 34.8-25.3L301.6 380.6l74.9-73.2c14.2-13.9 6.4-38.1-13.3-40.9L259.7 251.4l-46.3-94zm215.4 85.8l11 38.6c1 3.6 4.4 6.2 8.2 6.2s7.1-2.5 8.2-6.2l11-38.6 38.6-11c3.6-1 6.2-4.4 6.2-8.2s-2.5-7.1-6.2-8.2l-38.6-11-11-38.6c-1-3.6-4.4-6.2-8.2-6.2s-7.1 2.5-8.2 6.2l-11 38.6-38.6 11c-3.6 1-6.2 4.4-6.2 8.2s2.5 7.1 6.2 8.2l38.6 11z"></path></svg>
                            <span>   Gợi ý thông minh</span>
                        </h1>
                        <span className="lg:p-4 p-2 text-sm lg:text-xl bg-bg_color  text-bg_color rounded-xl break-words">
                            Hãy đăng nhập và đọc truyện. Hệ thống sẽ dựa trên sở thích để gợi ý các truyện phù hợp với bạn.
                        </span>
                    </div>
                    <div className="filter_album bg justify-start g items-center flex w-full">
                        <ListCategories />
                    </div>
            
                    <ListProductComponents />
                </div>
                <div className="md:block flex-[2] hidden">
                    Cot thứ 2
                </div>
            </div>
        </div>
    )
}
