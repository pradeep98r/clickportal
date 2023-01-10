import { createSlice } from '@reduxjs/toolkit';

export const buyerSlice = createSlice({
    name: 'buyerInfo',
    initialState: {
        buyerInfo: null,
    },
    reducers: {
        selectBuyer: (state, action) => {
            state.buyerInfo = action.payload;
            // console.log(action.payload,"paylooad")
        },
    },
});
 
export const { selectBuyer } = buyerSlice.actions;

export default buyerSlice.reducer;