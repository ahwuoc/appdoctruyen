"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CiWifiOn,
  CiBoxList,
  CiCalendar,
  CiRead
} from "react-icons/ci";
import { AiOutlineClockCircle, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaEye, FaPlay } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

import { AlbumType } from "@/app/utils/types/type";
import { timeAgo, createSlug, getNumberSlug } from "@/app/utils/common/utils";
import { supabase } from "@/lib/supabase/supabaseClient";
import { apiProduct } from "../../../../api/apiRequest/apiProduct";
import { Button } from '../../../../../components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = {
  params: Promise<{ slug: string; }>;
};

import { siteConfig } from "@/config/site";

export default function AlbumClient({ params }: PageProps) {
  const { slug } = React.use(params);
  const [albumData, setAlbumData] = React.useState<AlbumType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [followerCount, setFollowerCount] = React.useState(0);
  const [followLoading, setFollowLoading] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchAlbums = async () => {
      const id = getNumberSlug(slug);
      if (!id) {
        setError("Dữ liệu không hợp lệ!");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await apiProduct.getAlbumId(id);
        if (response.payload) {
          setAlbumData(response.payload);
        } else {
          setError("Không tìm thấy bộ truyện này!");
        }
      } catch (err) {
        setError("Lỗi kết nối máy chủ!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, [slug]);

  // Fetch follow data
  React.useEffect(() => {
    const fetchFollowData = async () => {
      const albumId = getNumberSlug(slug);
      if (!albumId) return;

      // Get follower count
      const { count } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("album_id", albumId);
      setFollowerCount(count ?? 0);

      // Check if current user is following
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data } = await supabase
          .from("followers")
          .select("id")
          .eq("album_id", albumId)
          .eq("user_id", user.id)
          .maybeSingle();
        setIsFollowing(!!data);
      }
    };
    fetchFollowData();
  }, [slug]);

  const handleFollow = async () => {
    const albumId = getNumberSlug(slug);
    if (!albumId) return;

    if (!currentUserId) {
      router.push("/login");
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from("followers")
          .delete()
          .eq("album_id", albumId)
          .eq("user_id", currentUserId);
        setIsFollowing(false);
        setFollowerCount((prev) => Math.max(0, prev - 1));
      } else {
        // Follow
        await supabase
          .from("followers")
          .insert({ album_id: albumId, user_id: currentUserId });
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleChapter = (chapter_name: string, chapter_id: number) => {
    const formattedSlug = typeof slug === 'string' ? slug : '';
    router.push(`/album/${formattedSlug}/${createSlug(chapter_name)}-${chapter_id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-1/3 aspect-[2/3] rounded-2xl bg-white/5" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4 bg-white/5" />
            <Skeleton className="h-6 w-1/2 bg-white/5" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 bg-white/5" />
              <Skeleton className="h-6 w-20 bg-white/5" />
            </div>
            <Skeleton className="h-32 w-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !albumData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl text-center">
          <h2 className="text-2xl font-bold mb-4">{error ?? "Có lỗi xảy ra"}</h2>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  const totalViews = albumData.chapters?.reduce((acc, curr) => acc + (curr.view ?? 0), 0) ?? 0;

  return (
    <div className="min-h-screen bg-[#0C1121] text-white pb-20">
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={albumData.image_url}
            alt={albumData.title}
            fill
            className="object-cover blur-2xl opacity-20 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C1121] via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 h-full relative z-10 flex items-end pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end w-full">
            {/* Poster */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative w-48 h-72 md:w-64 md:h-96 flex-shrink-0 shadow-2xl rounded-2xl overflow-hidden border-2 border-white/10"
            >
              <Image
                src={albumData.image_url}
                alt={albumData.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-blue-600/90 backdrop-blur-md border-none px-3 py-1">
                  HOT
                </Badge>
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                  {albumData.title}
                </h1>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                  {albumData.categories?.map((cat) => (
                    <Badge key={cat.id} variant="secondary" className="bg-white/5 hover:bg-white/10 border-white/5 text-gray-300">
                      {cat.title}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <AiOutlineClockCircle className="text-purple-400 text-xl" />
                    <span>{timeAgo(albumData.updated_at || albumData.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <FaEye className="text-cyan-400" />
                    <span>{totalViews.toLocaleString()} lượt xem</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    {isFollowing ? <AiFillHeart className="text-pink-500 text-xl" /> : <AiOutlineHeart className="text-pink-400 text-xl" />}
                    <span>{followerCount.toLocaleString()} theo dõi</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 font-bold gap-2 shadow-lg shadow-blue-500/20"
                    onClick={() => {
                      if (albumData.chapters?.[0]) {
                        handleChapter(albumData.chapters[0].title, albumData.chapters[0].id);
                      }
                    }}
                  >
                    <FaPlay className="text-xs" /> Đọc từ đầu
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`rounded-xl px-8 font-bold gap-2 transition-all ${isFollowing ? "border-pink-500/50 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                    onClick={handleFollow}
                    disabled={followLoading}
                  >
                    {isFollowing ? <AiFillHeart className="text-lg text-pink-500" /> : <AiOutlineHeart className="text-lg" />}
                    {followLoading ? "Đang xử lý..." : isFollowing ? "Đang theo dõi" : "Theo dõi"}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full" />
                Nội dung tóm tắt
              </h3>
              <div className="relative">
                <p className={`text-gray-400 leading-relaxed text-lg transition-all duration-300 ${!isExpanded && (albumData.content?.length || 0) > 300 ? "line-clamp-4" : ""}`}>
                  {albumData.content || "Chưa có mô tả chi tiết cho bộ truyện này."}
                </p>
                {!isExpanded && (albumData.content?.length || 0) > 300 && (
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0C1121] to-transparent pointer-events-none" />
                )}
              </div>
              {(albumData.content?.length || 0) > 300 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-500 hover:text-blue-400 font-bold text-sm uppercase tracking-widest mt-2 flex items-center gap-2"
                >
                  {isExpanded ? "Thu gọn" : "Xem thêm"}
                </button>
              )}
            </section>

            {/* Chapters List */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded-full" />
                  Danh sách chương
                </h3>
                <span className="text-sm text-gray-500">{albumData.chapters?.length || 0} chương</span>
              </div>

              <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-sm">
                <div className="grid grid-cols-4 px-6 py-4 bg-white/5 text-gray-400 text-sm font-bold border-b border-white/5">
                  <div className="col-span-2">Chương</div>
                  <div className="text-center">Lượt xem</div>
                  <div className="text-right">Ngày cập nhật</div>
                </div>
                <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {albumData.chapters && albumData.chapters.length > 0 ? (
                    albumData.chapters.map((chapter) => (
                      <motion.div
                        key={chapter.id}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                        onClick={() => handleChapter(chapter.title, chapter.id)}
                        className="grid grid-cols-4 px-6 py-5 cursor-pointer transition-colors items-center"
                      >
                        <div key={chapter.id} className="col-span-2">
                          <span className="font-bold text-blue-400">Chapter {chapter.order_sort}</span>
                          <p className="text-gray-400 text-sm mt-1 truncate">{chapter.title}</p>
                        </div>
                        <div className="text-center text-gray-400 text-sm flex items-center justify-center gap-1">
                          <MdOutlineRemoveRedEye className="text-gray-500" />
                          {chapter.view?.toLocaleString() || 0}
                        </div>
                        <div className="text-right text-gray-500 text-xs">
                          {timeAgo(chapter.created_at ?? "")}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-gray-500 italic">
                      Dữ liệu chương chưa được cập nhật...
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-3xl border border-white/10 space-y-4">
              <h4 className="font-bold text-gray-200">Thông tin khác</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tác giả</span>
                  <span className="text-gray-300">Đang cập nhật</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nhà phát hành</span>
                  <span className="text-gray-300">{siteConfig.name} Team</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Độ tuổi</span>
                  <Badge variant="outline" className="text-[10px] border-orange-500/50 text-orange-400 py-0">16+</Badge>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <h4 className="font-bold mb-4">Gợi ý dành cho bạn</h4>
              <p className="text-sm text-gray-500">Đang cập nhật tính năng gợi ý...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
