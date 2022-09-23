import { configureStore } from '@reduxjs/toolkit';
import userReduer from './reducers/userSlice';
import buyerReducer from './reducers/buyerSlice';
export default configureStore({
    reducer:{
        user: userReduer,
        buyerInfo:buyerReducer
    }
})