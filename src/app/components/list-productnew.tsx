import { AlbumType } from '@/lib/type';
import { timeAgo } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AlbumStats, AlbumsCategories } from './DetailsAlbums';
import { HoverCard } from './StyleComponents';
import { useAlbum } from '../provider/ProviderContext';
import ImageComponents from './ImageComponents';
import React from 'react';

export default function AlbumsList({ albums, column }: { albums: AlbumType[], column?: number; })
{
  const goToAlbumDetails = useAlbum();

  const col = column ?? 2;
  if (!albums.length) {
    return <div className="p-4 text-center text-color_white">Không có album nào để hiển thị</div>;
  }

  return (
    <div className="flex p-1 overflow-hidden flex-col md:flex-row md:flex-wrap  max-w-full">
      {albums.map((item, index) =>
      {
        const latestChapter = item.chapters?.[0];
        const chapterName = latestChapter?.name ?? "Đang cập nhật";
        const chapterTime = timeAgo(latestChapter?.created_at ?? "Đang cập nhật");

        return (
          <Card
            onClick={() => goToAlbumDetails(item.title, item.id)}
            key={item.id || index}
            role="button"
            tabIndex={0}
            className={`flex cursor-pointer ${HoverCard} w-1/${col} p-2 rounded-sm border-none bg-bg_color`}
          >
            <div className="album__image flex justify-center items-center w-32 h-32 aspect-square">
              <ImageComponents
                image={{
                  src: item.image_url,
                  name: item.title,
                }}
              />
            </div>
            <CardContent className="flex flex-col w-full text-color_white ">
              <span className="font-bold  text-nowrap">{item.title}</span>
              <div className="flex  items-center justify-between ">
                <AlbumStats views={0} following={0} />
              </div>
              <div className="flex gap-2  items-center">
                <AlbumsCategories item={item} />
              </div>
              <div className="flex mt-auto text-nowrap justify-between opacity-70 text-sm">
                <span>{chapterName}</span>
                <span>{chapterTime}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
