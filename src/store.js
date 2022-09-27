import { configureStore } from '@reduxjs/toolkit';
import userReduer from './reducers/UserSlice';
import buyerReducer from './reducers/BuyerSlice';
import authReducer from './reducers/authSlice';
export default configureStore({
    reducer:{
        user: userReduer,
        buyerInfo:buyerReducer,
        auth: authReducer
    }
})