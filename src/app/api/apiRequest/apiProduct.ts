import http from "@/app/utils/types/http";
import type { AlbumType, PaginatedProducts } from "@/app/utils/types/type";

interface ProductPagenation {
  data: number[];
  last_page: number;
  current_page: number;
}
const apiAlbums = {
  getAlbums: async () => http.get<AlbumType[]>("/api/albums"),

  getAlbumsNew: async () => http.get<AlbumType[]>("/api/albums-new"),

  getAlbumsHot: async () => http.get<AlbumType[]>("/api/albums-hot"),

  getAlbumId: async (id: number) => http.get<AlbumType>(`/api/albums/${id}`),

  getLimitProduct: async (limit: number = 20, page: number = 1) => {
    return await http.get<PaginatedProducts>(
      `/api/products?limit=${limit}&page=${page}`
    );
  },

  getProductOptions: async (filters: Record<string, unknown>) => {
    return await http.post<ProductPagenation>("/api/products/options", { body: filters });
  },

  getProductById: async (id: number) => {
    return await http.get<AlbumType>(`/api/album/?id=${id}`);
  },

  createProduct: async (product: Omit<AlbumType, "id">) => {
    return await http.post<AlbumType>("/api/products", {
      body: product as unknown as Record<string, unknown>,
    });
  },

  updateProduct: async (id: number, product: Partial<AlbumType>) => {
    return await http.put<AlbumType>(`/api/products/${id}`, {
      body: product as unknown as Record<string, unknown>,
    });
  },

  deleteProduct: async (id: number) => {
    return await http.delete<void>(`/api/products/${id}`, {
      body: { id },
    });
  },
};

export { apiAlbums as apiProduct };
