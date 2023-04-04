import { createSlice } from "@reduxjs/toolkit";

export const advanceSlice = createSlice({
  name: "advanceInfo",
  initialState: {
    advanceDataInfo: [],
    allAdvancesData: [],
    totalAdvancesVal: 0,
    selectedAdvanceId:0,
    advanceSummaryById:[],
    totalAdvancesValById:0,
    selectedPartyByAdvanceId:{},
    fromAdvanceFeature:false
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
    },
    advanceSummaryById: (state,action) =>{
        state.advanceSummaryById = action.payload
    },
    totalAdvancesValById: (state,action) =>{
        state.totalAdvancesValById = action.payload
    },
    selectedPartyByAdvanceId: (state,action) =>{
        state.selectedPartyByAdvanceId = action.payload
    },
    fromAdvanceFeature: (state,action) =>{
        state.fromAdvanceFeature = action.payload
    }
  },
});

export const { advanceDataInfo, allAdvancesData, totalAdvancesVal,selectedAdvanceId,advanceSummaryById,totalAdvancesValById,selectedPartyByAdvanceId,fromAdvanceFeature } =
  advanceSlice.actions;

export default advanceSlice.reducer;
