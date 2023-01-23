import { createSlice } from '@reduxjs/toolkit';

export const transSlice = createSlice({
    name: 'transInfo',
    initialState: {
        transInfo: null,
    },
    reducers: {
        selectTrans: (state, action) => {
            state.transInfo = action.payload;
            // console.log(action.payload,"paylooad")
        },
    },
});
 
export const { selectTrans } = transSlice.actions;

export default transSlice.reducer;