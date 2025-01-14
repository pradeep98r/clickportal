import { createSlice } from "@reduxjs/toolkit";

export const transpoSlice = createSlice({
  name: "transpoInfo",
  initialState: {
    transpoLedgersInfo: [],
    singleTransporterObject : null,
    transporterIdVal : 0,
    outstandingAmount:null,
    paymentSummaryInfo:[],
    paymentTotals:null,
    inventoryTotals:null,
    inventorySummaryInfo:[],
    outstandingBalForParty:0,
    inventoryUnitDetails:[],
    allPartnersInfo:[],
    singleTransporter:null,
    fromTransporter:false,
    fromInv:false,
    outstandingAmountInv:[],
    transpoTabs:null,
    transporterMainTab:null
  },
  reducers: {
    transpoLedgersInfo: (state, action) => {
      state.transpoLedgersInfo = action.payload;
    },
    singleTransporterObject: (state, action) => {
        state.singleTransporterObject = action.payload;
      },
      transporterIdVal: (state, action) => {
        state.transporterIdVal = action.payload;
      },
      outstandingAmount: (state, action) => {
        state.outstandingAmount = action.payload;
      },
      paymentSummaryInfo: (state, action) => {
        state.paymentSummaryInfo = action.payload;
      },
      paymentTotals: (state, action) => {
        state.paymentTotals = action.payload;
      },
      inventoryTotals: (state, action) => {
        state.inventoryTotals = action.payload;
      },
      inventorySummaryInfo: (state, action) => {
        state.inventorySummaryInfo = action.payload;
      },
      outstandingBalForParty: (state, action) => {
        state.outstandingBalForParty = action.payload;
      },
      inventoryUnitDetails: (state, action) => {
        state.inventoryUnitDetails = action.payload;
      },
      allPartnersInfo: (state, action) => {
        state.allPartnersInfo = action.payload;
      },
      singleTransporter: (state, action) => {
        state.singleTransporter = action.payload;
      },
      fromTransporter: (state, action) => {
        state.fromTransporter = action.payload;
      },
      fromInv: (state, action) => {
        state.fromInv = action.payload;
      },
      outstandingAmountInv: (state, action) => {
        state.outstandingAmountInv = action.payload;
      },
      transpoTabs:(state, action) =>{
        state.transpoTabs = action.payload
      },
      transporterMainTab:(state,action) =>{
        state.transporterMainTab = action.payload;
      }
  },
});

export const { transpoLedgersInfo,singleTransporterObject,transporterIdVal,outstandingAmount,paymentSummaryInfo,paymentTotals,inventoryTotals,inventorySummaryInfo,outstandingBalForParty,inventoryUnitDetails,allPartnersInfo,singleTransporter,fromTransporter,fromInv,outstandingAmountInv,transpoTabs, transporterMainTab } = transpoSlice.actions;

export default transpoSlice.reducer;
