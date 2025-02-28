import { SiteHeader } from "@/components/site-header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// ===============Header=============
import Autoplay from "embla-carousel-autoplay"
import { CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { Typography } from "antd";
import React, { useState } from "react";
import { AlbumType } from "@/lib/type";
export default function CarouselComponents({ albums }: { albums: any }) {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    React.useEffect(() => {
        if (!api) {
            return
        }
        setCurrent(api.selectedScrollSnap() + 1)
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])
    return (
        <Carousel
            setApi={setApi}
            plugins={[plugin.current]}
            className="w-full relative  max-h-96 p-0 h-96"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}>
            <CarouselContent className="p-0 border-none">
                {albums.map((_: AlbumType, index: number) => (
                    <CarouselItem key={index}>
                        <div className="h-96 p-0  relative">
                            <Image
                                src={_.image_url ?? "https://imgs.search.brave.com/8bHoBZczToeB5Rr3Wsk10sSIFEhjdr3z1fRreaUPvZk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzExLzk3LzY0LzQ3/LzM2MF9GXzExOTc2/NDQ3MjhfRm1yTTVQ/VzhYd09rdjZXWVpN/SWhtQXJOdW5yU285/MEEuanBn"}
                                width={100}
                                height={100}
                                alt={_.name}
                                className="absolute p-0 blur-lg brightness-50 bottom-0 top-0 w-full center left-0 right-0" />
                            <CardContent className="flex  container p-0 mx-auto left-0 right-0   absolute md:bottom-0 bottom-12 z-50">
                                <div className="flex">
                                    <div className="w-48 h-56 aspect-square">
                                        <Image
                                            src={_.image_url ?? "https://imgs.search.brave.com/8bHoBZczToeB5Rr3Wsk10sSIFEhjdr3z1fRreaUPvZk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzExLzk3LzY0LzQ3/LzM2MF9GXzExOTc2/NDQ3MjhfRm1yTTVQ/VzhYd09rdjZXWVpN/SWhtQXJOdW5yU285/MEEuanBn"}
                                            width={50}
                                            height={50}
                                            alt="20"
                                            className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex text-color_white flex-col w-full">
                                        <span className="card__title md:text-3xl  font-bold">{_.name}</span>
                                        <div className="flex mt-5 flex-wrap gap-1">
                                            {_.categories?.map((item,index) =>
                                                <Button key={index} className="bg-color_puppy">{item.name}</Button>
                                            )}
                                        </div>
                                        <span className="hidden  md:block">{_.description}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </div>
                    </CarouselItem>
                ))} 
            </CarouselContent>
            <div className="carousel__action items-center left-[50%] mx-auto  md:left-[90%] flex z-1 absolute bottom-2">
                <span className="text-white">
                    No.{current}
                </span>
                <CarouselPrevious />
                <CarouselNext />
            </div>
        </Carousel>
    )
}