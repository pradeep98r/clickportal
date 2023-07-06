import { createSlice } from "@reduxjs/toolkit";

export const reportsSlice = createSlice({
  name: "reportsInfo",
  initialState: {
    dailySelectDate: new Date(),
    dailySummaryData: null,
    reportType: "",
    grossProfitSummaryData:null
  },
  reducers: {
    dailySelectDate: (state, action) => {
      state.dailySelectDate = action.payload;
    },
    dailySummaryData: (state, action) => {
      state.dailySummaryData = action.payload;
    },
    reportType: (state, action) => {
      state.reportType = action.payload;
    },
    grossProfitSummaryData: (state, action) => {
        state.grossProfitSummaryData = action.payload;
      },
  },
});

export const { dailySelectDate, dailySummaryData, reportType,grossProfitSummaryData } =
  reportsSlice.actions;

export default reportsSlice.reducer;
