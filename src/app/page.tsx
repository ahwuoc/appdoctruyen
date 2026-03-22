import { Metadata } from 'next';
import HomeClient from './HomeClient';
import { Suspense } from 'react';
import Loading from './loading';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.name} - Trang Chủ | Đọc Truyện Online Miễn Phí`,
  description: `Trang chủ ${siteConfig.name} - Tổng hợp truyện tranh Manga, Manhwa, Manhua mới nhất, hay nhất được cập nhật liên tục mỗi ngày.`,
  alternates: {
    canonical: siteConfig.url,
  },
};

import { getAlbums, getAlbumsNew } from './(action)/album';

export default async function Page() {
  const [albums, albumsNew] = await Promise.all([
    getAlbums(),
    getAlbumsNew()
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <HomeClient initialAlbums={albums} initialAlbumsNew={albumsNew} />
    </Suspense>
  );
}
