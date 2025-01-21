import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CiWifiOn , CiBoxList} from "react-icons/ci";
import { AiOutlineSync } from 'react-icons/ai';
import { FaEye, FaBookmark } from 'react-icons/fa';
import { Input } from "@/components/ui/input"
const Page = () => {
  return (
    <div className='container relative min-w-full  min-h-full '>
        <Image
          src="https://cmangag.com/assets/tmp/album/2220.png?v=1694771644"
          alt="Truyện tranh"
          width={100}
          height={200}
          className='w-full'
        />
        <div className='absolute top-0 left-0 z-200 bg-gray-500 bg-opacity-50 right-0 bottom-0'>
          <div className="z-20 p-4 h-full flex-col gap-y-5 flex text-white container my-5 rounded-sm mx-auto bg-customBg w-[80%]">
            <div className="product__header gap-5 flex">
              <div className='flex-1/3'>
                <Image
                  src="https://cmangag.com/assets/tmp/album/2220.png?v=1694771644"
                  alt="Truyện tranh"
                  width={200}
                  height={300}
                  className='rounded-sm w-full h-full'
                />
              </div>
              <div className='flex-2/3 flex gap-y-5 flex-col'>
                <h1>Tôi Không Cố Ý Quyến Rũ Nam Chính Đâu!</h1>
                <div className='tag_list flex gap-x-5'>
                  <Button>Action</Button>
                  <Button>Fantasy</Button>
                  <Button>Harem</Button>
                  <Button>Mature</Button>
                </div>
                <div className="content_product flex gap-y-2 flex-col">
                  <div className='content_product state flex'>
                    <div className='flex items-center gap-2'>
                      <CiWifiOn />
                      <span>Tình trạng</span>
                    </div>
                    <div className='ml-10'>Đang tiến hành</div>
                  </div>
                  <div className='content_product state flex'>
                    <div className='flex items-center gap-2'>
                      <AiOutlineSync />
                      <span>Cập nhật</span>
                    </div>
                    <div className='ml-10'>3 ngày trước</div>
                  </div>
                  <div className='content_product state flex'>
                    <div className='flex items-center gap-2'>
                      <FaEye />
                      <span>Lượt xem</span>
                    </div>
                    <div className='ml-10'>1000+</div>
                  </div>
                  <div className='content_product state flex'>
                    <div className='flex items-center gap-2'>
                      <FaBookmark />
                      <span>Theo dõi</span>
                    </div>
                    <div className='ml-10'>1000+</div>
                  </div>
                </div>
                <div className="list_button_action flex gap-4">
                  <Button>Đọc từ đầu</Button>
                  <Button>Theo dõi</Button>
                  <Button>Báo lỗi</Button>
                  <Button>Share</Button>
                </div>
              </div>
            </div>
            <div className="product__content gap-5">
              <div>Giới thiệu</div>
              <span>Đang cập nhật</span>
              <p>Tôi Không Cố Ý Quyến Rũ Nam Chính Đâu! được cập nhật nhanh nhất và đầy đủ nhất tại Cmanga. Bạn đọc đừng quên để lại bình luận và chia sẻ, ủng hộ Cmanga ra các chương mới nhất của truyện Tôi Không Cố Ý Quyến Rũ Nam Chính Đâu! nhé.</p>
            </div>
            <div className='product_list_chapter'>
              <div className="product_header flex justify-between">
                <h2 className='flex items-center gap-x-2'><CiBoxList size={40} />
                <span className='font-bold text-lg'>Danh sách chương</span></h2>
                <div className='flex'>
                <Input type="text" id="email" placeholder="Nhập chapter" />
                <Button>Mở</Button>
                </div>
              </div>
              <div className="product_list_chapter_bottom container mt-5">
                <div className="container_list_chapter border-2 overflow-y-auto h-20 flex-col border-customBg2 rounded-sm p-2 flex w-[90%] mx-auto">
                  <div className="chapter flex border-2 p-2 rounded-sm border-customBg2 justify-between container">
                    <span>Chapter 10: Chapter 10</span>
                    <span>26-09-2024</span>
                    <span>Action</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
export default Page;
