import { configureStore } from '@reduxjs/toolkit';
import userReduer from './reducers/userSlice';
import buyerReducer from './reducers/buyerSlice';
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