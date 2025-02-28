"use client";
import apiChapters from "@/app/apiRequest/apiChapters";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { ImageType } from "@/lib/type";
import { createSlug } from "@/lib/utils";
import Breadcrumb from "@/app/components/Breadcrumb";
import CommentComponents from "@/app/components/CommentComponents";
interface DataResponse{
    album_id:string,
    album_name:string,
    chapter_id:string,
    chapter_images:ImageType[],
}
export default  function RenderChapter({chapterId}:{chapterId:number}) {
     const [data,setData] = useState<DataResponse>();
     useEffect(()=>{
        const fetchChapters = async()=>{
            try {
                const response = await apiChapters.getChapterList(chapterId);
                setData(response as DataResponse);
                console.log(response);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        fetchChapters();
     },[chapterId])  
    const url = `${createSlug(data?.album_name??"")}-${data?.album_id}`
    const breadcrumbItems = [
      { label: 'Trang chủ', href: '/' },
      { label: data?.album_name ?? "Lỗi", href: `/album/${url}` },
      { label: `Chapter ${data?.chapter_id}`, href: '#' },
    ];
    return (
      <>
        <div className="container bg-customBg min-h-screen relative min-w-full ">
          <div className="mx-auto lg:w-[80%]">
              <Breadcrumb items={breadcrumbItems} />
            <div className="container-image-list">
              <h2 className='text-color_white w-full text-center p-4 font-bold text-2xl'>{data?.album_name} - Chapter {chapterId}</h2>
              <div className="image-list flex-col lg:w-3/5 mx-auto flex ">
                {data?.chapter_images && data.chapter_images.length > 0 ? (
                  data.chapter_images.map((image, index) => (
                    <div className="w-full relative" key={index}>
                      <Image
                        src={image.image_path}
                        alt={`Image ${index + 1}`}
                        layout="responsive"
                        width={2000}
                        height={3000}
                        className="rounded-sm shadow-lg object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-white text-center">Chapter hiện tại chưa cập nhật</p>
                )}
              </div>
            </div>
            <CommentComponents />
          </div>
        </div>
      </>
    );
  }
  