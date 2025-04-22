import { configureStore } from "@reduxjs/toolkit";
import productReducer from "@/lib/redux/product.redux";
import pageReducer from "@/lib/redux/page.redux";
import categoryRedux from "@/lib/redux/category.redux";
export const store = configureStore({
  reducer: {
    products: productReducer,
    page: pageReducer,
    categories: categoryRedux,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
