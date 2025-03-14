"use client";
import React, { useState, useEffect } from "react";
import { Card, Table, Button, Drawer, message } from "antd";
import ImageComponents from "../../../../components/ImageComponents";
import { getAlbums } from "../../../../(action)/album";
import { AlbumType } from "../../../../../lib/type";
import FormAlbum from "./AlbumFormDrawer";
import { CardContent } from "../../../../../components/ui/card";
import { AlbumsCategories } from '../../../../components/DetailsAlbums';
import Link from 'next/link';

const ComicAlbumPage = () =>
{
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<AlbumType | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() =>
    {
        getAlbums().then((data) =>
        {
            const cleanedData = data.map((album) => ({
                ...album,
                title: album.title ?? "Không có tiêu đề",
                content: album.content ?? "",
                image_url: album.image_url ?? "",
            }));
            setAlbums(cleanedData as AlbumType[]);
        });
    }, []);


    const openForm = (album?: AlbumType) =>
    {
        setSelectedAlbum(album);
        setIsOpen(true);
    };

    const closeForm = () =>
    {
        setIsOpen(false);
        setSelectedAlbum(undefined);
    };

    const handleDeleteAlbum = async (id: number) =>
    {
        setLoading(true);
        try {
            // await deleteAlbum(id);
            message.success("Xóa album thành công!");
            getAlbums().then((data) => setAlbums(data as AlbumType[]));
        } catch {
            message.error("Xóa album thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto mt-12 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Danh Sách Album Truyện Tranh</h1>
                <Button onClick={() => openForm()} className="bg-green-700">Thêm Album</Button>
            </div>

            <Drawer title={selectedAlbum ? "Chỉnh sửa album" : "Thêm album"} onClose={closeForm} open={isOpen}>
                <FormAlbum album={selectedAlbum} onSuccess={() =>
                {
                    closeForm();
                    getAlbums().then((data) => setAlbums(data as AlbumType[]));

                }} />
            </Drawer>

            <Card>
                <CardContent>
                    <Table dataSource={albums} rowKey="id">
                        <Table.Column title="ID" dataIndex="id" />
                        <Table.Column className="w-32" title="Ảnh bìa" render={(album: AlbumType) => (
                            <ImageComponents image={{ src: album.image_url, name: album.title }} />
                        )} />
                        <Table.Column title="Tên Album" dataIndex="title" />
                        <Table.Column title="Nội dung" dataIndex="content" />
                        <Table.Column title="Danh mục" render={(album: AlbumType) => (
                            <AlbumsCategories item={album} />
                        )} />
                        <Table.Column title="Thao tác" render={(album: AlbumType) => (
                            <div className="flex gap-2">
                                <Button className="bg-green-700" onClick={() => openForm(album)}>Sửa</Button>
                                <Link href="index/chapter">
                                    <Button className="bg-green-700">Chapter</Button></Link>
                                <Button className="bg-red-700" loading={loading} onClick={() => handleDeleteAlbum(album.id)}>Xóa</Button>
                            </div>
                        )} />
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ComicAlbumPage;
