import { createSlice } from '@reduxjs/toolkit';

export const selectedCropsSlice = createSlice({
    name: 'selectedCropsInfo',
    initialState: {
        selectedCropsInfo: [],
    },
    reducers: {
        selectedCrops: (state, action) => {
            // state.selectedCropsInfo = action.payload;

            console.log(action.payload,state,"paylooad crrrops")
           return {
            selectedCropsInfo : [
                ...state.selectedCropsInfo,
                action.payload
            ]
           }
        },
    },
});
 
export const { selectedCrops } = selectedCropsSlice.actions;

export default selectedCropsSlice.reducer;