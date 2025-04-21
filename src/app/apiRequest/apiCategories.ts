import http from "@/utils/types/http";
import type { CategoryType } from "@/utils/types/type";

const apiCategories = {
  getCategoriesList: async () =>
    await http.get<CategoryType[]>(`/api/categories`),
};
export default apiCategories;
