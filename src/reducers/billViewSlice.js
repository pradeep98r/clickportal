import { createSlice } from '@reduxjs/toolkit';

export const billViewSlice = createSlice({
    name: 'billViewInfo',
    initialState: {
        billViewInfo: null,
    },
    reducers: {
        billViewInfo: (state, action) => {
            state.billViewInfo = action.payload;
            console.log(action.payload,"payload")
        },
    },
});
 
export const { billViewInfo } = billViewSlice.actions;

export default billViewSlice.reducer;