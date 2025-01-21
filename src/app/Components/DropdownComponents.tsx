"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type DropdownProps = {
  isOpen: boolean;
  closeDropdown: () => void;
  children: React.ReactNode;
}
const DropdownContent = React.memo(function DropdownContent({ isOpen, closeDropdown, children }: DropdownProps) {
  if (!isOpen) return null;
  return (
    <div
      onMouseLeave={closeDropdown}
      className="dropdown-menu z-10 flex flex-wrap p-2 left-0 top-20 rounded-lg absolute w-full min-h-52 bg-customBg"
    >
      {children}
    </div>
  );
})

type Categories = {
  theLoai: string[];
  sapXep: string[];
  chapter: string[];
}

const DropdownComponents = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectItems, setSelectItems] = useState<string[]>([]);

  const Categories: Categories = {
    theLoai: [
      "Chuyển Sinh",
      "Action",
      "Adult",
      "Adventure",
      "Anime",
      "Fantasy",
      "Horror",
      "Romance",
      "Mystery",
      "Sci-Fi",
      "Comedy",
      "Drama",
      "Thriller",
      "Slice of Life",
      "Supernatural",
      "Historical",
      "Mecha",
      "Sports",
      "Music",
      "Superhero"
    ],
    sapXep: ["Thời gian đăng", "Từ Z đến A", "Lượt theo dõi", ""],
    chapter: ["20 chapter", "40 chapter", "60 chapter", "80 chapter", "100 chapter"]
  }

  function toggleSelectItem(item: string) {
    console.log("Value=>", selectItems);
    setSelectItems((prev) => {
      const newItems = [...prev];
      const index = newItems.indexOf(item);
      if (index === -1) {
        newItems.push(item);
      } else {
        newItems.splice(index, 1);
      }
      return newItems;
    });
    closeDropdown();
  }

  function toggleDropdown(name: string) {
    setActiveDropdown((prev) => prev === name ? null : name);
  }

  function closeDropdown() {
    setActiveDropdown(null);
  }

  return (
    <div className="flex p-5 rounded-lg bg-customBg w-full relative justify-start gap-5 items-center">
      <Button onClick={() => toggleDropdown("the-loai")}>
        Thể loại
      </Button>
      <Button onClick={() => toggleDropdown("sap-xep")}>
        Sắp xếp theo
      </Button>
      <Button onClick={() => toggleDropdown("chapter")}>
        Theo Chapter
      </Button>
      <DropdownContent
        isOpen={activeDropdown === "the-loai"}
        closeDropdown={closeDropdown}
      >
        {Categories.theLoai.map(item => (
          <Button
            key={item}
            onClick={() => toggleSelectItem(item)}
            className=" w-1/4 bg-inherit hover:bg-customBg2 rounded-sm flex-wrap gap-2 py-1 px-2 cursor-pointer"
          >
            {selectItems.includes(item) && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            )}
            {item}
          </Button>
        ))}
      </DropdownContent>
      <DropdownContent
        isOpen={activeDropdown === "sap-xep"}
        closeDropdown={closeDropdown}
      >
        {Categories.sapXep.map(item => (
          <Button
            key={item}  
            onClick={() => toggleSelectItem(item)}
            className="bg-inherit  w-1/5 hover:bg-customBg2 rounded-sm flex-wrap gap-2 py-1 px-2 cursor-pointer"
          >
            {selectItems.includes(item) && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            )}
            {item}
          </Button>
        ))}
      </DropdownContent>
      <DropdownContent
        isOpen={activeDropdown === "chapter"}
        closeDropdown={closeDropdown}
      >
        {Categories.chapter.map(item => (
          <Button
            key={item}
            onClick={() => toggleSelectItem(item)}
            className=" bg-inherit w-1/5 hover:bg-customBg2 rounded-sm flex-wrap  cursor-pointer"
          >
            {selectItems.includes(item) && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            )}
            {item}
          </Button>
        ))}
      </DropdownContent>
    </div>
  );
}

export default DropdownComponents;
