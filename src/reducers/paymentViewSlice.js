import { createSlice } from "@reduxjs/toolkit";

export const paymentViewSlice = createSlice({
  name: "paymentViewInfo",
  initialState: {
    paymentViewInfo: null,
  },
  reducers: {
    paymentViewInfo: (state, action) => {
      state.paymentViewInfo = action.payload;
    },
  },
});

export const { paymentViewInfo } = paymentViewSlice.actions;

export default paymentViewSlice.reducer;
