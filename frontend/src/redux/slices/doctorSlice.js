import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchDoctors = createAsyncThunk('doctors/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/doctors', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctors');
  }
});

export const fetchDoctor = createAsyncThunk('doctors/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/doctors/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch doctor');
  }
});

export const createDoctor = createAsyncThunk('doctors/create', async (doctorData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/doctors', doctorData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create doctor');
  }
});

export const updateDoctor = createAsyncThunk('doctors/update', async ({ id, ...doctorData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/doctors/${id}`, doctorData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update doctor');
  }
});

export const deleteDoctor = createAsyncThunk('doctors/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/doctors/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete doctor');
  }
});

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDoctors.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchDoctors.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchDoctor.pending, (state) => { state.loading = true; })
      .addCase(fetchDoctor.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchDoctor.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createDoctor.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const idx = state.list.findIndex((d) => d._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.current?._id === action.payload._id) state.current = action.payload;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d._id !== action.payload);
      });
  },
});

export const { clearCurrent, clearError } = doctorSlice.actions;
export default doctorSlice.reducer;
