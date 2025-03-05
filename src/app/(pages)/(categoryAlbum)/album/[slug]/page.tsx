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
    router.push(`/${url}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-6 p-6">
          <div className="lg:w-1/3 flex justify-center">
            <div className="relative w-64 h-96">
              <Image
                src={albumData?.image_url ?? "https://cmangag.com/assets/tmp/album/81644.webp?v=1737041843"}
                alt={albumData?.title ?? "Truyện Tranh"}
                fill
                className="rounded-md object-cover"
              />
            </div>
          </div>

          <div className="lg:w-2/3 flex flex-col gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-white text-center lg:text-left">
              {albumData?.title}
            </h1>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {albumData?.categories?.map((category) => (
                <button
                  key={category.id}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md"
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 text-white">
              <div className="flex items-center gap-3">
                <CiWifiOn className="text-xl" />
                <span className="w-24">Tình trạng:</span>
                <span>{albumData?.is_active ? "Đang tiến hành" : "Đã hoàn thành"}</span>
              </div>
              <div className="flex items-center gap-3">
                <AiOutlineSync className="text-xl" />
                <span className="w-24">Cập nhật:</span>
                <span>{albumData?.created_at && timeAgo(albumData.created_at)}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEye className="text-xl" />
                <span className="w-24">Lượt xem:</span>
                <span>
                  {albumData?.chapters && albumData?.chapters?.length > 0
                    ? albumData.chapters.reduce((total, chapter) => total + (chapter.view ?? 0), 0)
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="flex items-center gap-2 text-white text-xl font-bold">
              <CiBoxList size={28} />
              Danh sách chương
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập chapter"
                className="w-40 bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">
                Mở
              </button>
            </div>
          </div>

          <div className="border border-gray-700 rounded-md overflow-hidden">
            <div className="bg-gray-900 grid grid-cols-3 gap-4 p-4 text-white font-bold">
              <div>Chapter</div>
              <div>Cập nhật</div>
              <div><MdOutlineRemoveRedEye className="inline" /></div>
            </div>
            <div>
              {albumData?.chapters && albumData?.chapters?.length > 0 ? (
                albumData.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    onClick={() => handleChapter(albumData.title, chapter.name, chapter.id)}
                    className="grid grid-cols-3 gap-4 p-4 text-white hover:bg-gray-700 cursor-pointer border-t border-gray-700"
                  >
                    <div>{chapter.name}</div>
                    <div>{timeAgo(chapter.created_at ?? '')}</div>
                    <div>{chapter.view ?? 0}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-white py-4 col-span-3">
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