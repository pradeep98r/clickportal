import { configureStore } from '@reduxjs/toolkit';
import userReduer from '../features/userSlice';
import buyerReducer from '../features/buyerSlice';
export default configureStore({
    reducer:{
        user: userReduer,
        buyerInfo:buyerReducer
    }
})