import { createSlice } from "@reduxjs/toolkit";

export const billViewSlice = createSlice({
  name: "billViewInfo",
  initialState: {
    billViewInfo: null,
    colorthemeValue: "",
    pdfSelectedThemeData: null,
    disableFromLastDays: false,
    numberOfDays: 30,
    disableFromLastDaysSell: false,
    numberOfDaysSell: 30,
  },
  reducers: {
    billViewInfo: (state, action) => {
      state.billViewInfo = action.payload;
    },
    colorthemeValue: (state, action) => {
      state.colorthemeValue = action.payload;
    },
    pdfSelectedThemeData: (state, action) => {
      state.pdfSelectedThemeData = action.payload;
    },
    disableFromLastDays: (state, action) => {
      state.disableFromLastDays = action.payload;
    },
    numberOfDays: (state, action) => {
      state.numberOfDays = action.payload;
    },
    disableFromLastDaysSell: (state, action) => {
      state.disableFromLastDaysSell = action.payload;
    },
    numberOfDaysSell: (state, action) => {
      state.numberOfDaysSell = action.payload;
    },
  },
});

export const {
  billViewInfo,
  colorthemeValue,
  pdfSelectedThemeData,
  disableFromLastDays,
  numberOfDays,
  disableFromLastDaysSell,
  numberOfDaysSell,
} = billViewSlice.actions;

export default billViewSlice.reducer;
