import { AlbumType } from '@/lib/type';
import Image from "next/image";

import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlbumStats, AlbumsCategories } from './DetailsAlbums';
import { HoverCard } from './StyleComponents';
import { useAlbum } from '../provider/ProviderContext';
export default function ListProductNew({ albums }: { albums: AlbumType[]; })
{
  const goToAlbumDetails = useAlbum();
  return (
    <div className="flex p-1 overflow-hidden flex-col md:flex-row md:flex-wrap gap-4 max-w-full">
      {albums.map((item, index) => (
        <Card
          onClick={() => goToAlbumDetails(item.title, item.id)}
          key={index}
          className={`flex cursor-pointer ${HoverCard}  w-full md:w-[calc(50%-1rem)] p-2 rounded-sm border-none bg-bg_color`}
        >
          {/* Image */}
          <div className="album__image flex justify-center items-center w-32 h-32 aspect-square">
            <Image
              src={item.image_url ?? "https://cmangax.com/assets/tmp/album/58911.png?v=1723715357"}
              alt="name"
              width={128}
              height={128}
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          {/* Content */}
          <CardContent className="flex flex-col w-full  text-color_white min-w-0">
            <span className="font-bold">{item.title}</span>

            {/* Thông tin lượt xem & đánh dấu */}
            <div className="flex p-2 items-center justify-between gap-4">
              <AlbumStats views={0} following={1} />
            </div>

            {/* Danh mục truyện */}
            <div className="flex gap-2 items-center">
              <AlbumsCategories item={item} />
            </div>

            {/* Chương mới nhất */}
            <div className="flex mt-auto justify-between opacity-70 text-sm">
              <span>{item.chapters?.length ? item.chapters[0]?.name ?? "đang cập nhật" : "đang cập nhật"}</span>
              <span>
                {timeAgo(item.chapters?.length ? item.chapters.at(0)?.created_at ?? "đang cập nhật" : "đang cập nhật")}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}