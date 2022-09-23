import { configureStore } from '@reduxjs/toolkit';
import userReduer from './reducers/UserSlice';
import buyerReducer from './reducers/BuyerSlice';
export default configureStore({
    reducer:{
        user: userReduer,
        buyerInfo:buyerReducer
    }
})