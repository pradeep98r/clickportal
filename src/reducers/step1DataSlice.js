import { createSlice } from '@reduxjs/toolkit';

export const step1DataSlice = createSlice({
    name: 'step1DataInfo',
    initialState: {
        selectedBuyerSellerData: {},
        cropTableEditStatus:false,
        billEditStatus:false,
        selectedBilldate:null,
        selectedPartyType:'buyer'
    },
    reducers: {
        selectedData: (state, action) => {
            state.selectedBuyerSellerData = action.payload;
        },
        tableEditStatus: (state, action) => {
            state.cropTableEditStatus = action.payload;
        },
        editStatus: (state, action) => {
            state.billEditStatus = action.payload;
        },
        selectedBillDate: (state, action) => {
            state.selectedBilldate = action.payload;
        },
        selectedParty: (state, action) => {
            state.selectedPartyType = action.payload;
        },
    },
});
 
export const { selectedData, tableEditStatus,editStatus,selectedBillDate,selectedParty} = step1DataSlice.actions;

export default step1DataSlice.reducer;