"use client";

import Image from 'next/image';
import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageType {
    src: string;
    name: string;
}

export default function ImageComponents({ image }: { image: ImageType; }) {
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fallbackImage = "https://placehold.co/600x800/2563eb/white?text=Chapter+Page";
    const src = (!image.src || image.src.trim() === "" || isError)
        ? fallbackImage
        : image.src;

    return (
        <div className="relative w-full h-full bg-white/5 overflow-hidden flex items-center justify-center">
            {isLoading && !isError && (
                <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-white/5">
                    <ImageIcon className="w-8 h-8 text-white/10" />
                </div>
            )}

            <Image
                src={src}
                alt={image.name || "Truyện Tranh"}
                fill
                unoptimized
                draggable={false}
                className={`object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsError(true);
                    setIsLoading(false);
                }}
                onContextMenu={(e) => e.preventDefault()}
            />
        </div>
    );
}
