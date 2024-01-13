import { createSlice } from "@reduxjs/toolkit";

export const advanceSlice = createSlice({
  name: "advanceInfo",
  initialState: {
    advanceDataInfo: [],
    allAdvancesData: [],
    totalAdvancesVal: 0,
    selectedAdvanceId: 0,
    advanceSummaryById: [],
    totalAdvancesValById: 0,
    selectedPartyByAdvanceId: {},
    fromAdvanceFeature: false,
    fromAdvanceSummary: false,
    dateFormat: null,
    allpartnerDataByTypes: [],
    fromParentSelect: false,
    partyOutstandingBal: 0,
    partyOutstandingAdv: 0,
    selectPartnerOption: null,
    totalCollectedById: 0,
    totalGivenById: 0,
    fromTransportoRecord: false,
    fromAdvanceBillId: false,
  },
  reducers: {
    advanceDataInfo: (state, action) => {
      state.advanceDataInfo = action.payload;
    },
    allAdvancesData: (state, action) => {
      state.allAdvancesData = action.payload;
    },
    totalAdvancesVal: (state, action) => {
      state.totalAdvancesVal = action.payload;
    },
    selectedAdvanceId: (state, action) => {
      state.selectedAdvanceId = action.payload;
    },
    advanceSummaryById: (state, action) => {
      state.advanceSummaryById = action.payload;
    },
    totalAdvancesValById: (state, action) => {
      state.totalAdvancesValById = action.payload;
    },
    selectedPartyByAdvanceId: (state, action) => {
      state.selectedPartyByAdvanceId = action.payload;
    },
    fromAdvanceFeature: (state, action) => {
      state.fromAdvanceFeature = action.payload;
    },
    fromAdvanceSummary: (state, action) => {
      state.fromAdvanceSummary = action.payload;
    },
    dateFormat: (state, action) => {
      state.dateFormat = action.payload;
    },
    allpartnerDataByTypes: (state, action) => {
      state.allpartnerDataByTypes = action.payload;
    },
    fromParentSelect: (state, action) => {
      state.fromParentSelect = action.payload;
    },
    partyOutstandingBal: (state, action) => {
      state.partyOutstandingBal = action.payload;
    },
    partyOutstandingAdv: (state, action) => {
      state.partyOutstandingAdv = action.payload;
    },
    selectPartnerOption: (state, action) => {
      state.selectPartnerOption = action.payload;
    },
    totalCollectedById: (state, action) => {
      state.totalCollectedById = action.payload;
    },
    totalGivenById: (state, action) => {
      state.totalGivenById = action.payload;
    },
    fromTransportoRecord: (state, action) => {
      state.fromTransportoRecord = action.payload;
    },
    fromAdvanceBillId: (state, action) => {
      state.fromAdvanceBillId = action.payload;
    },
  },
});

export const {
  advanceDataInfo,
  allAdvancesData,
  totalAdvancesVal,
  selectedAdvanceId,
  advanceSummaryById,
  totalAdvancesValById,
  selectedPartyByAdvanceId,
  fromAdvanceFeature,
  fromAdvanceSummary,
  dateFormat,
  allpartnerDataByTypes,
  fromParentSelect,
  partyOutstandingBal,
  selectPartnerOption,
  totalGivenById,
  totalCollectedById,
  fromTransportoRecord,
  fromAdvanceBillId,
  partyOutstandingAdv,
} = advanceSlice.actions;

export default advanceSlice.reducer;
