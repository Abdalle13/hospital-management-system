import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchPatients = createAsyncThunk('patients/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/patients', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch patients');
  }
});

export const fetchPatient = createAsyncThunk('patients/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/patients/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch patient');
  }
});

export const createPatient = createAsyncThunk('patients/create', async (patientData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/patients', patientData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create patient');
  }
});

export const updatePatient = createAsyncThunk('patients/update', async ({ id, ...patientData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/patients/${id}`, patientData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update patient');
  }
});

export const deletePatient = createAsyncThunk('patients/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/patients/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete patient');
  }
});

const patientSlice = createSlice({
  name: 'patients',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPatients.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchPatients.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchPatient.pending, (state) => { state.loading = true; })
      .addCase(fetchPatient.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchPatient.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createPatient.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.current?._id === action.payload._id) state.current = action.payload;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearCurrent, clearError } = patientSlice.actions;
export default patientSlice.reducer;
