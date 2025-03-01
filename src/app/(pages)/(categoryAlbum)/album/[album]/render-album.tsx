"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CiWifiOn, CiBoxList } from "react-icons/ci";
import { AiOutlineSync } from "react-icons/ai";
import { FaEye, FaBookmark } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import CommentComponents from "@/app/components/CommentComponents";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

import { time } from "@/lib/utils";
import Breadcrumb from "@/app/components/Breadcrumb";
import { apiProduct } from "@/app/apiRequest/apiProduct";
import { createSlug } from "@/lib/utils";
import { AlbumType } from "@/lib/type";


export default function AlbumRender({productId}:{productId:number}){
  const [product,setProduct]  = useState<AlbumType>();
  const router = useRouter();
  const { toast } = useToast()
  const handleChapter = (product_name: string, chapter_name: string, chapter_id: number) => {
        const url = createSlug(product_name) + "/" + createSlug(chapter_name) + "-" + chapter_id;
        router.push(`${url}`);
      }
  useEffect(()=>{
    const fetchProduct = async() =>{
      try{
         const response = await apiProduct.getProductById(productId);
         setProduct(response);
         console.log(response)
      }catch(error){
        console.error('Error:',error);
      }
    }
    fetchProduct();
  },[productId])
  return(
    <><div className="min-w-full   max-h-screen   relative">
    <div className="absolute  min-h-screen top-0 left-0 bottom-0  right-0 ">
      <h2 className="lg:w-[80%] w-[95%] py-3 lg:py-5 mx-auto flex items-center font-bold">
        {/* <Breadcrumb items={breadcrumbItems} /> */}
      </h2>
      <div className="z-50  lg:p-4 p-4  flex-col gap-y-5 flex min-h-screen text-white container rounded-sm mx-auto bg-gray-800 lg:w-[80%] w-[95%]">
        <div className="product__header gap-5 flex lg:flex-row flex-col">
          <div className="mx-auto lg:w-1/3 lg:mx-0">
            <Image
              src={product?.image_url ?? "https://cmangag.com/assets/tmp/album/81644.webp?v=1737041843"}
              alt={product?.title ?? "Truyen Trnah"}
              width={200}
              height={300}
              className="rounded-sm  w-full h-full"
              layout="responsive"
            />
          </div>
          <div className="lg:w-full w-full flex  flex-col  items-center">
            <h1 className="font-bold lg:text-left text-center w-full text-2xl">{product?.title}</h1>
            <div className="tag_list lg:h-1/2 lg:items-center w-full lg:justify-start justify-center gap-x-2 p-2 flex lg:gap-x-5">
              {product?.categories && product?.categories?.map((category) => (
                <Button className="bg-customBg2" key={category.id}>
                  {category.name}
                </Button>
              ))}
            </div>
            <div className="content_product mt-auto lg:h-full w-full lg:gap-y-5 flex gap-y-2 flex-col">
              <div className="content_product_flex  state flex">
                <div className="flex lg:w-1/6 w-1/2 text-left  items-center gap-2">
                  <CiWifiOn />
                  <span>Tình trạng</span>
                </div>
                {product?.is_active && <div className="w-1/2 text-left ">Đang tiến hành</div>}
              </div>
              <div className="content_product state flex">
                <div className="flex lg:w-1/6  w-1/2 text-left  items-center gap-2">
                  <AiOutlineSync />
                  <span>Cập nhật</span>
                </div>
                <div className="w-1/2 text-left ">{product?.created_at && (time(product?.created_at))}</div>
              </div>
              <div className="content_product state flex">
                <div className="flex lg:w-1/6 w-1/2 text-left  items-center gap-2">
                  <FaEye />
                  <span>Lượt xem</span>
                </div>
                <div className="w-1/2  text-left ">
                  {product?.chapters && product.chapters.length > 0 ? (
                    product.chapters.reduce(
                      (total, chapter) => total + (chapter.view ?? 0),
                      0
                    )
                  ) : (
                    0
                  )}
                </div>
              </div>
              <div className="content_product state flex">
                <div className="flex lg:w-1/6 w-1/2 text-left  items-center gap-2">
                  <FaBookmark />
                  <span>Theo dõi</span>
                </div>
                <div className="w-1/2 text-left">{product?.follow ?? 0}</div>
              </div>
            </div>
            <div className="list_button_action  lg:flex-nowrap justify-center flex-wrap w-full flex gap-2 lg:gap-2">
              <Button
                onClick={() => {
                  if (product?.chapters && product?.chapters?.length > 0) {
                    handleChapter(product.title, product.chapters[0].name, product.chapters[0].id);
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Không có chương nào để đọc",
                      description: "Vui lòng đợi cập nhật nhé",
                    });
                  }
                }}
                className="w-[48%] lg:w-1/4"
              >
                Đọc từ đầu
              </Button>
              <Button className="w-[48%] lg:w-1/4">Theo dõi</Button>
              <Button className="w-[48%] lg:w-1/4">Báo lỗi</Button>
              <Button className="w-[48%] lg:w-1/4">Share</Button>
            </div>

          </div>
        </div>
        <div className="product__content gap-5">
          <div>Giới thiệu</div>
          <span>Đang cập nhật</span>
          <p>{product?.content ?? "Không có mô tả"}</p>
        </div>
        <div className="product_list_chapter">
          <div className="product_header flex justify-between">
            <h2 className="flex items-center gap-x-2">
              <CiBoxList size={40} />
              <span className="font-bold text-sm lg:text-xl">Danh sách chương</span>
            </h2>
            <div className="flex">
              <Input type="text" placeholder="Nhập chapter" />
              <Button>Mở</Button>
            </div>
          </div>
          <div className="product_list_chapter_bottom container mt-5">
            <Table className="border-gray-700 border-2">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-xl">Chapter</TableHead>
                  <TableHead className="font-bold text-xl">Cập nhật</TableHead>
                  <TableHead className="font-bold text-xl">
                    <MdOutlineRemoveRedEye />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product?.chapters && product?.chapters?.length > 0 ? (
                  product.chapters.map((chapter, index) => (
                    <TableRow onClick={() => handleChapter(product.title, chapter.name, chapter.id)} key={index}>
                      <TableCell>{chapter.name}</TableCell>
                      <TableCell>{time(chapter.created_at)}</TableCell>
                      <TableCell>{chapter.view ?? 0}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center" colSpan={3}>Hiện tại chưa cập nhật chapter</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <CommentComponents />
        </div>
      </div>
    </div>
  </div>
  </>
    
  );
}