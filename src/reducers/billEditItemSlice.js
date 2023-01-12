import { createSlice } from "@reduxjs/toolkit";

export const billEditItemSlice = createSlice({
  name: "billEditItemInfo",
  initialState: {
    selectedBillInfo: null,
    billEditStatus: false,
    cropTableEditStatus: false,
    selectedBillDate: null,
    fromBillview: false,
    selectedParty:'',
    step2CropEditStatus:false
  },
  reducers: {
    selectBill: (state, action) => {
      state.selectedBillInfo = action.payload;
    },
    editStatus: (state, action) => {
      state.billEditStatus = action.payload;
    },
    tableEditStatus: (state, action) => {
      state.cropTableEditStatus = action.payload;
    },
    billDate: (state, action) => {
      state.selectedBillDate = action.payload;
      console.log(action.payload)
    },
    billViewStatus: (state, action) => {
      state.fromBillview = action.payload;
    },
    selectedParty: (state, action) => {
      state.selectedPartyType = action.payload;
  },
  cropEditStatus: (state, action) => {
    state.step2CropEditStatus = action.payload;
},
  },
});

export const {
  selectBill,
  editStatus,
  tableEditStatus,
  billDate,
  billViewStatus,
  selectedParty,
  cropEditStatus
} = billEditItemSlice.actions;

export default billEditItemSlice.reducer;
