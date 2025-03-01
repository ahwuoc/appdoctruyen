import { NextResponse } from 'next/server';
import {supabase} from '@/lib/supabaseClient';


const title = ["Hành trình huyền thoại", "Ký ức mùa đông", "Quy Hoàn Lục Ma Đạo", "Bí mật đại dương", "Hỏa ngục và thiên đường"];
const content = ["Một câu chuyện đầy kịch tính.", "Hành trình tìm lại chính mình.", "Cuộc phiêu lưu đến nơi xa xôi."];

const images = [
    "https://cmangax.com/assets/tmp/album/49059.png?v=1707892564",
    "https://cmangax.com/assets/tmp/album/82486.png?v=1738905865",
    "https://cmangax.com/assets/tmp/album/186.png?v=1694770581",
    "https://cmangax.com/assets/tmp/album/82199.webp?v=1738394315",
    "https://cmangax.com/assets/tmp/album/83154.webp?v=1740106516",
    "https://cmangax.com/assets/tmp/album/82931.webp?v=1739771847",
    "https://cmangax.com/assets/tmp/album/62141.png?v=1729342811",
    "https://cmangax.com/assets/tmp/album/39155.png?v=1700030183"
];

export async function GET() {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          album_categories (
            category_id,
            categories (title)
          ),
          chapters (
            id,
            title
          )
        `);
  
      if (error) {
        return NextResponse.json({ message: `Lỗi: ${error.message}` }, { status: 500 });
      }
  
      return NextResponse.json(data);
    } catch (err:any) {
      return NextResponse.json({ message: `Lỗi bất ngờ: ${err.message}` }, { status: 500 });
    }
  }






export async function POST() {
    const albums = Array.from({ length: 10 }).map(() => ({
        title: title[Math.floor(Math.random() * title.length)], 
        image_url: images[Math.floor(Math.random() * images.length)], 
        content: content[Math.floor(Math.random() * content.length)],
        created_at: new Date().toISOString(),
    }));

    const { data: newAlbums, error: albumError } = await supabase
        .from('albums')
        .insert(albums)
        .select('id'); 
    if (albumError) {
        return NextResponse.json({ message: `Lỗi chèn album: ${albumError.message}` }, { status: 500 });
    }
    const chapters = newAlbums.flatMap((album) =>
        Array.from({ length: 3 }).map((_, index) => ({
            title: `Chương ${index + 1}`,
            order_sort: index + 1,
            content: content[Math.floor(Math.random() * content.length)],
            views: Math.floor(Math.random()*1000),
            album_id: album.id
        }))
    );
    const { error: chapterError } = await supabase
        .from('chapters')
        .insert(chapters);

    if (chapterError) {
        return NextResponse.json({ message: `Lỗi chèn chương: ${chapterError.message}` }, { status: 500 });
    }
    return NextResponse.json({ message: 'Thêm 10 albums và chapters thành công!' }, { status: 200 });
}
