import { AlbumType } from '@/app/utils/types/type';
import { timeAgo } from "@/app/utils/common/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AlbumStats, AlbumsCategories } from './DetailsAlbums';
import { HoverCard } from './StyleComponents';
import { useAlbum } from '../utils/provider/ProviderContext';
import ImageComponents from './ImageComponents';
import React, { useEffect } from 'react';


export default function AlbumsList({ albums, column = 2 }: { albums: AlbumType[]; column?: number; }) {
  const [col, setCol] = React.useState(0);
  useEffect(
    () => {
      const updateColumn = () => {
        if (window.innerWidth <= 436) {
          setCol(1);
        }
        else {
          setCol(column);
        }
      };
      updateColumn();
      window.addEventListener("resize", updateColumn);
      return () => window.removeEventListener("resize", updateColumn);

    }
    , [column]);
  const cardWidth = `calc(100% / ${col} - 8px)`;
  const goToAlbumDetails = useAlbum();
  return (
    <div className="flex items-stretch flex-wrap gap-1">
      {albums.map((item, index) => {
        const latestChapter = item.chapters?.[0];
        const chapterName = latestChapter?.title ?? "Đang cập nhật";
        const chapterTime = timeAgo(latestChapter?.created_at ?? "Đang cập nhật");
        return (
          <Card
            onClick={() => goToAlbumDetails(item.title, item.id)}
            key={item.id || index}
            role="button"
            tabIndex={0}
            style={{ width: cardWidth }}
            className={`flex p-2  cursor-pointer h-40 overflow-hidden  ${HoverCard} rounded-sm border-none bg-bg_color`} >
            <div className="w-1/3  h-full flex justify-center items-center">
              <ImageComponents
                image={{
                  src: item.image_url,
                  name: item.title,
                }}
              />
            </div>
            <CardContent className="flex px-2 py-1 justify-between flex-col w-full text-color_white ">
              <span className="font-bold  text-nowrap">{item.title}</span>
              <div className="flex  items-center justify-between ">
                <AlbumStats views={0} following={0} />
              </div>
              <div className="flex gap-2 flex-wrap">
                <AlbumsCategories item={item} />
              </div>
              <div className="flex justify-between opacity-70 text-sm">
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
