import { combineReducers, configureStore } from '@reduxjs/toolkit'
import alertSlice from './alertSlice';

const rootReducer = combineReducers({
    alertSlice: alertSlice,
  });

export const store = configureStore({
  reducer: rootReducer
})