'use client';
import React from 'react';
import ListProductNew from '../../../../../components/list-productnew';
import http from "@/lib/http";
import type { AlbumType } from "@/lib/type";
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

interface Comic {
    slug: string,
    num: string,
}

interface ResponseSlugAlbum {
    data: AlbumType[],
    pagination: {
        currentPage: number,
        itemsPerPage: number,
        totalItems: number,
        totalPages: number,
    },
}

export default function Comic({ params }: { params: Promise<Comic> }) {
    const [products, setProducts] = React.useState<AlbumType[]>([]);
    const [displayPages, setDisplayPages] = React.useState<(number | string)[]>([]); 
    const [currentPage, setCurrentPage] = React.useState(0);
    const { slug, num } = React.use(params);

    const router = useRouter();
    const maxDisplay = 5;

    const handlePageChange = (page: number) => {
        router.push(`/comic/${slug}/${page}`);
    };

    const pageNumber = parseInt(num, 10);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await http.get<ResponseSlugAlbum>(`/api/comic/${slug}/${pageNumber}`);
                if (!response.payload || !response.payload.data) return;

                setProducts(response.payload.data);

                const total = response.payload.pagination?.totalPages || 1;
                const current = response.payload.pagination?.currentPage || 1;

                setCurrentPage(current);

             
                const pages: (number | string)[] = [];

                if (total <= maxDisplay) {
                    for (let i = 1; i <= total; i++) {
                        pages.push(i);
                    }
                } else {
                    pages.push(1);

                    let start = Math.max(2, current - 1);
                    let end = Math.min(total - 1, current + 1);

                
                    if (current <= 3) {
                        start = 2;
                        end = maxDisplay - 1; 
                    } else if (current >= total - 2) {
                        start = total - maxDisplay + 2;
                        end = total - 1;
                    }

                    if (start > 2) {
                        pages.push('...');
                    }

                    for (let i = start; i <= end; i++) {
                        pages.push(i);
                    }

                    if (end < total - 1) {
                        pages.push('...');
                    }
                    if (end < total) {
                        pages.push(total);
                    }
                }
                setDisplayPages(pages);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, [slug, num]);

    return (
        <div className="container mx-auto">
            <div className='flex flex-col min-h-screen'>
                <div className="flex flex-1 flex-col list--product new--update">
                    <ListProductNew albums={products} />
                </div>
                <div className="pagination flex mt-auto justify-center gap-2 p-4">
                    {displayPages.map((item, index) => (
                        typeof item === 'number' ? (
                            <Button
                                key={index}
                                onClick={() => handlePageChange(item)}
                                className={`rounded-full ${item === currentPage ? 'bg-customBg2' : ''}`}
                            >
                                {item}
                            </Button>
                        ) : (
                            <Button key={index} className="px-2">...</Button>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}