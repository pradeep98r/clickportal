import { createSlice } from "@reduxjs/toolkit";

export const reportsSlice = createSlice({
  name: "reportsInfo",
  initialState: {
    dailySelectDate: new Date(),
    dailySummaryData:null
  },
  reducers: {
    dailySelectDate: (state, action) => {
      state.dailySelectDate = action.payload;
    },
    dailySummaryData: (state, action) => {
        state.dailySummaryData = action.payload;
      },
  },
});

export const { dailySelectDate,dailySummaryData } = reportsSlice.actions;

export default reportsSlice.reducer;
