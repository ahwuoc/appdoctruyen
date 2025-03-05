import React from 'react';
import apiChapters from '@/app/apiRequest/apiChapters';
import { getNumberSlug } from "@/lib/utils";
import RenderChapter from './render-chapter';
interface Props
{
  params: Promise<{ chapter: string; }>;
}
interface DataResponse
{
  product_id: number;
  product_name: string,
}
export async function generateMetadata({ params }: Props)
{
  try {
    const chapter = (await params).chapter;
    const chapterId = getNumberSlug(chapter);
    const response = await apiChapters.getChapterList(chapterId as number);
    const data = response;
    return {
      title: data.payload.name,
    };
  } 
  catch(e){
       console.log(e)
  }
}
export default async function Page({
  params,
}: {
  params: Promise<{ chapter: string; }>;
})
{
  const chapter = (await params).chapter;
  const chapterId = getNumberSlug(chapter) as number;

  return <RenderChapter chapterId={chapterId} />;
}

