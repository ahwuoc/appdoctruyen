import {createSlice} from "@reduxjs/toolkit";


interface  initialStateType{
    currentPage:number;
    totalPages:number;
}
const initialState:initialStateType = {
      currentPage:1,
      totalPages:0,
}
const pageSlice = createSlice({
    name: "page",
    initialState,
    reducers:{
        setCurrentPage:(state,action) =>{
            const newPage = action.payload;
            if(newPage > 0 && newPage <= state.totalPages){
             state.currentPage = action.payload;
            }
        },
        setTotalPages:(state,action) =>{
          state.totalPages = action.payload;
        },
        resetPageState:()=>initialState,

    }
})
export const{setCurrentPage,setTotalPages,resetPageState} = pageSlice.actions;
export default pageSlice.reducer;