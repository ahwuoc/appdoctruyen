"use client";

import { SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { CiSearch } from "react-icons/ci";
import { Avatar } from "antd";
import { Input } from "antd";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AlbumType } from "../lib/type";
import { timeAgo } from "../lib/utils";
import http from "../lib/http";

export function SiteHeader()
{
  const { toggleSidebar } = useSidebar();
  const [search, setSearch] = useState<string>("");
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() =>
  {
    const fetchAlbums = async () =>
    {
      if (!search.trim()) {
        setAlbums([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await http.get<AlbumType[]>(`/api/albums?query=${encodeURIComponent(search)}`);
        setAlbums(response.payload || []);
      } catch (err) {
        setError("Không thể tải dữ liệu tìm kiếm");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(fetchAlbums, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() =>
  {
    const handleClickOutside = (event: MouseEvent) =>
    {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () =>
    {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <header className="flex bg-bg_color sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex md:container md:mx-auto justify-between h-[--header-height] w-full items-center gap-2 px-4">
        <Button
          className="h-12 w-12 border-none hover:none bg-transparent text-white"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <div className="flex items-center">
          <Button
            className="text-white border-none bg-transparent"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
          >
            <CiSearch />
          </Button>
          {isModalOpen && (
            <div className="fixed bottom-0 left-0 right-0 top-0  flex justify-center bg-black bg-opacity-50 ">
              <div
                ref={modalRef}
                className="rounded-lg shadow-lg w-full max-w-lg p-4 flex flex-col gap-4 max-h-[40vh]"
              >
                <div className="flex justify-between items-center">
                  <h2 className="hidden">Tìm kiếm</h2>
                </div>
                <Input.Search
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm truyện..."
                  className="bg-customBg"
                />
                <div className="flex-1 overflow-hidden">
                  {isLoading && <div className="text-center text-white">Đang tải...</div>}
                  {error && <div className="text-center text-red-500">{error}</div>}
                  {!isLoading && !error && albums.length > 0 && (
                    <div className="bg-customBg2 p-4 rounded-md max-h-full overflow-y-auto">
                      <div className="flex flex-col gap-y-2">
                        {albums.slice(0, 3).map((item, index) => (
                          <Card
                            key={item.id || index}
                            className="flex p-2 items-center rounded-sm border-none bg-bg_color w-full"
                          >
                            <div className="flex w-full min-w-0">
                              <div className="album__image flex items-center h-20 aspect-square">
                                <Image
                                  src={
                                    item.image_url ??
                                    "https://cmangax.com/assets/tmp/album/58911.png?v=1723715357"
                                  }
                                  alt={item.title || "Album image"}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-contain rounded-sm"
                                />
                              </div>
                              <CardContent className="flex w-full flex-col pl-2 text-color_white min-w-0">
                                <span className="font-bold truncate">{item.title}</span>
                                <div className="flex mt-auto justify-between opacity-70 text-sm">
                                  <span>
                                    {item.chapters?.length
                                      ? item.chapters[0]?.name ?? "Đang cập nhật"
                                      : "Đang cập nhật"}
                                  </span>
                                  <span>
                                    {item.chapters?.length
                                      ? timeAgo(item.chapters[0]?.created_at ?? new Date().toISOString())
                                      : "Đang cập nhật"}
                                  </span>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  {!isLoading && !error && search && albums.length === 0 && (
                    <div className="text-center text-white">Không tìm thấy kết quả</div>
                  )}
                </div>
              </div>
            </div>
          )}
          <Separator orientation="vertical" className="mx-2 h-4" />
          <div className="relative inline-block text-left">
            <Button className="bg-transparent border-none" variant="outline">
              <Avatar />
            </Button>
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-bg_color ring-1 ring-black ring-opacity-5 hidden group-hover:block">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-color_white">Đăng ký</div>
                <div className="px-4 py-2 text-sm text-color_white">Đăng nhập</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}