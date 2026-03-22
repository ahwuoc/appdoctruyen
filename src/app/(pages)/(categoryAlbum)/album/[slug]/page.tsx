import { Metadata, ResolvingMetadata } from 'next';
import AlbumClient from './AlbumClient';
import { apiProduct } from '@/app/api/apiRequest/apiProduct';
import { getNumberSlug } from '@/app/utils/common/utils';
import { siteConfig } from '@/config/site';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const id = getNumberSlug(slug);

  if (!id) {
    return {
      title: 'Không tìm thấy truyện',
    };
  }

  try {
    const response = await apiProduct.getAlbumId(id);
    const album = response.payload;

    if (!album) {
      return {
        title: 'Không tìm thấy truyện',
      };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `${album.title} - ${siteConfig.name}`,
      description: album.content || `Đọc truyện ${album.title} online miễn phí tại ${siteConfig.name}. Cập nhật chapter mới nhất liên tục mỗi ngày.`,
      openGraph: {
        title: `${album.title} - ${siteConfig.name}`,
        description: album.content || `Đọc truyện ${album.title} online miễn phí tại ${siteConfig.name}.`,
        images: [album.image_url, ...previousImages],
        url: `${siteConfig.url}/album/${slug}`,
      },
      alternates: {
        canonical: `/album/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Lỗi tải dữ liệu truyện',
    };
  }
}

export default async function Page({ params }: Props) {
  return <AlbumClient params={params} />;
}
