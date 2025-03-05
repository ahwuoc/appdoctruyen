"use client"; // Đảm bảo chạy ở phía client trong Next.js 13+

import { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createSlug } from "../../lib/utils";

// Tạo context
const AlbumContext = createContext<((name: string, id: number) => void) | null>(null);

// Tạo Provider
export const AlbumProvider = ({ children }: { children: ReactNode; }) =>
{
  const router = useRouter();

  const goToAlbumDetails = (name: string, id: number) =>
  {
    const slug_album = createSlug(name);
    router.push(`/album/${slug_album}-${id}`);
  };

  return (
    <AlbumContext.Provider value={goToAlbumDetails}>
      {children}
    </AlbumContext.Provider>
  );
};

export const useAlbum = () =>
{
  const context = useContext(AlbumContext);
  if (!context) {
    throw new Error("useAlbum must be used within an AlbumProvider");
  }
  return context;
};
