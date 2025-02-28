import http from "@/lib/http";
import type { ChapterType } from "@/lib/type";

const apiChapters ={
    getChapterList: async (chapterId: number) => {
        return await http.get<ChapterType>(`/api/album/chapter?id=${chapterId}`);
    },
}

export default apiChapters;