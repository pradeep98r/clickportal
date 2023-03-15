import { createSlice } from '@reduxjs/toolkit';

export const transSlice = createSlice({
    name: 'transInfo',
    initialState: {
        transInfo: null,
    },
    reducers: {
        selectTrans: (state, action) => {
            state.transInfo = action.payload;
        },
    },
});
 
export const { selectTrans } = transSlice.actions;

export default transSlice.reducer;