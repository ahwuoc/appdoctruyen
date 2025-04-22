import http from "@/app/utils/types/http";
import type { ChapterType } from "@/app/utils/types/type";

const apiChapters = {
    getChapterList: async (chapterId: number) => {
        return await http.get<ChapterType>(`/api/album/chapter?id=${chapterId}`);
    },
}

export default apiChapters;