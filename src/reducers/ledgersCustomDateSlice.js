import { createSlice } from "@reduxjs/toolkit";

export const ledgersCustomDateSlice = createSlice({
    name:'dates',
    initialState:{
        dates:new Date(),
        closeDate:new Date(),
        dateInRP:new Date(),
        allBillIds:[]
    },
    reducers:{
        dates:(state, action) =>{
            state.dates = action.payload;
        },
        closeDate:(state, action) =>{
            state.closeDate = action.payload;
        },
        dateInRP:(state, action) =>{
            state.dateInRP = action.payload;
        },
        allBillIds:(state, action) =>{
            state.allBillIds = action.payload;
        }
    }

})

export const {dates, closeDate, dateInRP, allBillIds} = ledgersCustomDateSlice.actions;
export default ledgersCustomDateSlice.reducer;