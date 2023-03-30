import { createSlice } from "@reduxjs/toolkit";

export const partnerSlice = createSlice({
  name: "partnerInfo",
  initialState: {
    partnerDataInfo: [],
    partnerType:'FARMER',
    isEditPartner:false,
    partnerSingleObj:null,
    isFromTrader:false,
    radioButtonVal:'FARMER',
    fromTranspoFeature:false
  },
  reducers: {
    partnerDataInfo: (state, action) => {
      state.partnerDataInfo = action.payload;
    },
    partnerType: (state, action) => {
        state.partnerType = action.payload;
      },
      isEditPartner: (state, action) => {
        state.isEditPartner = action.payload;
      },
      partnerSingleObj: (state, action) => {
        state.partnerSingleObj = action.payload;
      },
      isFromTrader: (state, action) => {
        state.isFromTrader = action.payload;
      }, 
      radioButtonVal: (state, action) => {
        state.radioButtonVal = action.payload;
      }, 
      fromTranspoFeature: (state, action) => {
        state.fromTranspoFeature = action.payload;
      }, 
  },
});

export const { partnerDataInfo,partnerType,isEditPartner,partnerSingleObj,fromTranspoFeature,isFromTrader,radioButtonVal} = partnerSlice.actions;

export default partnerSlice.reducer;
