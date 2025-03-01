'use client';
import * as React from "react";

import CarouselComponents from '@/app/components/Carousel';
import SlideCard from '@/app/components/SlideCard';
import { AlbumType } from "@/lib/type"
import { apiProduct } from '@/app/apiRequest/apiProduct';
import ListTopAlbum from '@/app/components/list-album-bxh';
import ListProductNew from '@/app/components/list-productnew';



export default function Page()
{
  const [albums, setAlbums] = React.useState<AlbumType[]>([]);
  const [albumsNew, setAlbumNew] = React.useState<AlbumType[]>([]);

  React.useEffect(() =>
  {
    const albumsGet = async () =>
    {
      const responseAll = await apiProduct.getAlbums();
      const responseNew = await apiProduct.getAlbumsNew();
      setAlbumNew(responseNew.payload);
      setAlbums(responseAll.payload);
    };
    albumsGet();
  }, []);

  return (
    <div className="main__content ">
      <CarouselComponents albums={albums} />
      <div className="container mx-auto">
        <div className="container mx-auto flex flex-wrap flex-col md:flex-row md:flex-nowrap gap-4">
          <div className="md:basis-[70%] flex flex-col list--product new--update max-w-full">
            <ListProductNew albums={albumsNew} />
          </div>
          <div className="list__top--list md:basis-[30%] nav-bar">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <ListTopAlbum albums={albums} />
              </div>
              <div className="flex-1">
                <ListTopAlbum albums={albums} />
              </div>
              <div className="flex-1">
                 <div className="container-ttv p-2  h-full">
                 <div className="container-ttv flex items-center border-bg_color rounded-lg border-2 p-4 h-full">
                    <button className=' border-2 rounded-lg bg-bg_color w-full text-color_white font-bold  p-4'>Tuyển người dịch truyện</button>
                 </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto flex flex-wrap gap-4">
          <div className="w-full album_slick mt-5">
            <span className="text-color_white font-bold text-xl">Truyện nổi bật</span>
            <SlideCard albums={albums} />
          </div>
          <div className="w-full album_slick mt-5">
            <span className="text-color_white font-bold text-xl">Truyện nổi bật</span>
            <SlideCard albums={albums} />
          </div>
        </div>
      </div>
    </div>
  );
}