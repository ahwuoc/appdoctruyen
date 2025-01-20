"use client";
import React, { useEffect, useState } from "react";
import { useProducts } from "../Provider/ProductContext";
import { productsData } from "@/data";
import { Button } from "@/components/ui/button";

const ListTagComponents: React.FC = () => {
  const tags: string[] = ["Mới", "Hot", "Vip", "Độc quyền", "Ngôn tình"];
  const [activeTag, setActiveTag] = useState<string>(tags[0]);
  const { setProducts } = useProducts();

  useEffect(() => {
    if (activeTag === tags[0]) {
      setProducts(productsData); 
    }
    if (activeTag === tags[1]) {
      setProducts(productsData.filter(product => product.view > 50));
    }
  }, [activeTag, setProducts]); 

  const handleClick = (tag: string) => {
    setActiveTag(tag);
  };

  return (
    <div className="flex flex-nowrap justify-between gap-4">
      {tags.map((tag, index) => (
        <Button
          key={index}
          onClick={() => handleClick(tag)}
          className={`p-4 hover:bg-customBg2 flex items-center justify-center flex-1 rounded-lg text-center cursor-pointer ${
            activeTag === tag ? "bg-customBg2" : ""
          }`}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};
export default ListTagComponents;
