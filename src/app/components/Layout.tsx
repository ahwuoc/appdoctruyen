import * as React from "react";

import CarouselComponents from "./Carousel";


// ============Car===========
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,

} from "@/components/ui/card"
import SlideCard from "./SlideCard";

// =======================
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { timeAgo } from "@/lib/utils";
import generateMockupData from "../data/database";
import { AlbumType } from "@/lib/type";
export default function LayoutIndex() {

  const [albums, setAlbums] = React.useState<AlbumType[]>([]);
  React.useEffect(() => {
    const data = generateMockupData(30);
    console.log(data);
    setAlbums(data);
  }, [])

  return (
    <div className="main__content">
      {/* =========Display Carsoul=========== */}
      <CarouselComponents albums={albums} />
      {/* =============Content Chung======== */}
      <div className="container mx-auto">
        <div className="container mx-auto flex flex-wrap  flex-col md:flex-row md:flex-nowrap">
          {/* ================New Product============ */}
          <div className="container md:basis-[70%] flex flex-col list--product new--update">
            <div className="title_new--update p-4 flex items-center justify-between text-color_white">
              <div className="flex gap-2 items-center">
                <Image src={"https://cmangax.com/assets/img/icon/top/fire.png"} alt="item" width={40} height={20} />
                <span >Truyện mới cập nhật</span>
              </div>
              <Button className="rounded-sm">Xem thêm...</Button>
            </div>
            <div className="flex p-1 flex-col md:flex-row flex-wrap gap-1 md:gap-4">
              {albums.map((item, index) => (
                <Card key={index} className="flex  md:w-[calc(50%-8px)] py-2 rounded-sm border-none bg-bg_color">
                  {/* Image */}
                  <div className="album__image flex justify-center items-center w-32 h-32 aspect-square">
                    <Image
                      src={item.image_url ?? "https://cmangax.com/assets/tmp/album/58911.png?v=1723715357"}
                      alt="name"
                      width={128}
                      height={128}
                      className="w-full h-full object-contain rounded-sm"
                    />
                  </div>
                  {/* Content */}
                  <CardContent className="flex flex-col w-full p-0 text-color_white">
                    <span className="font-bold">{item.name}</span>

                    {/* Thông tin lượt xem & đánh dấu */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1"><FaEye className="text-color_puppy" />{item.chapters?.at(0)?.view}</span>
                        <span className="flex items-center gap-1"><CiBookmark className="text-color_puppy" />{item.follow}</span>
                      </div>
                    </div>

                    {/* Danh mục truyện */}
                    <div className="list-danh-muc-truyen gap-1 mt-2 flex flex-wrap">
                      {item?.categories?.length ? (
                        <>
                          {item.categories.slice(0, 3).map((category, index) => (
                            <span key={index} className="text-sm bg-color_puppy rounded-sm p-1">
                              {category.name}
                            </span>
                          ))}
                          {item.categories.length > 3 && (
                            <span className="text-sm bg-color_puppy rounded-sm p-1">...</span>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Chưa có danh mục</span>
                      )}
                    </div>
                    {/* Chương mới nhất */}
                    <div className="flex mt-auto justify-between opacity-70 text-sm">
                      <span>{item.chapters?.length ? item.chapters[0]?.name ?? "đang cập nhật" : "đang cập nhật"}</span>
                      <span>{timeAgo(item.chapters?.length ? item.chapters.at(0)?.created_at ?? "đang cập nhật" : "đang cập nhật")}</span>
                    </div>
                  </CardContent>

                </Card>
              ))}
            </div>
          </div>
          {/* ============Navbar============= */}
          <div className="container list__top--list md:basis-[30%] nav-bar">
            <div className="flex flex-col">
              <div className="title_new--update p-4 flex items-center justify-between text-color_white">
                <div className="flex gap-2 items-center">
                  <Image src={"https://cmangax.com/assets/img/icon/top/coin.png"} alt="item" width={40} height={20} />
                  <span >BXH Top</span>
                </div>
                <Button className="rounded-sm">Xem thêm...</Button>
              </div>
              <div className="flex p-2 gap-2 flex-col flex-wrap">
                {albums.slice(0, 5).map((item, index) => (
                  <Card key={index} className="flex p-2  items-center rounded-sm border-none bg-bg_color">
                    {/* Image */}
                    <span className={`text-yellow-700 num-${index} text-center glow-text  font-bold text-2xl`}>
                      {index + 1}
                    </span>
                    {/*Content*/}
                    <div className="container-card w-full flex">
                      <div className="album__image flex items-center h-20 aspect-square">
                        <Image
                          src={item.image_url ?? "https://cmangax.com/assets/tmp/album/58911.png?v=1723715357"}
                          alt="name"
                          width={128}
                          height={128}
                          className="w-full h-full object-contain rounded-sm"
                        />
                      </div>
                      <CardContent className="flex w-full flex-col p-0 text-color_white">
                        <span className="font-bold">{item.name}</span>
                        <div className="flex mt-auto justify-between opacity-70 text-sm">
                          <span>
                            {item?.chapters?.length ? item.chapters.at(0)?.name ?? "Đang cập nhật" : "Đang cập nhật"}
                          </span>
                          <span>
                            {item?.chapters?.length ? timeAgo(item.chapters.at(0)?.created_at ?? new Date().toISOString()) : "Đang cập nhật"}
                          </span>
                        </div>
                      </CardContent>
                    </div>

                  </Card>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="title_new--update p-4 flex items-center justify-between text-color_white">
                <div className="flex gap-2 items-center">
                  <Image src={"https://cmangax.com/assets/img/icon/top/fire.png"} alt="item" width={40} height={20} />
                  <span >BXH Đề Cử</span>
                </div>
                <Button className="rounded-sm">Xem thêm...</Button>
              </div>
              <div className="flex p-2 gap-2 flex-col flex-wrap">
                {albums.slice(0, 5).map((item, index) => (
                  <Card key={index} className="flex p-2  items-center rounded-sm border-none bg-bg_color">
                    {/* Image */}
                    <span className={`text-yellow-700 num-${index} text-center glow-text  font-bold text-2xl`}>
                      {index + 1}
                    </span>
                    {/*Content*/}
                    <div className="container-card w-full flex">
                      <div className="album__image flex items-center h-20 aspect-square">
                        <Image
                          src={item.image_url ?? "https://cmangax.com/assets/tmp/album/58911.png?v=1723715357"}
                          alt="name"
                          width={128}
                          height={128}
                          className="w-full h-full object-contain rounded-sm"
                        />
                      </div>
                      <CardContent className="flex w-full flex-col p-0 text-color_white">
                        <span className="font-bold">{item.name}</span>
                        <div className="flex mt-auto justify-between opacity-70 text-sm">
                          <span>
                            Chapter {item?.chapters?.length ? item.chapters.at(0)?.name ?? "Đang cập nhật" : "Đang cập nhật"}
                          </span>
                          <span>
                            {item?.chapters?.length ? timeAgo(item.chapters.at(0)?.created_at ?? new Date().toISOString()) : "Đang cập nhật"}
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Truyen noi bat */}
        {/* ========================= */}
        <div className="container flex flex-wrap">
          <div className="container album_slick mt-5">
            <span className="text-color_white font-bold text-xl">Truyện nối bật</span>
            <SlideCard albums={albums} />
          </div>
          <div className="container album_slick mt-5">
            <span className="text-color_white font-bold text-xl">Truyện mới nhất</span>
            <SlideCard albums={albums} />
          </div>
        </div>
      </div>
    </div>
  );
}
