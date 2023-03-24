import { createSlice } from "@reduxjs/toolkit";

export const ledgersCustomDateSlice = createSlice({
    name:'dates',
    initialState:{
        dates:new Date(),
        closeDate:new Date(),
        dateInRP:new Date(),
        allBillIdsObjects:[]
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
        allBillIdsObjects:(state, action) =>{
            state.allBillIdsObjects = action.payload;
        }
    }

})

export const {dates, closeDate, dateInRP, allBillIdsObjects} = ledgersCustomDateSlice.actions;
export default ledgersCustomDateSlice.reducer;