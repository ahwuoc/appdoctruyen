import { AlbumType } from "@/lib/type";
import React, { useState } from "react";

import { GrFormNextLink } from "react-icons/gr";
import { GrFormPreviousLink } from "react-icons/gr";
import { FaEye } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";

export default function SlideCard({ albums }: { albums: AlbumType[] }) {
    const [currentPosition, setCurrentPosition] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1);

    const totalSlides = albums.length;

    const getItemsPerView = () => {
        if (window.innerWidth >= 1280) return 6;
        if (window.innerWidth >= 1024) return 5;
        if (window.innerWidth >= 768) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    };
    React.useEffect(() => {
        setItemsPerView(getItemsPerView());
        const handleResize = () => {
            setItemsPerView(getItemsPerView());
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])


    // slide 100% / so luong
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
        <div className="carousel-container relative mx-auto max-w-full overflow-x-hidden ">
            <button
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-500 text-white px-2 py-1 z-10 rounded-full hover:bg-gray-700"
                onClick={handlePrev}
            >
                <GrFormPreviousLink />
            </button>
            <div
                className="slide-container flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentPosition * (100 / itemsPerView)}%)` }}>
                {albums.map((album, index) => (
                    <div
                        key={index}
                        className="slide flex-col justify-center flex-shrink-0 flex  text-color_white"
                        style={{ width: `${slideWidth}%` }}>
                        <div className="card w-[80%] h-3/4 mx-auto overflow-hidden shadow-md">
                            <img
                                src={album.image_url}
                                alt={album.name || "Album image"}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-500 text-white px-2 py-1 z-10 rounded-full hover:bg-gray-700"
                onClick={handleNext}
            >
                <GrFormNextLink />
            </button>
        </div>
    );
}