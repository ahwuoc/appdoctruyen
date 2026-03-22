import { Metadata, ResolvingMetadata } from 'next';
import ChapterClient from './ChapterClient';
import { supabase } from '@/lib/supabase/supabaseClient';
import { getNumberSlug } from '@/app/utils/common/utils';
import { siteConfig } from '@/config/site';

type Props = {
  params: Promise<{ slug: string; chapter: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, chapter } = await params;
  const albumId = getNumberSlug(slug);
  const chapterId = getNumberSlug(chapter);

  if (!chapterId || !albumId) {
    return { title: 'Không tìm thấy chapter' };
  }

  try {
    const { data: album } = await supabase
      .from("albums")
      .select("title")
      .eq("id", albumId)
      .single();

    const { data: chapterData } = await supabase
      .from("chapters")
      .select("title, order_sort")
      .eq("id", chapterId)
      .single();

    if (!album || !chapterData) {
      return { title: 'Không tìm thấy chapter' };
    }

    const title = `${album.title} - Chapter ${chapterData.order_sort} | ${siteConfig.name}`;
    const description = `Đọc truyện ${album.title} Chapter ${chapterData.order_sort}: ${chapterData.title} online miễn phí tại ${siteConfig.name}.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${siteConfig.url}/album/${slug}/${chapter}`,
      },
      alternates: {
        canonical: `/album/${slug}/${chapter}`,
      },
    };
  } catch (error) {
    return { title: 'Lỗi tải dữ liệu chapter' };
  }
}

export default async function Page({ params }: Props) {
  return <ChapterClient params={params} />;
}
