import { createSlice } from "@reduxjs/toolkit";

export const advanceSlice = createSlice({
  name: "advanceInfo",
  initialState: {
    advanceDataInfo: [],
    allAdvancesData: [],
    totalAdvancesVal: 0,
    selectedAdvanceId:0
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
    selectedAdvanceId: (state,action) =>{
        state.selectedAdvanceId = action.payload
    }
  },
});

export const { advanceDataInfo, allAdvancesData, totalAdvancesVal,selectedAdvanceId } =
  advanceSlice.actions;

export default advanceSlice.reducer;
