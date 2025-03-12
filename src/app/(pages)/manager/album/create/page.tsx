"use client";
import { useState } from "react";
import
    {
        Card,
        CardHeader,
        CardTitle,
        CardContent,
    } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import
    {
        Drawer,
        DrawerContent,
        DrawerHeader,
        DrawerTitle,
        DrawerFooter,
        DrawerTrigger,
    } from "@/components/ui/drawer";
import
    {
        ImageIcon,
        FileTextIcon,
        BookOpenIcon,
        UploadIcon,
        PlusIcon,
    } from "lucide-react";
import
    {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
    } from "@/components/ui/table";

// Mockup dữ liệu album
const mockAlbums = [
    {
        id: 1,
        title: "One Piece",
        content: "Hành trình của Luffy và băng hải tặc Mũ Rơm.",
        image: "https://example.com/onepiece.jpg",
    },
    {
        id: 2,
        title: "Naruto",
        content: "Câu chuyện về ninja Naruto Uzumaki.",
        image: "https://example.com/naruto.jpg",
    },
    {
        id: 3,
        title: "Attack on Titan",
        content: "Cuộc chiến giữa con người và Titan.",
        image: "https://example.com/aot.jpg",
    },
];

const ComicAlbumPage = () =>
{
    const [albums, setAlbums] = useState(mockAlbums);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) =>
    {
        e.preventDefault();
        if (!title.trim()) return alert("Tên album không được để trống!");
        const newAlbum = {
            id: albums.length + 1,
            title,
            content,
            image: imagePreview || "https://example.com/default.jpg",
        };
        setAlbums([...albums, newAlbum]);
        setTitle("");
        setContent("");
        setImageFile(null);
        setImagePreview(null);
        setOpen(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () =>
            {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto mt-12 px-4">
            {/* Danh sách album */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <BookOpenIcon className="w-8 h-8 text-green-500" />
                    Danh Sách Album Truyện Tranh
                </h1>
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            Thêm Album
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="fixed inset-y-0 right-0 w-96 p-6 bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out">
                        <DrawerHeader>
                            <DrawerTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <BookOpenIcon className="w-6 h-6 text-green-500" />
                                Tạo Album Truyện Tranh
                            </DrawerTitle>
                        </DrawerHeader>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="block font-medium text-gray-700 flex items-center gap-2">
                                    <FileTextIcon className="w-5 h-5 text-blue-500" />
                                    Tên Album
                                </label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Nhập tên album truyện tranh..."
                                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg text-lg py-2"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block font-medium text-gray-700 flex items-center gap-2">
                                    <FileTextIcon className="w-5 h-5 text-blue-500" />
                                    Nội dung
                                </label>
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Mô tả nội dung album truyện tranh..."
                                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg min-h-[120px] text-lg"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block font-medium text-gray-700 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-blue-500" />
                                    Tải lên ảnh bìa
                                </label>
                                <div className="relative">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 border-gray-300 focus:ring-2 focus:ring-green-500 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                    <UploadIcon className="w-5 h-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                </div>
                                {imagePreview && (
                                    <div className="mt-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-w-full h-64 object-cover rounded-lg border border-gray-200 shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>

                            <DrawerFooter>
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-lg"
                                >
                                    <BookOpenIcon className="w-6 h-6" />
                                    Tạo Album Truyện
                                </Button>
                            </DrawerFooter>
                        </form>
                    </DrawerContent>
                </Drawer>
            </div>

            {/* Hiển thị danh sách album dưới dạng bảng */}
            <Card className="shadow-lg rounded-xl border border-gray-100">
                <CardContent className="p-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead className="w-[150px]">Ảnh bìa</TableHead>
                                <TableHead>Tên Album</TableHead>
                                <TableHead>Nội dung</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {albums.map((album) => (
                                <TableRow key={album.id}>
                                    <TableCell>{album.id}</TableCell>
                                    <TableCell>
                                        <img
                                            src={album.image}
                                            alt={album.title}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                    </TableCell>
                                    <TableCell className="font-semibold text-gray-800">
                                        {album.title}
                                    </TableCell>
                                    <TableCell className="text-gray-600">{album.content}</TableCell>
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