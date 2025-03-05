import { AlbumType } from "@/lib/type";
import React, { useState, useEffect, useRef } from "react";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import Image from "next/image";
import { useAlbum } from '../provider/ProviderContext';
import { AlbumStats } from './DetailsAlbums';
import { HoverCard } from './StyleComponents';
export default function SlideCard({ albums }: { albums: AlbumType[]; })
{
  const handelick = useAlbum();
  const [currentPosition, setCurrentPosition] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const totalSlides = albums.length || 0;
  const slideWidth = 100 / itemsPerView;
  const maxPosition = Math.max(totalSlides - itemsPerView, 0);

  // Tính số item hiển thị dựa trên kích thước màn hình
  const getItemsPerView = () =>
  {
    if (typeof window === "undefined") return 2;
    const width = window.innerWidth;
    if (width >= 1280) return 6;
    if (width >= 1024) return 4;
    if (width >= 768) return 3;
    return 2;
  };

  // Khởi tạo và xử lý resize
  useEffect(() =>
  {
    const updateItemsPerView = () => setItemsPerView(getItemsPerView());
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // Xử lý kéo
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) =>
  {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) =>
  {
    if (!isDragging || !slideContainerRef.current) return;
    const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
    const distance = (clientX - startX) / slideContainerRef.current.offsetWidth * 100;
    setTranslateX(-currentPosition * slideWidth + distance);
  };

  const handleDragEnd = () =>
  {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = slideWidth / 3; // Ngưỡng để quyết định chuyển slide
    const newPosition = Math.round((-translateX) / slideWidth);
    setCurrentPosition(Math.max(0, Math.min(newPosition, maxPosition)));
    setTranslateX(0); // Reset sau khi thả
  };

  // Xử lý nút Next/Prev
  const goToNext = () => setCurrentPosition((prev) => Math.min(prev + 1, maxPosition));
  const goToPrev = () => setCurrentPosition((prev) => Math.max(prev - 1, 0));

  return (
    <div className="carousel-container relative mx-auto max-w-full overflow-hidden">
      {/* Nút Previous */}
      <button
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-gray-500 text-white p-2 z-10 rounded-full hover:bg-gray-700 disabled:opacity-50 transition-opacity"
        onClick={goToPrev}
        disabled={currentPosition === 0}
        aria-label="Previous slide"
      >
        <GrFormPreviousLink size={20} />
      </button>

      {/* Slide Container */}
      <div
        ref={slideContainerRef}
        className="slide-container flex will-change-transform transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${translateX || -currentPosition * slideWidth}%)`,
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {albums.length > 0 ? (
          albums.map((album, index) => (
            <div
              key={album.id || index} // Dùng id nếu có để tránh trùng key
              className={`slide ${HoverCard} flex flex-col justify-center cursor-pointer items-center flex-shrink-0 text-white select-none`}
              style={{ width: `${slideWidth}%` }}
            >
              <div className="card relative h-64 w-11/12 mx-auto overflow-hidden shadow-md rounded-lg">
                <Image
                  src={album.image_url || "/placeholder.jpg"}
                  width={256}
                  height={256}
                  alt={album.title || "Album"}
                  className="h-full w-full object-cover"
                  draggable={false}
                  onClick={() => handelick(album.title, album.id)}
                  priority={index < itemsPerView} // Tăng tốc tải cho các slide đầu
                />
                <div className="absolute bottom-0 w-full bg-bg_color bg-opacity-90  flex flex-col items-center">
                  <div className="flex items-center p-2 gap-2 text-sm">
                    <AlbumStats views={0} following={0} />
                  </div>
                  <p className="font-bold text-center truncate w-full">{album.title || "Untitled"}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-10 text-gray-500">Không có dữ liệu</div>
        )}
      </div>

      {/* Nút Next */}
      <button
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-500 text-white p-2 z-10 rounded-full hover:bg-gray-700 disabled:opacity-50 transition-opacity"
        onClick={goToNext}
        disabled={currentPosition >= maxPosition}
        aria-label="Next slide"
      >
        <GrFormNextLink size={20} />
      </button>
    </div>
  );
}