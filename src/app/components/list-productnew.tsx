import { AlbumType } from '@/lib/type';
import Image from "next/image";
import { FaEye } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ListProductNew({ albums }: { albums: AlbumType[] }) {
  return (
    <div className="container__listproduct max-w-full overflow-x-hidden">
      <div className="title_new--update p-4 flex items-center justify-between text-color_white">
        <div className="flex gap-2 items-center">
          <Image src="https://cmangax.com/assets/img/icon/top/fire.png" alt="item" width={40} height={20} />
          <span>Truyện mới cập nhật</span>
        </div>
        <Button className="rounded-sm">Xem thêm...</Button>
      </div>
      <div className="flex p-1 flex-col md:flex-row md:flex-wrap gap-4 max-w-full">
        {albums.map((item, index) => (
          <Card
            key={index}
            className="flex w-full md:w-[calc(50%-1rem)] p-2 rounded-sm border-none bg-bg_color"
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
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    <FaEye className="text-color_puppy" />
                    {item.chapters?.at(0)?.view ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <CiBookmark className="text-color_puppy" />
                    {item.follow ?? 0}
                  </span>
                </div>
              </div>

              {/* Danh mục truyện */}
  

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
    </div>
  );
}