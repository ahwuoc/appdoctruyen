import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { AlbumType } from "@/lib/type";

export default function CarouselComponents({ albums }: { albums: AlbumType[] }) {
  const [current, setCurrent] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null); 

  const totalSlides = albums.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  useEffect(() => {

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current); 
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };
 
  return (
    <div
      className="w-full max-h-96 relative overflow-x-hidden"
      onMouseEnter={handleMouseEnter}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {albums.map((album, index) => (
          <div key={index} className="min-w-full h-96 relative">
            <Image
              src={
                album.image_url ??
                "https://imgs.search.brave.com/8bHoBZczToeB5Rr3Wsk10sSIFEhjdr3z1fRreaUPvZk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzExLzk3LzY0LzQ3/LzM2MF9GXzExOTc2/NDQ3MjhfRm1yTTVQ/VzhYd09rdjZXWVpN/SWhtQXJOdW5yU285/MEEuanBn"
              }
              alt={album.title}
              width={100}
                    height={100}
              className="object-cover blur-lg w-full h-full brightness-50"
              priority={index === 0}/>
            <CardContent className="absolute bottom-20 md:bottom-0 w-full z-10 flex items-center p-4 md:p-6">
              <div className="container  mx-auto flex md:flex-row  gap-4 w-full">
                <div className="w-48 h-40 md:w-48 md:h-64">
                  <Image
                    src={
                      album.image_url ??
                      "https://imgs.search.brave.com/8bHoBZczToeB5Rr3Wsk10sSIFEhjdr3z1fRreaUPvZk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzExLzk3LzY0LzQ3/LzM2MF9GXzExOTc2/NDQ3MjhfRm1yTTVQ/VzhYd09rdjZXWVpN/SWhtQXJOdW5yU285/MEEuanBn"
                    }
                    alt={album.title}
                    width={100}
                    height={100}
                    className="w-full h-full"/>
                </div>
                <div className="flex flex-col text-color_white w-full max-h-64 overflow-hidden">
                  <span className="text-lg md:text-3xl font-bold">{album.title}</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {album.categories?.map((item, idx) => (
                      <Button key={idx} className="bg-color_puppy text-sm" size="sm">
                        {item.categories.title}
                      </Button>
                    ))}
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
    ◀
  </button>
  
  <span className="text-white text-sm flex-grow text-center">
    No.{current + 1}
  </span>
  
  <button
    onClick={nextSlide}
    className="h-8 w-8 bg-gray-800 text-white rounded-full flex items-center justify-center"
  >
    ▶
  </button>
</div>

    </div>
  );
}