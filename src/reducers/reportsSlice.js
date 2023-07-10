import { createSlice } from "@reduxjs/toolkit";

export const reportsSlice = createSlice({
  name: "reportsInfo",
  initialState: {
    dailySelectDate: new Date(),
    dailySummaryData: null,
    reportType: "",
    grossProfitSummaryData:null,
    salseSummaryData:[],
    summaryObj:null,
    bySellerBuyerSummary:[],
    selectedReportId:0,
    bySellerBuyerSummaryObj:null,
    selectedReportSeller:null,
    getAllCropsDataArray:[],
    selectedCropIdVal:0,
    selectedCropIdObj:null,
    byCropSummary:[],
    byCropSummaryObj:null,
  },
  reducers: {
    dailySelectDate: (state, action) => {
      state.dailySelectDate = action.payload;
    },
    dailySummaryData: (state, action) => {
      state.dailySummaryData = action.payload;
    },
    reportType: (state, action) => {
      state.reportType = action.payload;
    },
    grossProfitSummaryData: (state, action) => {
        state.grossProfitSummaryData = action.payload;
      },
      salseSummaryData: (state, action) => {
        state.salseSummaryData = action.payload;
      },
      summaryObj: (state, action) => {
        state.summaryObj = action.payload;
      },
      bySellerBuyerSummary: (state, action) => {
        state.bySellerBuyerSummary = action.payload;
      },
      selectedReportId: (state, action) => {
        state.selectedReportId = action.payload;
      },
      bySellerBuyerSummaryObj: (state, action) => {
        state.bySellerBuyerSummaryObj = action.payload;
      },
      selectedReportSeller: (state, action) => {
        state.selectedReportSeller = action.payload;
      },
      getAllCropsDataArray: (state, action) => {
        state.getAllCropsDataArray = action.payload;
      },
      selectedCropIdVal: (state, action) => {
        state.selectedCropIdVal = action.payload;
      },
      selectedCropIdObj: (state, action) => {
        state.selectedCropIdObj = action.payload;
      },
      byCropSummary: (state, action) => {
        state.byCropSummary = action.payload;
      },
      byCropSummaryObj: (state, action) => {
        state.byCropSummaryObj = action.payload;
      },
  },
});

export const { dailySelectDate, dailySummaryData, reportType,grossProfitSummaryData,salseSummaryData,summaryObj,bySellerBuyerSummary,selectedReportId,bySellerBuyerSummaryObj,selectedReportSeller,getAllCropsDataArray,selectedCropIdVal,selectedCropIdObj,byCropSummary,byCropSummaryObj } =
  reportsSlice.actions;

export default reportsSlice.reducer;
