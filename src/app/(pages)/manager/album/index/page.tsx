"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Shadcn Button
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from "@/components/ui/drawer";
import ImageComponents from "../../../../components/ImageComponents";
import { getAlbums } from "../../../../(action)/album";
import { AlbumType } from "../../../../utils/types/type";
import FormAlbum from "./AlbumFormDrawer";
import { AlbumsCategories } from "../../../../components/DetailsAlbums";
import Link from "next/link";

const ComicAlbumPage = () => {
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<AlbumType | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAlbums().then((data) => {
            const cleanedData = data.map((album) => ({
                ...album,
                title: album.title ?? "Không có tiêu đề",
                content: album.content ?? "",
                image_url: album.image_url ?? "",
            }));
            setAlbums(cleanedData as AlbumType[]);
        });
    }, []);

    const openForm = (album?: AlbumType) => {
        setSelectedAlbum(album);
        setIsOpen(true);
    };

    const closeForm = () => {
        setIsOpen(false);
        setSelectedAlbum(undefined);
    };

    const handleDeleteAlbum = async (id: number) => {
        setLoading(true);
        try {
            // await deleteAlbum(id);
            //     toast({
            //         title: "Thành công",
            //         description: "Xóa album thành công!",
            //     });
            //     getAlbums().then((data) => setAlbums(data as AlbumType[]));
            // } catch {
            //     toast({
            //         title: "Lỗi",
            //         description: "Xóa album thất bại!",
            //         variant: "destructive",
            //     });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto mt-12 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Danh Sách Album Truyện Tranh</h1>
                <Button onClick={() => openForm()} className="bg-green-700 hover:bg-green-800">
                    Thêm Album
                </Button>
            </div>

            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent className="w-1/4">
                    <DrawerHeader>
                        <DrawerTitle>{selectedAlbum ? "Chỉnh sửa album" : "Thêm album"}</DrawerTitle>
                        <DrawerClose />
                    </DrawerHeader>
                    <div className="p-4">
                        <FormAlbum
                            album={selectedAlbum}
                            onSuccess={() => {
                                closeForm();
                                getAlbums().then((data) => setAlbums(data as AlbumType[]));
                            }}
                        />
                    </div>
                </DrawerContent>
            </Drawer>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách album</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead className="w-32">Ảnh bìa</TableHead>
                                <TableHead>Tên Album</TableHead>
                                <TableHead>Nội dung</TableHead>
                                <TableHead>Danh mục</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {albums.map((album) => (
                                <TableRow key={album.id}>
                                    <TableCell>{album.id}</TableCell>
                                    <TableCell>
                                        <ImageComponents image={{ src: album.image_url, name: album.title }} />
                                    </TableCell>
                                    <TableCell>{album.title}</TableCell>
                                    <TableCell>{album.content}</TableCell>
                                    <TableCell>
                                        <AlbumsCategories item={album} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                className="bg-green-700 hover:bg-green-800"
                                                onClick={() => openForm(album)}
                                            >
                                                Sửa
                                            </Button>
                                            <Link href="index/chapter">
                                                <Button className="bg-green-700 hover:bg-green-800">Chapter</Button>
                                            </Link>
                                            <Button
                                                className="bg-red-700 hover:bg-red-800"
                                                disabled={loading}
                                                onClick={() => handleDeleteAlbum(album.id)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ComicAlbumPage;