import { useState } from "react";
import { Card, List, Typography, Space } from "antd";
import Image from "next/image";
import { EyeOutlined, HeartOutlined } from '@ant-design/icons';

const mockupAlbum = [
  {
    id: 1,
    name: "Truyện tranh",
    follow: 100,
    image: "https://nettruyen3q.com/_next/image?url=https%3A%2F%2Fs1.nettruyen3q.com%2Fimages%2Fthumbnails%2Fnguoc-dong-ve-mua-xuan.jpg&w=256&q=75",
    chapter: [
      { id: 1, name: "Chương 1", view: 20 },
      { id: 2, name: "Chương 2", view: 30 },
      { id: 3, name: "Chương 3", view: 50 },
    ]
  },
  {
    id: 2,
    name: "Truyện tranh 1",
    follow: 100,
    image: "https://nettruyen3q.com/_next/image?url=https%3A%2F%2Fs1.truyentranh3q.com%2Fimages%2Fthumbnails%2Ftinh-giap-hon-tuong.jpg&w=1920&q=75",
    chapter: [
      { id: 1, name: "Chương 1", view: 232 },
      { id: 2, name: "Chương 2", view: 3032 },
      { id: 3, name: "Chương 3", view: 5011 },
    ]
  },
  {
    id: 3,
    name: "Truyện tranh 1",
    follow: 100,
    image: "https://nettruyen3q.com/_next/image?url=https%3A%2F%2Fs1.truyentranh3q.com%2Fimages%2Fthumbnails%2Fta-la-dai-than-tien.jpg&w=1920&q=75",
    chapter: [
      { id: 1, name: "Chương 1", view: 320 },
      { id: 2, name: "Chương 2", view: 234 },
      { id: 3, name: "Chương 3", view: 235 },
    ]
  },
  {
    id: 4,
    name: "Truyện tranh 1",
    follow: 100,
    image: "https://nettruyen3q.com/_next/image?url=https%3A%2F%2Fs1.nettruyen3q.com%2Fimages%2Fthumbnails%2Ftu-chuc-nghiep-yeu-nhat-tro-thanh-tho-ren-manh-nhat.jpg&w=256&q=75",
    chapter: [
      { id: 1, name: "Chương 1", view: 87, created_at: "Vài giây trước" },
      { id: 2, name: "Chương 2", view: 34 },
      { id: 3, name: "Chương 3", view: 340 },
    ]
  },
];

interface Chapter {
  id: number;
  name: string;
  view: number;
  created_at?: string;
}

interface Album {
  id: number;
  image: string;
  name: string;
  chapter: Chapter[];
  follow: number;
}

export default function CardTOPBXH() {
  const [album] = useState<Album[]>(mockupAlbum);
  const data = album.map((item, index) => ({
    title: item.name,
    views: item.chapter.reduce((total, ch) => total + ch.view, 0),
    latestChapter: item.chapter[item.chapter.length - 1].name,
    follow: item.follow,
    image: item.image,
    createdAt: item.chapter[0].created_at ?? "",
    rank: `#${index + 1}`
  }));

  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={item => (
        <List.Item>
          <Card
            style={{ background: "transparent", borderRadius: "0", border: "none", borderBottom: "1px solid gray" }}
            className="relative hover:shadow-md w-full transition-shadow">
            <div className="flex">
              <div className="relative  flex-shrink-0 w-20 h-24">
                <div className="absolute z-10 top-[-10] left-[-5] bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {item.rank}
                </div>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-sm"
                />
              </div>
              <div className="flex flex-col w-full items-center">
                <Typography.Title style={{ color: "white" }} level={5} className="mt-0 mb-1 font-semibold text-sm truncate">
                  {item.title}
                </Typography.Title>
                <Typography.Text style={{ color: "white" }} type="secondary" className="text-xs text-white text-nowrap mb-2">
                  Mới nhất: {item.latestChapter}
                </Typography.Text>
                <Space className="mt-auto space-x-2 text-white">
                  <div className="flex items-center text-xs text-white">
                    <EyeOutlined style={{ color: "white", fontSize: "10px" }} className="mr-1 text-white" />
                    <Typography.Text className="text-white">
                      {item.views}
                    </Typography.Text>
                  </div>
                  <div className="flex items-center text-xs text-white">
                    <HeartOutlined style={{ color: "white", fontSize: "10px" }} className="mr-1 text-red-500" />
                    <Typography.Text className="text-nowrap" style={{ color: "white" }}>{item.follow}</Typography.Text>
                  </div>
                </Space>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
}
