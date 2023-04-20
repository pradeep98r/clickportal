import { createSlice } from "@reduxjs/toolkit";

export const multiBillStepsSlice = createSlice({
  name: "multiStepsInfo",
  initialState: {
    multiStepsVal: null,
    multiSelectPartyType: "",
    multiSelectPartners: [],
    cropInfoByLineItem: [{'index':'0'}],
  },
  reducers: {
    multiStepsVal: (state, action) => {
      state.multiStepsVal = action.payload;
    },
    multiSelectPartyType: (state, action) => {
      state.multiSelectPartyType = action.payload;
    },
    multiSelectPartners: (state, action) => {
      state.multiSelectPartners = action.payload;
    },
    cropInfoByLineItem: (state, action) => {
      state.cropInfoByLineItem = action.payload;
    },
  },
});

export const {
  multiStepsVal,
  multiSelectPartyType,
  multiSelectPartners,
  cropInfoByLineItem,
} = multiBillStepsSlice.actions;

export default multiBillStepsSlice.reducer;
