import { useState } from "react";
import { Card, List, Typography } from "antd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const mockupAlbum = [
    {
        id: 1,
        name: "Ahwuoc",
        point: 100,
        avatar: "https://nettruyen3q.com/_next/image?url=https%3A%2F%2Fs1.nettruyen3q.com%2Fimages%2Fthumbnails%2Ftu-chuc-nghiep-yeu-nhat-tro-thanh-tho-ren-manh-nhat.jpg&w=256&q=75",
        border_avatar: "https://cmangax.com/assets/img/fame/frame/s3_1.png",
    },
    {
        id: 2,
        name: "Ahwuocdz",
        point: 100,
        avatar: "https://nettruyen3q.com/_next/image?url=https%3A%2F%2Fs1.nettruyen3q.com%2Fimages%2Fthumbnails%2Ftu-chuc-nghiep-yeu-nhat-tro-thanh-tho-ren-manh-nhat.jpg&w=256&q=75",
        border_avatar: "https://cmangax.com/assets/img/fame/frame/s3_2.png",
    },
    {
        id: 3,
        name: "Ahwuocdz",
        point: 100,
        avatar: "https://nettruyen3q.com/_next/image?url=https%3A%2F%2Fs1.nettruyen3q.com%2Fimages%2Fthumbnails%2Ftu-chuc-nghiep-yeu-nhat-tro-thanh-tho-ren-manh-nhat.jpg&w=256&q=75",
        border_avatar: "https://cmangax.com/assets/img/fame/frame/s4_1.png",
    },
    {
        id: 3,
        name: "Ahwuocdz",
        point: 100,
        avatar: "https://nettruyen3q.com/_next/image?url=https%3A%2F%2Fs1.nettruyen3q.com%2Fimages%2Fthumbnails%2Ftu-chuc-nghiep-yeu-nhat-tro-thanh-tho-ren-manh-nhat.jpg&w=256&q=75",
        border_avatar: "https://cmangax.com/assets/img/fame/frame/s3_3.png",
    },

];

interface TopUser {
    id: number;
    avatar: string;
    name: string;
    border_avatar: string;
    point: number;
}

export default function CardUserTop() {
    const [album] = useState<TopUser[]>(mockupAlbum);
    const data = album.map((item, index) => ({
        title: item.name,
        image: item.avatar,
        borderImage: item.border_avatar,
        rank: `#${index + 1}`,
        points: item.point,
    }));

    return (
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    <Card
                        style={{
                            background: "transparent",
                            borderRadius: "0",
                            border: "none",
                            borderBottom: "1px solid gray",
                        }}
                        className="relative hover:shadow-md w-full transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className="relative   items-center justify-center flex p-10">
                                <Image
                                    src={item.borderImage}
                                    alt={item.title}
                                    fill
                                    className="absolute inset-0 w-[200%] h-[200%] z-10  object-cover"
                                />
                                <Avatar >
                                    <AvatarImage  src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex flex-col">
                                <Typography.Title
                                    style={{ color: "white" }}
                                    level={5}
                                    className="mt-0 mb-1 font-semibold text-sm truncate"
                                >
                                    {item.title}
                                </Typography.Title>
                                <Typography.Text
                                    style={{ color: "white" }}
                                    type="secondary"
                                    className="text-xs text-color_white text-nowrap mb-2"
                                >
                                    Điểm: {item.points}
                                </Typography.Text>
                            </div>
                        </div>
                    </Card>
                </List.Item>
            )}
        />
    );
}
