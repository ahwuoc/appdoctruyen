import {createSlice} from "@reduxjs/toolkit";

interface initialStateType{
    slug_category:string[];
}
const initialState:initialStateType = {
    slug_category:['tat-ca'],
}
const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers:{
        setCategories:(state,action) =>{
            state.slug_category = action.payload;
        }
    }
})
export const{setCategories} = categorySlice.actions;
export default categorySlice.reducer;