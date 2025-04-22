"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import apiCategories from "@/app/apiRequest/apiCategories";
import { setCategories } from '../../lib/redux/category.redux';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/utils/common/store';
import { apiProduct } from "@/app/apiRequest/apiProduct";
import { setProducts } from "@/lib/redux/product.redux";
import { setTotalPages } from '../../lib/redux/page.redux';
type DropdownProps = {
  isOpen: boolean;
  closeDropdown: () => void;
  children: React.ReactNode;
};

const DropdownContent = React.memo(function DropdownContent({ isOpen, closeDropdown, children }: DropdownProps) {
  if (!isOpen) return null;
  return (
    <div
      onMouseLeave={closeDropdown}
      className="dropdown-menu  z-10 flex flex-wrap p-2 left-0 top-20 rounded-lg absolute w-full overflow-y-auto max-h-96  lg:min-h-52 bg-customBg"
    >
      {children}
    </div>
  );
});

type categoriesType = {
  name: string;
  id: number;
  value: string;
};

export default function ListCategories() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [categoriesList, setCategoriesList] = useState<categoriesType[]>([]);
  const dispatch = useDispatch();
  const selectItems = useSelector((state: RootState) => state.categories.slug_category);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiCategories.getCategoriesList();
      setCategoriesList(response.payload);
    };
    fetchCategories();
  }, []);

  const Categories: Categories = {
    sapXep: ["Thời gian đăng", "Từ Z đến A", "Lượt theo dõi"],
    chapter: ["20 chapter", "40 chapter", "60 chapter", "80 chapter", "100 chapter"],
  };

  const fetchData = async (item: string) => {
    const response = await apiProduct.getProductOptions({
      slug_category: item,
      limit: 20,
    });
    dispatch(setProducts(response?.data));
    dispatch(setTotalPages(response?.last_page))

  };

  const toggleSelectItem = (item: string) => {
    dispatch(setCategories(item));
    closeDropdown();
    fetchData(item);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  return (
    <div className="flex p-5 rounded-lg bg-customBg w-full relative  justify-start lg:gap-5 items-center">
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
        <Button
          onClick={() => toggleSelectItem("tat-ca")}
          className="lg:w-1/5 w-1/2   bg-inherit hover:bg-customBg2 rounded-sm flex-wrap gap-2 py-1 px-2 cursor-pointer"
        >
          {selectItems.includes("tat-ca") && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
          Tất cả
        </Button>
        {categoriesList.map(item => (
          <Button
            key={item.id}
            onClick={() => toggleSelectItem(item.value)}
            className="lg:w-1/5 w-1/2  bg-inherit hover:bg-customBg2 rounded-sm flex-wrap gap-2 py-1 px-2 cursor-pointer"
          >
            {selectItems.includes(item.value) && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            )}
            {item.name}
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
            className="bg-inherit w-1/5 hover:bg-customBg2 rounded-sm flex-wrap gap-2 py-1 px-2 cursor-pointer"
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
            className="bg-inherit w-1/5 hover:bg-customBg2 rounded-sm flex-wrap cursor-pointer"
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
};

