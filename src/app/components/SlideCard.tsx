import { AlbumType } from "@/lib/type";
import React, { useState, useEffect, useRef } from "react";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { FaEye } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";

export default function SlideCard({ albums }: { albums: AlbumType[] }) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const totalSlides = albums.length;

  const getItemsPerView = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1280) return 6;
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    if (window.innerWidth >= 640) return 2;
    return 2;
  };

  useEffect(() => {
    setItemsPerView(getItemsPerView());
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slideWidth = 100 / itemsPerView;

  // Bắt đầu kéo
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn hành vi mặc định của chuột
    console.log("Mouse down - Start dragging");
    setIsDragging(true);
    setStartX(e.pageX);
    setDragDistance(0);
    if (slideContainerRef.current) {
      slideContainerRef.current.style.transition = "none";
    }
  };

  // Kéo chuột
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.pageX;
    const diff = currentX - startX;
    setDragDistance(diff);
    console.log("Dragging - Distance:", diff);
  };

  // Kết thúc kéo
  const handleMouseUp = () => {
    if (!isDragging) return;
    console.log("Mouse up - End dragging");
    setIsDragging(false);

    if (slideContainerRef.current) {
      slideContainerRef.current.style.transition = "transform 0.5s ease-in-out";
    }

    const threshold = window.innerWidth / itemsPerView / 3;
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0 && currentPosition > 0) {
        setCurrentPosition(Math.max(0, currentPosition - itemsPerView));
      } else if (dragDistance < 0 && currentPosition < totalSlides - itemsPerView) {
        setCurrentPosition(Math.min(
          Math.floor((totalSlides - 1) / itemsPerView) * itemsPerView,
          currentPosition + itemsPerView
        ));
      }
    }
    setDragDistance(0);
  };

  // Xử lý khi chuột rời khỏi container
  const handleMouseLeave = () => {
    if (isDragging) {
      console.log("Mouse leave - Force end dragging");
      handleMouseUp();
    }
  };

  const handleNext = () => {
    if (currentPosition < totalSlides - itemsPerView) {
      setCurrentPosition(currentPosition + itemsPerView);
    } else if (totalSlides > itemsPerView) {
      setCurrentPosition(0);
    }
  };

  const handlePrev = () => {
    if (currentPosition > 0) {
      setCurrentPosition(currentPosition - itemsPerView);
    } else if (totalSlides > itemsPerView) {
      setCurrentPosition(Math.floor((totalSlides - 1) / itemsPerView) * itemsPerView);
    }
  };

  const getTransformValue = () => {
    const baseTranslate = currentPosition * slideWidth;
    if (isDragging && slideContainerRef.current) {
      const containerWidth = slideContainerRef.current.offsetWidth;
      const dragPercentage = (dragDistance / containerWidth) * 100;
      const maxTranslate = (totalSlides - itemsPerView) * slideWidth;
      let newTranslate = baseTranslate - dragPercentage;
      newTranslate = Math.max(0, Math.min(newTranslate, maxTranslate));
      return `translateX(-${newTranslate}%)`;
    }
    return `translateX(-${baseTranslate}%)`;
  };

  return (
    <div className="carousel-container relative mx-auto max-w-full overflow-x-hidden">
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-500 text-white px-2 py-1 z-10 rounded-full hover:bg-gray-700 disabled:opacity-50"
        onClick={handlePrev}
        disabled={totalSlides <= itemsPerView}
      >
        <GrFormPreviousLink />
      </button>
      <div
        ref={slideContainerRef}
        className="slide-container flex transition-transform duration-500 ease-in-out"
        style={{ transform: getTransformValue(), userSelect: "none" }} // Ngăn chọn text khi kéo
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {albums.map((album, index) => (
          <div
            key={index}
            className="slide flex flex-col justify-center items-center flex-shrink-0 text-white"
            style={{ width: `${slideWidth}%` }}
          >
            <div className="card relative h-64 w-11/12 mx-auto overflow-hidden shadow-md rounded-lg">
              <img
                src={album.image_url}
                alt={album.title || ""}
                className="h-full w-full relative object-cover pointer-events-none" // Chặn sự kiện chuột trên ảnh
                draggable={false} // Ngăn kéo ảnh
              />
              <div className="absolute flex flex-col p-2 items-center justify-center bottom-0 w-full bg-bg_color bg-opacity-90 pointer-events-none">
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    <FaEye className="text-color_puppy font-bold" />
                    {album.chapters?.at(0)?.view ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <CiBookmark className="text-color_puppy font-bold" />
                    0
                  </span>
                </div>
                <p className="font-bold">{album.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-500 text-white px-2 py-1 z-10 rounded-full hover:bg-gray-700 disabled:opacity-50"
        onClick={handleNext}
        disabled={totalSlides <= itemsPerView}
      >
        <GrFormNextLink />
      </button>
    </div>
  );
}