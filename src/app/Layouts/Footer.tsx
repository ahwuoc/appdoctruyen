import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
const Footer = () => {
    const tags: string[] = ["Truyện tranh","doctruyen3q","Manhua","baotangtruyen","Manhwa","blogTruyen","truyengihot","goctruyentranh" , "Truyện Tranh Online", "Đọc truyện tranh", "Truyện Tranh Hot"];
    return (
        <div className='w-full h-screen text-white  bg-customBg min-h-50'>
            <div className="container  mx-auto p-4 w-[80%] flex">
                <div className="flex-1 gap-4 flex flex-col">
                <Image
                            src="https://cmangag.com/assets/img/brand/cmanga/logo-white.png"
                            width={150}
                            height={150}
                            alt="logo"
                        />
                  <span>Luôn cập nhật liên tục các bộ truyện mới, truyện VIP để phục vụ độc giả</span>      
                  <span>Đọc truyện hoàn toàn miễn phí, hỗ trợ đa thiết bị.</span>
                  <span>Email khiếu nại: cmangadotcom@gmail.com</span>
                  <span>Giới thiệuLiên hệChính sách</span>
                  <span>Copyright © 2020 CMANGA</span>
                </div>
                <div className="flex-1 gap-y-2 flex flex-col">
                    <div className="footer_tag flex gap-2 flex-wrap">
                    {tags.map((tag,index)=>{
                        return (
                            <Button className='border-2  border-customBg2 bg-inherit' key={index}>
                               {tag}
                            </Button>
                        )
                    })}
                    </div>
                    <span>
                    Mọi thông tin và hình ảnh trên website đều được sưu tầm trên Internet. Chúng tôi không sở hữu hay chịu trách nhiệm bất kỳ thông tin nào trên web này. Nếu làm ảnh hưởng đến cá nhân hay tổ chức nào, khi được yêu cầu, chúng tôi sẽ xem xét và gỡ bỏ ngay lập tức.
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Footer;
