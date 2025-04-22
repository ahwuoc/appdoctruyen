"use client";
import { AlbumType } from "@/app/utils/types/type";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CiWifiOn, CiBoxList } from "react-icons/ci";
import { AiOutlineSync } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useRouter } from "next/navigation";
import { timeAgo, createSlug } from "@/app/utils/common/utils";
import { apiProduct } from "@/app/apiRequest/apiProduct";
import { Button } from '../../../../../components/ui/button';

type PageProps = {
  params: Promise<{ slug: string; }>;
};

export default function Page({ params }: PageProps) {
  const { slug } = React.use(params);
  const [albumData, setAlbumData] = useState<AlbumType | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await apiProduct.getAlbumId(1);
        setAlbumData(response.payload);
      } catch (error) {
        console.error("Lỗi khi lấy album:", error);
      }
    };
    fetchAlbums();
  }, []);



  const handleChapter = (product_name: string, chapter_name: string, chapter_id: number) => {
    const url = `${slug}/${createSlug(chapter_name)}-${chapter_id}`;
    router.push(`/album/${url}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col gap-6 p-4 md:p-6">
          {/* Image and Info */}
          <div className="flex flex-col md:flex-row ">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-72 md:w-64 md:h-96">
                <Image
                  src={albumData?.image_url ?? "https://cmangag.com/assets/tmp/album/81644.webp?v=1737041843"}
                  alt={albumData?.title ?? "Truyện Tranh"}
                  fill
                  className="rounded-md w-full h-full  object-cover"
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

              <div className="flex flex-col gap-3 md:items-start items-center text-white text-sm md:text-base">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className='flex items-center gap-2'>
                    <CiWifiOn className="text-lg md:text-xl" />
                    <span className="w-20 md:w-24">Tình trạng:</span>
                  </div>
                  <span>{albumData?.is_active ? "Đang tiến hành" : "Đã hoàn thành"}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className='flex items-center gap-2'>
                    <AiOutlineSync className="text-lg md:text-xl" />
                    <span className="w-20 md:w-24">Cập nhật:</span>
                  </div>
                  <span>{albumData?.created_at && timeAgo(albumData.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className='flex items-center gap-2'>
                    <FaEye className="text-lg md:text-xl" />
                    <span className="w-20 md:w-24">Lượt xem:</span>
                  </div>
                  <span>
                    {albumData?.chapters && albumData?.chapters?.length > 0
                      ? albumData.chapters.reduce((total, chapter) => total + (chapter.view ?? 0), 0)
                      : 0}
                  </span>
                </div>

              </div>
              <div className="flex justify-center md:justify-start gap-2">
                <Button
                  onClick={async () => {
                    if (!albumData) return;
                    try {
                      // Giả sử API toggleFollow có sẵn
                      alert("Bạn đã theo dõi truyện này!");
                    } catch (error) {
                      console.error("Lỗi khi theo dõi:", error);
                    }
                  }}
                >
                  Theo dõi
                </Button>

                <Button
                  onClick={() => {
                    if (!albumData?.chapters?.length) return;
                    const firstChapter = albumData.chapters[0];
                    handleChapter(albumData.title, firstChapter.title, firstChapter.id);
                  }}
                >
                  Đọc từ đầu
                </Button>

                <Button
                  onClick={() => {
                    if (!albumData?.chapters?.length) return;
                    const latestChapter = albumData.chapters[albumData.chapters.length - 1];
                    handleChapter(albumData.title, latestChapter.title, latestChapter.id);
                  }}
                >
                  Đọc mới nhất
                </Button>
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


        </div>
      </div>
    </div>
  );
}