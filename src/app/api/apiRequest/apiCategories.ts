import http from "@/app/utils/types/http";
import type { CategoryType } from "@/app/utils/types/type";

const apiCategories = {
  getCategoriesList: async () =>
    await http.get<CategoryType[]>(`/api/categories`),
};
export default apiCategories;
