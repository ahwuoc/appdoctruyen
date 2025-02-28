"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { AlbumType ,ChapterType, CategoryType } from "@/lib/type"; 


interface ProviderContextType {
  products: AlbumType[];
  setProducts: (products: AlbumType[]) => void;
  chapters: ChapterType[];
  setChapters: (chapters: ChapterType[]) => void;
  categories : CategoryType[];
  setCategories:(categories: CategoryType[]) => void;
}

interface ProviderProps {
  children: ReactNode;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export const ProviderTest: React.FC<ProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<AlbumType[]>([]);
  const [chapters, setChapters] = useState<ChapterType[]>([]);
  const [categories,setCategories] = useState<CategoryType[]>([]);

  return (
    <ProviderContext.Provider value={{ categories, setCategories , products, setProducts, chapters, setChapters }}>
      {children}
    </ProviderContext.Provider>
  );
};

export const useProviderContext = (): ProviderContextType => {
  const context = useContext(ProviderContext);

  if (!context) {
    throw new Error("useProviderContext phải được sử dụng bên trong Provider");
  }

  return context;
};
