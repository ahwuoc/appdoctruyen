import { Button } from '../../components/ui/button';
import { CiSearch } from 'react-icons/ci';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import http from '../utils/types/http';
import React, { useState, useEffect, Suspense } from 'react';
import type { AlbumType } from '../utils/types/type';
import AlbumsList from './list-productnew';
import Loading from '../loading';
import { DialogTitle } from '@radix-ui/react-dialog';

export default function SearchComponents() {
    const [search, setSearch] = useState<string>("");
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [debouncetimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
    const fetchAlbums = async (query: string) => {
        if (!search.trim()) {
            setAlbums([]);
            return;
        }
        try {
            const response = await http.get<AlbumType[]>(`/api/albums?query=${encodeURIComponent(search)}`);
            setAlbums(response.payload || []);
        } catch (err) {
            setAlbums([]);
        }
    };
    const handlerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (debouncetimer) {
            clearTimeout(debouncetimer);
        }
        const timer = setTimeout(() => {
            fetchAlbums(value);
        }, 500)
        setDebounceTimer(timer
        )
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <CiSearch />
                </Button>
            </DialogTrigger>
            <DialogContent className="border-none p-0 bg-transparent flex flex-col sm:max-w-[425px] max-h-[525px] sm:min-h-[800px] overflow-auto ">
                <DialogTitle className='hidden'>Tiêu đề của dialog</DialogTitle>
                <div className="grid bg-color_puppy p-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            id="search"
                            className="col-span-3"
                            placeholder="Nhập tên album..."
                            value={search}
                            onChange={handlerSearch}
                        />
                        <Button onClick={() => fetchAlbums(search)}>Tìm kiếm</Button>
                    </div>
                </div>
                <div className="overflow-auto">
                    <Suspense fallback={<Loading />}>
                        <AlbumsList albums={albums} column={1} />
                    </Suspense>

                </div>
            </DialogContent>
        </Dialog>
    );
}
