import Image from "next/image";
import DropdownComponents from "./Components/DropdownComponents";
import ListTagComponents from "./Components/ListTagComponents";
import ListProductComponents from "./Components/ListProductComponents";
export default function Home() {
  return (
    <div className="main_content min-w-full container bg-cusstomBg3">
      <div className="container pt-5 gap-x-5 justify-evenly flex text-white w-[80%] mx-auto">
        <div className="flex-[8] flex flex-col gap-y-10">
          <Image src="https://cmangag.com/assets/img/pr/tuyennhomdich.jpg" width={500}
            height={500}
            alt="logo"
            className="flex-1  w-full object-cover"
          />
          <div className="album_suggest flex gap-y-10 flex-col ">
            <h1 className="flex items-center p-2 border-l-4 border-customBg2" >
              <svg className="w-10 svg-inline--fa fa-stars" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="stars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M325.8 152.3c1.3 4.6 5.5 7.7 10.2 7.7s8.9-3.1 10.2-7.7L360 104l48.3-13.8c4.6-1.3 7.7-5.5 7.7-10.2s-3.1-8.9-7.7-10.2L360 56 346.2 7.7C344.9 3.1 340.7 0 336 0s-8.9 3.1-10.2 7.7L312 56 263.7 69.8c-4.6 1.3-7.7 5.5-7.7 10.2s3.1 8.9 7.7 10.2L312 104l13.8 48.3zm-112.4 5.1c-8.8-17.9-34.3-17.9-43.1 0l-46.3 94L20.5 266.5C.9 269.3-7 293.5 7.2 307.4l74.9 73.2L64.5 483.9c-3.4 19.6 17.2 34.6 34.8 25.3l92.6-48.8 92.6 48.8c17.6 9.3 38.2-5.7 34.8-25.3L301.6 380.6l74.9-73.2c14.2-13.9 6.4-38.1-13.3-40.9L259.7 251.4l-46.3-94zm215.4 85.8l11 38.6c1 3.6 4.4 6.2 8.2 6.2s7.1-2.5 8.2-6.2l11-38.6 38.6-11c3.6-1 6.2-4.4 6.2-8.2s-2.5-7.1-6.2-8.2l-38.6-11-11-38.6c-1-3.6-4.4-6.2-8.2-6.2s-7.1 2.5-8.2 6.2l-11 38.6-38.6 11c-3.6 1-6.2 4.4-6.2 8.2s2.5 7.1 6.2 8.2l38.6 11z"></path></svg>
              <span>   Gợi ý thông minh</span>
            </h1>
            <span className="p-4 bg-customBg text-white rounded-xl">Hãy đăng nhập và đọc truyện. Hệ thống sẽ dựa trên sở thích để gợi ý các truyện phù hợp với bạn.
            </span>
          </div>
          <div className="filter_album bg justify-start g items-center flex w-full">
            <DropdownComponents/>
          </div>
          <div className="tag_album flex items-center justify-between gap-5">
            <div className="flex-1">
              <ListTagComponents />
            </div>
            <div className="flex-1 flex ">
            </div>
          </div>
          <div className="list-product container w-full">
            <ListProductComponents />
            </div>
           
        </div>
        <div className="flex-[2]">
          Cot 2
        </div>
      </div>
    </div>
  );
}
