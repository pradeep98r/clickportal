import { createSlice } from '@reduxjs/toolkit';

export const multiBillStepsSlice = createSlice({
    name: 'multiStepsInfo',
    initialState: {
        multiStepsVal: null,
        multiSelectPartyType:'',
        multiSelectPartners:[],
        multiBillSelectDate: new Date(),
        transportersData:[],
        selectedTransporter:[],
        selectedDates:[]
        
    },
    reducers: {
        multiStepsVal: (state, action) => {
            state.multiStepsVal = action.payload;
        },
        multiSelectPartyType: (state, action) => {
            state.multiSelectPartyType = action.payload;
        },
        multiSelectPartners: (state, action) => {
            state.multiSelectPartners = action.payload;
        },
        multiBillSelectDate:(state, action) =>{
            state.multiBillSelectDate = action.payload;
        },
        transportersData:(state, action) =>{
            state.transportersData = action.payload;
        },
        selectedTransporter:(state, action) =>{
            state.selectedTransporter = action.payload
        },
        selectedDates:(state, action) =>{
            state.selectedDates = action.payload;
        }
    },
});
 
export const { multiStepsVal,multiSelectPartyType,multiSelectPartners, multiBillSelectDate, transportersData,
selectedTransporter, selectedDates} = multiBillStepsSlice.actions;

export default multiBillStepsSlice.reducer;