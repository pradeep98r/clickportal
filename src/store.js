import { configureStore } from '@reduxjs/toolkit';
import userReduer from './reducers/userSlice';
import buyerReducer from './reducers/buyerSlice';
import authReducer from './reducers/authSlice';
import userInfoReducer from './reducers/userInfoSlice';
import  mandiInfoReducer from './reducers/mandiProfile';
import stepsReducer from './reducers/stepsSlice';
import selectedCropsReducer from './reducers/selectedCropsSlice';
export default configureStore({
    reducer:{
        user: userReduer,
        buyerInfo:buyerReducer,
        auth: authReducer,
        userInfo: userInfoReducer,
        mandiInfo:mandiInfoReducer,
        stepsInfo:stepsReducer,
        selectedCropsInfo:selectedCropsReducer
    }
})