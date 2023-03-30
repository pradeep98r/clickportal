import { createSlice } from "@reduxjs/toolkit";

export const transpoSlice = createSlice({
  name: "transpoInfo",
  initialState: {
    transpoLedgersInfo: [],
    singleTransporterObject : {},
    transporterIdVal : 0,
    outstandingAmount:{},
    paymentSummaryInfo:[],
    paymentTotals:{},
    inventoryTotals:{},
    inventorySummaryInfo:[],
    outstandingBalForParty:0,
    inventoryUnitDetails:[],
    allPartnersInfo:[],
    singleTransporter:{},
    fromTransporter:false,
    fromInv:false,
    outstandingAmountInv:[],
    transpoTabs:null,
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
      }
  },
});

export const { transpoLedgersInfo,singleTransporterObject,transporterIdVal,outstandingAmount,paymentSummaryInfo,paymentTotals,inventoryTotals,inventorySummaryInfo,outstandingBalForParty,inventoryUnitDetails,allPartnersInfo,singleTransporter,fromTransporter,fromInv,outstandingAmountInv,transpoTabs } = transpoSlice.actions;

export default transpoSlice.reducer;
