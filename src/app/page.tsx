"use client";
import LayoutIndex from "./components/Layout";
import React, { useEffect } from "react";
import { setProducts } from "@/app/redux/product.redux";
import { setCurrentPage, setTotalPages } from "@/app/redux/page.redux";
import { apiProduct } from "@/app/apiRequest/apiProduct";
import { useDispatch } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();
  const limit = 15;
  useEffect(() => {
    const fetchDataProduct = async () => {
      try {
        const response = await apiProduct.getLimitProduct(limit);
        // dispatch(setProducts(response?.payload?.data));
        // dispatch(setProducts(albums));
        dispatch(setTotalPages(response?.payload.per_page))
        dispatch(setCurrentPage(response?.payload.current_page))
      } catch (e) {
        console.log(e);
      }
    };

    fetchDataProduct();
  }, [dispatch, limit]);
  return (
    <LayoutIndex />
  );
};
export default Page;