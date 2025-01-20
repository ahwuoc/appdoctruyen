"use client";
import React, { createContext, useState, ReactNode } from 'react';
interface Product {
    id: number;
    name: string;
    category: string;
    tag: string;
    image: string;
    view: number;
    follow: number;
    description: string;
    chapter?: Chapter[];
  }
interface ProductContextType {
  products: Product[];
  setProducts:(product: Product[]) => void;
}

interface Chapter {
    chapterNew:string,
    chapterCreate:string,
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  return (
    <ProductContext.Provider value={{ products,setProducts}}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = React.useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
