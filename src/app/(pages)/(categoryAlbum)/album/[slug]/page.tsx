"use client";
import { AlbumType } from "@/lib/type";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CiWifiOn, CiBoxList } from "react-icons/ci";
import { AiOutlineSync } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import CommentComponents from "@/app/components/CommentComponents";
import { useRouter } from "next/navigation";
import { timeAgo, createSlug } from "@/lib/utils";
import { apiProduct } from "@/app/apiRequest/apiProduct";

type PageProps = {
  params: Promise<{ slug: string; }>;
};

export default function Page({ params }: PageProps)
{
  const { slug } = React.use(params);
  const [albumData, setAlbumData] = useState<AlbumType | null>(null);
  const router = useRouter();

  useEffect(() =>
  {
    const fetchAlbums = async () =>
    {
      try {
        const response = await apiProduct.getAlbumId(1);
        setAlbumData(response.payload);
      } catch (error) {
        console.error("Lỗi khi lấy album:", error);
      }
    };
    fetchAlbums();
  }, []);

  const handleChapter = (product_name: string, chapter_name: string, chapter_id: number) =>
  {
    const url = `${createSlug(product_name)}/${createSlug(chapter_name)}-${chapter_id}`;
    router.push(`/album/${url}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col gap-6 p-4 md:p-6">
          {/* Image and Info */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-72 md:w-64 md:h-96">
                <Image
                  src={albumData?.image_url ?? "https://cmangag.com/assets/tmp/album/81644.webp?v=1737041843"}
                  alt={albumData?.title ?? "Truyện Tranh"}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-4">
              <h1 className="text-xl md:text-3xl font-bold text-white text-center md:text-left">
                {albumData?.title}
              </h1>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {albumData?.categories?.map((category) => (
                  <button
                    key={category.id}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm md:text-base"
                  >
                    {category.title}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 text-white text-sm md:text-base">
                <div className="flex items-center gap-2 md:gap-3">
                  <CiWifiOn className="text-lg md:text-xl" />
                  <span className="w-20 md:w-24">Tình trạng:</span>
                  <span>{albumData?.is_active ? "Đang tiến hành" : "Đã hoàn thành"}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <AiOutlineSync className="text-lg md:text-xl" />
                  <span className="w-20 md:w-24">Cập nhật:</span>
                  <span>{albumData?.created_at && timeAgo(albumData.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <FaEye className="text-lg md:text-xl" />
                  <span className="w-20 md:w-24">Lượt xem:</span>
                  <span>
                    {albumData?.chapters && albumData?.chapters?.length > 0
                      ? albumData.chapters.reduce((total, chapter) => total + (chapter.view ?? 0), 0)
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="p-4 md:p-6 border-t border-gray-700">
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center mb-4 md:mb-6">
            <h2 className="flex items-center gap-2 text-white text-lg md:text-xl font-bold">
              <CiBoxList size={10} className="md:size-5" />
              Danh sách chương
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Nhập chapter"
                className="w-full sm:w-40 bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm md:text-base">
                Mở
              </button>
            </div>
          </div>

          <div className="border border-gray-700 rounded-md overflow-hidden">
            <div className="bg-gray-900 grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 md:p-4 text-white font-bold text-xs sm:text-sm md:text-base">
              <div>Chapter</div>
              <div className="hidden sm:block">Tiêu đề</div>
              <div>Cập nhật</div>
              <div><MdOutlineRemoveRedEye className="inline" /></div>
            </div>
            <div>
              {albumData?.chapters && albumData?.chapters?.length > 0 ? (
                albumData.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    onClick={() => handleChapter(albumData.title, chapter.title, chapter.id)}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 md:p-4 text-white hover:bg-gray-700 cursor-pointer border-t border-gray-700 text-xs sm:text-sm md:text-base"
                  >
                    <div>Chapter {chapter.sort_order}</div>
                    <div className="hidden sm:block">{chapter.title}</div>
                    <div>{timeAgo(chapter.created_at ?? '')}</div>
                    <div>{chapter.view ?? 0}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-white py-4 col-span-2 sm:col-span-4 text-sm md:text-base">
                  Hiện tại chưa cập nhật chapter
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <CommentComponents />
          </div>
        </div>
      </div>
    </div>
  );
}