import { createSlice } from "@reduxjs/toolkit";

export const billViewDisplaySlice = createSlice({
  name: "mandiDatails",
  initialState: {
    mandiDetails: [],
    logoData: {},
    groupOneSettings: [],
    groupTwoSettings: [],
    groupThreeSettings: [],
    groupFourSettings: [],
    allGroupsSettings: [],
    groupOneTotals: 0,
    groupTwoTotals: 0,
    groupThreeTotals: 0,
    groupFourTotals: 0,
    filtereArray: [],
    allSettings: [],
    selectedTotalBillAmount: "",
  },
  reducers: {
    mandiDetails: (state, action) => {
      state.mandiDetails = action.payload;
    },
    logoData: (state, action) => {
      state.logoData = action.payload;
    },
    groupOneSettings: (state, action) => {
      state.groupOneSettings = action.payload;
    },
    groupTwoSettings: (state, action) => {
      state.groupTwoSettings = action.payload;
    },
    groupThreeSettings: (state, action) => {
      state.groupThreeSettings = action.payload;
    },
    groupFourSettings: (state, action) => {
      state.groupFourSettings = action.payload;
    },
    allGroupsSettings: (state, action) => {
      state.allGroupsSettings = action.payload;
    },
    groupOneTotals: (state, action) => {
      state.groupOneTotals = action.payload;
    },
    groupTwoTotals: (state, action) => {
      state.groupTwoTotals = action.payload;
    },
    groupThreeTotals: (state, action) => {
      state.groupThreeTotals = action.payload;
    },
    groupFourTotals: (state, action) => {
      state.groupOneTotals = action.payload;
    },
    filtereArray: (state, action) => {
      state.filtereArray = action.payload;
    },
    allSettings: (state, action) => {
      state.allSettings = action.payload;
    },
    selectedTotalBillAmount: (state, action) => {
      state.selectedTotalBillAmount = action.payload;
    },
  },
});

export const {
  mandiDetails,
  logoData,
  groupOneSettings,
  groupTwoSettings,
  groupThreeSettings,
  groupFourSettings,
  allGroupsSettings,
  groupOneTotals,
  groupTwoTotals,
  groupThreeTotals,
  groupFourTotals,
  filtereArray,
  allSettings,
  selectedTotalBillAmount,
  disableFromLastDays,
  numberOfDays,
} = billViewDisplaySlice.actions;
export default billViewDisplaySlice.reducer;
