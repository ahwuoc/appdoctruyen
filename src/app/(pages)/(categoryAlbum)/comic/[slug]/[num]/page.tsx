import React from 'react';
interface Comic{
    slug:string,
    num:string,
}   
import http from "@/lib/http";
import type {AlbumType} from "@/lib/type";

export default  function Comic({ params }:{ params: Comic }) {
    const [products,setProducts]  = React.useState<AlbumType[]>([]);
    
    const { slug , num}  = params;
    const pageNumber = parseInt(num,10)
    React.useEffect(() =>{
         const fetchData = async () =>{
            const response = await http.get<AlbumType[]>(`/api/comic/${slug}/${pageNumber}`);
            setProducts(response.payload);
         }
         fetchData();
    },[slug,num]);
    return (
        <>
        {/* chưa cập nhật đợi tí */}
        </>
    );
}
