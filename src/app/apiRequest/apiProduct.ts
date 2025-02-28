import http from "@/lib/http";
import type { AlbumType, PaginatedProducts } from "@/lib/type";

interface ProductPagenation {
  data: number[];
  last_page: number;
  current_page:number,
}
const apiProduct = {
  getLimitProduct: async (limit: number = 20, page: number = 1) => {
    return await http.get<PaginatedProducts>(`/api/products?limit=${limit}&page=${page}`);
  },

  getProductOptions: async (filters: Record<string, unknown>) => {
    return await http.post<ProductPagenation>('/api/products/options', filters);
  },

  getProductById: async (id: number) => {
    return await http.get<AlbumType>(`/api/album/?id=${id}`);
  },

  createProduct: async (product: Omit<AlbumType, 'id'>)=> {
    return await http.post<AlbumType>("/api/products", {body: JSON.stringify(product)});
  },

  updateProduct: async (id: number, product: Partial<AlbumType>) => {
    return await http.put<AlbumType>(`/api/products/${id}`, {body:JSON.stringify(product)});
  },

  deleteProduct: async (id: number) => {
    return await http.delete<void>(`/api/products/${id}`,{body: JSON.stringify({id})});
  },
};

export { apiProduct };