import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';
import doctorReducer from './slices/doctorSlice';
import appointmentReducer from './slices/appointmentSlice';
import invoiceReducer from './slices/invoiceSlice';
import pharmacyReducer from './slices/pharmacySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    doctors: doctorReducer,
    appointments: appointmentReducer,
    invoices: invoiceReducer,
    pharmacy: pharmacyReducer,
  },
});

export default store;
