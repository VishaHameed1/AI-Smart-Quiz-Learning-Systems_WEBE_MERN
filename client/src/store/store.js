import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import progressReducer from './progressSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    progress: progressReducer,
    ui: uiReducer,
  },
});

export default store;