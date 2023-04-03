import { createSlice } from "@reduxjs/toolkit";

export const advanceSlice = createSlice({
  name: "advanceInfo",
  initialState: {
    advanceDataInfo: [],
  },
  reducers: {
    advanceDataInfo: (state, action) => {
      state.advanceDataInfo = action.payload;
    },
  },
});

export const { advanceDataInfo } = advanceSlice.actions;

export default advanceSlice.reducer;
