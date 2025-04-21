import { AlbumType } from "@/utils/types/type";
import { createSlice } from "@reduxjs/toolkit";
interface initialStateType {
  products: AlbumType[];
}
const initialState: initialStateType = {
  products: [],
};
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});
export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
