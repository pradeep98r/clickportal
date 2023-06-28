import { createSlice } from "@reduxjs/toolkit";

export const reportsSlice = createSlice({
  name: "reportsInfo",
  initialState: {
    dailySelectDate: new Date(),
  },
  reducers: {
    dailySelectDate: (state, action) => {
      state.dailySelectDate = action.payload;
    },
  },
});

export const { dailySelectDate } = reportsSlice.actions;

export default reportsSlice.reducer;
