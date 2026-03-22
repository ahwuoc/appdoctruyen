"use client";

import React, { useEffect } from 'react';
import { AlbumType } from '@/app/utils/types/type';
import CardAlbum from './CardAlbum';

export default function AlbumsList({ albums, column = 2 }: { albums: AlbumType[]; column?: number; }) {
  const [col, setCol] = React.useState(0);

  useEffect(() => {
    const updateColumn = () => {
      if (window.innerWidth <= 436) {
        setCol(1);
      } else {
        setCol(column);
      }
    };
    updateColumn();
    window.addEventListener("resize", updateColumn);
    return () => window.removeEventListener("resize", updateColumn);
  }, [column]);

  const cardWidth = `calc(100% / ${col} - 8px)`;

  return (
    <div className="flex items-stretch flex-wrap gap-2">
      {albums.map((item, index) => (
        <CardAlbum
          key={item.id || index}
          album={item}
          style={{ width: cardWidth }}
        />
      ))}
    </div>
  );
}
