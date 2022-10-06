import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  isUserDetails: null,
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: initialAuthState,
  reducers: {
    loginSuccess: (state, action) => {
        state.isUserDetails = action.payload;
    },
    logout(state) {
      state.isUserDetails = false;
    },
  },
});

export const userInfoActions = userInfoSlice.actions;

export default userInfoSlice.reducer;