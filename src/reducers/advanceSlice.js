import { createSlice } from "@reduxjs/toolkit";

export const advanceSlice = createSlice({
  name: "advanceInfo",
  initialState: {
    advanceDataInfo: [],
    allAdvancesData: [],
    totalAdvancesVal: 0,
  },
  reducers: {
    advanceDataInfo: (state, action) => {
      state.advanceDataInfo = action.payload;
    },
    allAdvancesData: (state, action) => {
      state.allAdvancesData = action.payload;
    },
    totalAdvancesVal: (state, action) => {
      state.totalAdvancesVal = action.payload;
    },
  },
});

export const { advanceDataInfo, allAdvancesData, totalAdvancesVal } =
  advanceSlice.actions;

export default advanceSlice.reducer;
