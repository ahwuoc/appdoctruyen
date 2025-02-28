import http from "@/lib/http";
import  type {CategoryType}   from '@/lib/type';


const apiCategories = {
    getCategoriesList: async()=> await http.get<CategoryType[]>(`/api/categories`),
}
export default apiCategories;