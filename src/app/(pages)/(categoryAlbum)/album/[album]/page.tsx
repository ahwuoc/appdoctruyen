import { getNumberSlug } from "@/lib/utils";
import { notFound } from "next/navigation";
import { apiProduct } from "@/app/apiRequest/apiProduct";
import AlbumRender from "./render-album";
interface Props{
  params: Promise<{ album: string }>;  
}
export const generateMetadata = async ({ params }: Props) => {
  try{
    const album = (await params).album;
    const ProductId = getNumberSlug(album);
    const response = await apiProduct.getProductById(ProductId as number);
    if (!response) return notFound();
    return {
      title: `${response.name}`,
      description: `${response.description}`,
    }
  }catch{
    return notFound();
  }
}
export default async function Page({ params }: Props) {
  let productId: number | null = null; 
  try {
    const album = (await params).album;
    productId = getNumberSlug(album);
    if (productId === null) return notFound();
  } catch (error) {
    console.log(error);
    return notFound();
  }
  return (
    <AlbumRender productId={productId} />
  );
}