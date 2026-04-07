import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import systemReducer from './slices/systemSlice';
import alertsReducer from './slices/alertsSlice';
import smsReducer from './slices/smsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    system: systemReducer,
    alerts: alertsReducer,
    sms: smsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
