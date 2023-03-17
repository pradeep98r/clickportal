import { createSlice } from "@reduxjs/toolkit";

export const ledgerSummarySlice = createSlice({
  name: "ledgerSummaryInfo",
  initialState: {
    ledgerSummaryInfo: [],
    fromRecordPayment:false,
    allLedgers:[],
    detaildLedgerInfo:[],
    allBuyBillsData:[],
    allSellBillsData:[]
  },
  reducers: {
    ledgerSummaryInfo:(state,action) =>{
        state.ledgerSummaryInfo = action.payload;
    }, 
    fromRecordPayment:(state, action) =>{
      state.fromRecordPayment = action.payload;
    },
    allLedgers:(state,action)=>{
      state.allLedgers = action.payload;
    },
    detaildLedgerInfo:(state, action)=>{
      state.detaildLedgerInfo = action.payload;
    },
    partnerTabs:(state, action)=>{
      state.partnerTabs = action.payload;
    },
    allCustomTabs:(state, action)=>{
      state.allCustomTabs = action.payload;
    } ,
    beginDate: (state, action)=>{
      state.beginDate = action.payload
    },
    closeDate: (state, action)=>{
      state.closeDate = action.payload
    },
    allBuyBillsData: (state, action)=>{
      state.allBuyBillsData = action.payload
    },
    allSellBillsData: (state, action)=>{
      state.allSellBillsData = action.payload
    },
  },
});

export const {
  ledgerSummaryInfo,
  fromRecordPayment,
  allLedgers,
  detaildLedgerInfo,partnerTabs,allCustomTabs,beginDate,closeDate,allBuyBillsData,allSellBillsData} = ledgerSummarySlice.actions;

export default ledgerSummarySlice.reducer;