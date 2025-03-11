"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getNumberSlug } from "@/lib/utils";
import Image from "next/image";
import CommentComponents from "@/app/components/CommentComponents";
import Loading from "../../../../../loading";

export default function Page({ params }: { params: Promise<{ chapter: string; }>; })
{
  const [images, setImages] = useState<{ image_url: string; }[]>([]);
  const [loading, setLoading] = useState(true);

  const resolvedParams = React.use(params);
  const chapterId = getNumberSlug(resolvedParams.chapter) as number;

  useEffect(() =>
  {
    const fetchChapters = async () =>
    {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("chapter_images")
          .select("image_url")
          .eq("chapter_id", chapterId)
          .order("order_sort", { ascending: true });

        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error("Error fetching chapter images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [chapterId]);

  return (
    <div className="min-h-screen bg-customBg w-full flex flex-col">
      <div className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-3xl px-2 sm:px-4 lg:px-0">
          {loading ? (
            <Loading />
          ) : images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="w-full relative">
                <Image
                  src={image.image_url}
                  alt={`Page ${index + 1}`}
                  layout="intrinsic"
                  width={1600}
                  height={2400}
                  className="rounded-sm shadow-md object-contain w-full"
                  priority={index < 3}
                />

              </div>
            ))
          ) : (
            <p className="text-white text-center py-8 text-lg">
              Chapter hiện tại chưa cập nhật
            </p>
          )}
        </div>
      </div>
      <div className="w-full max-w-3xl mx-auto mt-6 px-2 sm:px-4 lg:px-0">
        <CommentComponents params={{
          chapter_id: chapterId,
        }} />
      </div>
    </div>
  );
}
