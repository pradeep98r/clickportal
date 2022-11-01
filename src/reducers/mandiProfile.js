import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  isMandiDetails: null,
};

const mandiInfoSlice = createSlice({
  name: 'mandiInfo',
  initialState: initialAuthState,
  reducers: {
    mandiSuccess: (state, action) => {
        state.isMandiDetails = action.payload;
    },
    
  },
});

export const mandiInfoActions = mandiInfoSlice.actions;

export default mandiInfoSlice.reducer;