import React from 'react';
import apiChapters from '@/app/apiRequest/apiChapters';
import { notFound } from 'next/navigation';
import { getNumberSlug } from "@/lib/utils"
import RenderChapter from './render-chapter';
interface Props {
  params : Promise<{chapter:string}>
}
interface DataResponse {
   product_id : number;
   product_name:string,
}
export async function generateMetadata({ params }: Props) {
  try {
    const chapter = (await params).chapter;
    const chapterId = getNumberSlug(chapter);
    const response = await apiChapters.getChapterList(chapterId as number);
    if (!response) return notFound();
    const data = response as DataResponse;
    return {
      title:data.product_name,
    }  
  } catch {
    return notFound();
  }
}   
export default async function Page({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const chapter  = (await params).chapter;
  const chapterId  = getNumberSlug(chapter) as number;
  if (chapterId == null) return notFound();
  return <RenderChapter chapterId={chapterId} />;
}

