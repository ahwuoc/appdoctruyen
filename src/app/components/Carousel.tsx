
import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { AlbumType } from "@/lib/type";
import { GrFormPreviousLink, GrFormNextLink } from 'react-icons/gr';
import ImageComponents from './ImageComponents'; import { url } from 'inspector';
;

export default function CarouselComponents({ albums }: { albums: AlbumType[]; })
{
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalSlides = albums.length;

  const nextSlide = () =>
  {
    setCurrent((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () =>
  {
    setCurrent((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleMouseDown = (e: React.MouseEvent) =>
  {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.pageX);
    setDragDistance(0);
    if (carouselRef.current) {
      carouselRef.current.style.transition = "none";
    }
  };

  // Kéo chuột
  const handleMouseMove = (e: React.MouseEvent) =>
  {
    if (!isDragging) return;
    const currentX = e.pageX;
    const diff = currentX - startX;
    setDragDistance(diff);
  };

  // Kết thúc kéo
  const handleMouseUp = () =>
  {
    if (!isDragging) return;
    setIsDragging(false);

    if (carouselRef.current) {
      carouselRef.current.style.transition = "transform 0.5s ease-in-out";
    }

    const threshold = window.innerWidth / 4; // Ngưỡng để chuyển slide (1/4 chiều rộng màn hình)
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0 && current > 0) {
        setCurrent(current - 1); // Kéo sang phải -> slide trước
      } else if (dragDistance < 0 && current < totalSlides - 1) {
        setCurrent(current + 1); // Kéo sang trái -> slide sau
      }
    }
    setDragDistance(0);
  };

  // Chuột rời khỏi container
  const handleMouseLeave = () =>
  {
    if (isDragging) {
      handleMouseUp();
    }
  };


  useEffect(() =>
  {
    return () =>
    {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () =>
  {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  // Tính toán transform dựa trên vị trí hiện tại và khoảng cách kéo
  const getTransformValue = () =>
  {
    const baseTranslate = current * 100;
    if (isDragging && carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth;
      const dragPercentage = (dragDistance / containerWidth) * 100;
      return `translateX(${-(baseTranslate - dragPercentage)}%)`;
    }
    return `translateX(-${baseTranslate}%)`;
  };

  return (
    <div
      className="w-full max-h-96 relative overflow-x-hidden"
      onMouseEnter={handleMouseEnter}
    >
      <div
        ref={carouselRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: getTransformValue(), userSelect: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {albums.map((album, index) => (
          <div key={index} className="min-w-full h-96 relative">
            <ImageComponents
              image={{
                src: album.image_url,
                name: album.title
              }}
            />
            <CardContent className="absolute bottom-20 md:bottom-0 w-full z-10 flex items-center p-4 md:p-6 pointer-events-none">
              <div className="container mx-auto flex md:flex-row gap-4 w-full">
                <div className="w-48 h-40 md:w-48 md:h-64">
                  <ImageComponents
                    image={{
                      src: album.image_url,
                      name: album.title
                    }}
                  />
                </div>
                <div className="flex flex-col text-color_white w-full max-h-64 overflow-hidden">
                  <span className="text-lg md:text-3xl font-bold">{album.title}</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex gap-2 items-center">
                      {Array.isArray(album.categories) && album.categories.length > 0 ? (
                        <>
                          {album.categories.slice(0, 3).map((category, index) => (
                            <span key={index} className="text-sm px-2 bg-color_puppy">
                              {category.title}
                            </span>
                          ))}
                          {album.categories.length > 3 && (
                            <span className="text-sm px-2 bg-color_puppy">...</span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Không có danh mục</span>
                      )}
                    </div>
                  </div>
                  <span className="hidden md:block mt-2 text-sm line-clamp-3">
                    {album.content}
                  </span>
                </div>
              </div>
            </CardContent>
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 w-40 p-4 left-1/2 transform -translate-x-1/2 md:left-[90%] md:translate-x-0 flex items-center justify-between z-10">
        <button
          onClick={prevSlide}
          className="h-8 w-8 bg-gray-800 text-white rounded-full flex items-center justify-center"
        >
          <GrFormPreviousLink size={20} />
        </button>

        <span className="text-white text-sm flex-grow text-center">
          No.{current + 1}
        </span>

        <button
          onClick={nextSlide}
          className="h-8 w-8 bg-gray-800 text-white rounded-full flex items-center justify-center"
        >
          <GrFormNextLink size={20} />
        </button>
      </div>
    </div>
  );
}