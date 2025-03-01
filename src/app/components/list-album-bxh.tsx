import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";
import type { AlbumType } from '@/lib/type';

export default function ListTopAlbum({ albums }: { albums: AlbumType[] }) {
  return (
    <div className="container-bxh-top h-full max-w-full">
      <div className="title_new--update p-4 flex items-center justify-between text-color_white">
        <div className="flex gap-2 items-center">
          <Image src="https://cmangax.com/assets/img/icon/top/coin.png" alt="item" width={40} height={20} />
          <span>BXH Top</span>
        </div>
        <Button className="rounded-sm">Xem thêm...</Button>
      </div>
      <div className="flex gap-y-2 flex-wrap max-w-full">
        {albums.slice(0, 5).map((item, index) => (
          <Card key={index} className="flex p-2 items-center rounded-sm border-none bg-bg_color w-full">
            {/* Số thứ tự */}
            <span className="text-yellow-700 text-center glow-text font-bold text-2xl w-8">
              {index + 1}
            </span>
            {/* Nội dung */}
            <div className="container-card pl-2 w-full flex min-w-0">
              <div className="album__image flex items-center h-20 aspect-square">
                <Image
                  src={item.image_url ?? "https://cmangax.com/assets/tmp/album/58911.png?v=1723715357"}
                  alt="name"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain rounded-sm"
                />
              </div>
              <CardContent className="flex w-full flex-col pl-2 text-color_white min-w-0">
                <span className="font-bold">{item.title}</span>
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
  );
}