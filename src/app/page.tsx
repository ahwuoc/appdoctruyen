import { Metadata } from 'next';
import HomeClient from './HomeClient';
import { Suspense } from 'react';
import Loading from './loading';

export const metadata: Metadata = {
  title: "mimi - Trang Chủ | Đọc Truyện Online Miễn Phí",
  description: "Trang chủ mimi - Tổng hợp truyện tranh Manga, Manhwa, Manhua mới nhất, hay nhất được cập nhật liên tục mỗi ngày.",
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
