import { AlbumType } from "@/lib/type";
import React, { useState, useEffect } from "react";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { FaEye } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";

export default function SlideCard({ albums }: { albums: AlbumType[] }) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  const totalSlides = albums.length;

  const getItemsPerView = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1280) return 6;
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  useEffect(() => {
    setItemsPerView(getItemsPerView());
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slideWidth = 100 / itemsPerView;

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
        className="slide-container flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentPosition * slideWidth}%)` }}
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
                className="h-full w-full relative object-cover"
                
              />
              <div className="absolute flex flex-col p-2 items-center  justify-center bottom-0 w-full  bg-bg_color bg-opacity-90">
              <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center  gap-1">
                    <FaEye className="text-color_puppy font-bold" />
                    {album.chapters?.at(0)?.view ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <CiBookmark className="text-color_puppy font-bold" />
                    {album.follow ?? 0}
                  </span>
                </div>
                 <p className='font-bold'>{album.title}</p>
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