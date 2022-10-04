import { configureStore } from '@reduxjs/toolkit';
import userReduer from './reducers/UserSlice';
import buyerReducer from './reducers/BuyerSlice';
import authReducer from './reducers/authSlice';
import userInfoReducer from './reducers/UserInfoSlice';
export default configureStore({
    reducer:{
        user: userReduer,
        buyerInfo:buyerReducer,
        auth: authReducer,
        userInfo: userInfoReducer
    }
})