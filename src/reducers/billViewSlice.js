import { createSlice } from '@reduxjs/toolkit';

export const billViewSlice = createSlice({
    name: 'billViewInfo',
    initialState: {
        billViewInfo: null,
        colorthemeValue:'',
        pdfSelectedThemeData:null
    },
    reducers: {
        billViewInfo: (state, action) => {
            state.billViewInfo = action.payload;
        },
        colorthemeValue: (state, action) => {
            state.colorthemeValue = action.payload;
        },
        pdfSelectedThemeData: (state, action) => {
            state.pdfSelectedThemeData = action.payload;
        },
    },
});
 
export const { billViewInfo,colorthemeValue,pdfSelectedThemeData } = billViewSlice.actions;

export default billViewSlice.reducer;