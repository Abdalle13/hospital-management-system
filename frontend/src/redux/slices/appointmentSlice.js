import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchAppointments = createAsyncThunk('appointments/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/appointments', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch appointments');
  }
});

export const fetchAppointment = createAsyncThunk('appointments/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/appointments/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch appointment');
  }
});

export const createAppointment = createAsyncThunk('appointments/create', async (appointmentData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/appointments', appointmentData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create appointment');
  }
});

export const updateAppointmentStatus = createAsyncThunk('appointments/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/appointments/${id}/status`, { status });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update status');
  }
});

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAppointments.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchAppointments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchAppointment.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(createAppointment.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((a) => a._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export const { clearCurrent, clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
