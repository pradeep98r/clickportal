import { createSlice } from "@reduxjs/toolkit";

export const paymentViewSlice = createSlice({
  name: "paymentViewInfo",
  initialState: {
    paymentViewInfo: null,
    billHistoryViewInfo:null
  },
  reducers: {
    paymentViewInfo: (state, action) => {
      state.paymentViewInfo = action.payload;
    },
    billHistoryView: (state, action) => {
      state.billHistoryViewInfo = action.payload;
    },
  },
});

export const { paymentViewInfo,billHistoryView } = paymentViewSlice.actions;

export default paymentViewSlice.reducer;
