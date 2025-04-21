"use client";
import React from "react";
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
import { getAlbumTopChapters } from "../../../(action)/album";

interface Album {
    id: number;
    rank: number;
    title: string;
    chapters: { id: number }[]; // Cập nhật kiểu chapters từ number thành array chứa id
    image_url: string;
}

const TopMangaRanking: React.FC = () => {
    const [albums, setAlbums] = React.useState<Album[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const data = await getAlbumTopChapters();
                setAlbums(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, []);

    if (loading) return <div className="text-center my-8">Đang tải top truyện... 📚</div>;
    if (albums.length === 0) return <div className="text-center my-8">Chưa có truyện nào hot cả! 😅</div>;

    return (
        <Card className="container w-full mx-auto my-8">
            <CardHeader>
                <CardTitle className="text-center text-2xl">
                    Top Bảng Xếp Hạng Truyện Tranh Nhiều Chương
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Hạng</TableHead>
                            <TableHead>Tên truyện</TableHead>
                            <TableHead>Hình ảnh</TableHead>
                            <TableHead>Chapters</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {albums.map((manga) => (
                            <TableRow key={manga.rank}>
                                <TableCell>
                                    <Badge
                                        variant={
                                            manga.rank === 1
                                                ? "default"
                                                : manga.rank === 2
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                    >
                                        {manga.rank}
                                    </Badge>
                                </TableCell>
                                <TableCell>{manga.title}</TableCell>
                                <TableCell>
                                    <Image
                                        src={manga.image_url.trim()}
                                        width={76}
                                        height={100}
                                        alt={manga.title}
                                        className="object-cover rounded"
                                    />
                                </TableCell>
                                <TableCell>{manga.chapters.length.toLocaleString()} chapters</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default TopMangaRanking;
