import { Metadata } from 'next';
import HomeClient from './HomeClient';
import { Suspense } from 'react';
import Loading from './loading';

export const metadata: Metadata = {
  title: "Trang Chủ - App Đọc Truyện Online - Manga, Manhwa, Manhua Miễn Phí",
  description: "Trang chủ App Đọc Truyện Online - Tổng hợp truyện tranh Manga, Manhwa, Manhua mới nhất, hay nhất được cập nhật liên tục mỗi ngày.",
  alternates: {
    canonical: 'https://appdoctruyen.id.vn',
  },
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeClient />
    </Suspense>
  );
}
