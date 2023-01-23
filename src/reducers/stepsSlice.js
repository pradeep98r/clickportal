import { createSlice } from '@reduxjs/toolkit';

export const stepsSlice = createSlice({
    name: 'stepsInfo',
    initialState: {
        stepsInfo: null,
    },
    reducers: {
        selectSteps: (state, action) => {
            state.stepsInfo = action.payload;
            // console.log(action.payload,"paylooad")
        },
    },
});
 
export const { selectSteps } = stepsSlice.actions;

export default stepsSlice.reducer;