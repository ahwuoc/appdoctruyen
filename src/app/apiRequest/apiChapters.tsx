import http from "@/utils/types/http";
import type { ChapterType } from "@/utils/types/type";

const apiChapters = {
    getChapterList: async (chapterId: number) => {
        return await http.get<ChapterType>(`/api/album/chapter?id=${chapterId}`);
    },
}

export default apiChapters;