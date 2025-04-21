'use client';
import * as React from "react";

import CarouselComponents from '@/app/components/Carousel';
import SlideCard from '@/app/components/SlideCard';
import { AlbumType } from "@/utils/types/type";
import { apiProduct } from '@/app/apiRequest/apiProduct';
import ListTopAlbum from '@/app/components/list-album-bxh';
import AlbumsList from '@/app/components/list-productnew';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';

type slug = "new" | "hot";
import { Suspense } from 'react';
import Loading from './loading';

export default function Page() {
  const [albums, setAlbums] = React.useState<AlbumType[]>([]);
  const [albumsNew, setAlbumNew] = React.useState<AlbumType[]>([]);

  React.useEffect(() => {


    const albumsGet = async () => {
      const responseAll = await apiProduct.getAlbums();
      const responseNew = await apiProduct.getAlbumsNew();
      setAlbumNew(responseNew.payload);
      setAlbums(responseAll.payload);
    };
    albumsGet();
  }, []);
  const router = useRouter();
  const handleClick = (slug: slug) => {
    router.push(`/comic/${slug}/${1}`);
  };
  return (
    <Suspense fallback={<Loading />}>
      <div className="main__content"  >
        {/* Phần Carousel */}
        <CarouselComponents albums={albums} />

        {/* Nội dung chính */}
        <div className="container mx-auto">
          <div className="flex flex-wrap flex-col md:flex-row md:flex-nowrap gap-4">

            {/* Danh sách truyện mới cập nhật */}
            <div className="md:basis-[70%] flex flex-col list--product new--update max-w-full">
              <div className="container__listproduct">
                <div className="title_new--update p-4 flex items-center justify-between text-color_white">
                  <div className="flex gap-2 items-center">
                    <Image src="https://cmangax.com/assets/img/icon/top/fire.png" alt="item" width={40} height={20} />
                    <span>Truyện mới cập nhật</span>
                  </div>
                  <Button onClick={() => handleClick("hot")} className="rounded-sm">
                    Xem thêm...
                  </Button>
                </div>
                <AlbumsList albums={albumsNew} />
              </div>
            </div>
            {/* Danh sách BXH và tuyển dịch giả */}
            <div className="list__top--list md:basis-[30%] nav-bar">
              <div className="flex flex-col h-full">

                {/* BXH Truyện 1 */}
                <div className="flex-1">
                  <ListTopAlbum albums={albums} />
                </div>

                {/* BXH Truyện 2 */}
                <div className="flex-1">
                  <ListTopAlbum albums={albums} />
                </div>

                {/* Tuyển người dịch */}
                <div className="flex-1">
                  <div className="container-ttv py-2 h-full">
                    <div className="container-ttv flex items-center border-bg_color rounded-lg border-2 p-4 h-full">
                      <button className="border-2 rounded-lg bg-bg_color w-full text-color_white font-bold p-4">
                        Tuyển người dịch truyện
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Truyện nổi bật */}
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
    </Suspense>
  );
}
