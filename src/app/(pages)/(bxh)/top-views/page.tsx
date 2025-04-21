"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getALbumsTopViews } from "../../../(action)/album";

interface Album {
    id: number;
    rank: number;
    title: string;
    views: number;
    image_url: string;
}

const TopMangaRanking: React.FC = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopAlbums = async () => {
            try {
                const data = await getALbumsTopViews();
                setAlbums(data);
            } catch (error) {
                console.error("Lỗi lấy top album:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopAlbums();
    }, []);

    if (loading) return <div className="text-center my-8">Đang tải top truyện... 📚</div>;
    if (albums.length === 0) return <div className="text-center my-8">Chưa có truyện nào hot cả! 😅</div>;

    return (
        <Card className="container  mx-auto my-8">
            <CardHeader>
                <CardTitle className="text-center text-2xl">
                    Top Bảng Xếp Hạng Truyện Tranh Nhiều Lượt Xem
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Hạng</TableHead>
                            <TableHead>Tên truyện</TableHead>
                            <TableHead>Hình ảnh</TableHead>
                            <TableHead>Lượt xem</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {albums.map((album) => (
                            <TableRow key={album.id}>
                                <TableCell>
                                    <Badge
                                        variant={
                                            album.rank === 1
                                                ? "default"
                                                : album.rank === 2
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                    >
                                        {album.rank}
                                    </Badge>
                                </TableCell>
                                <TableCell>{album.title}</TableCell>
                                <TableCell>
                                    <Image
                                        src={album.image_url.trim()}
                                        width={76}
                                        height={100}
                                        alt={album.title}
                                        className="object-cover rounded"
                                    />
                                </TableCell>
                                <TableCell>{album.views.toLocaleString()} lượt</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default TopMangaRanking;
