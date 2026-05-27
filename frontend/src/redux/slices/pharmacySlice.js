import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchMedicines = createAsyncThunk('pharmacy/fetch', async ({ search, alert }, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/pharmacy', { params: { search, alert } });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch medicines');
  }
});

export const addMedicine = createAsyncThunk('pharmacy/add', async (medData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/pharmacy', medData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add medicine');
  }
});

export const updateMedicine = createAsyncThunk('pharmacy/update', async ({ id, ...medData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/pharmacy/${id}`, medData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update medicine');
  }
});

export const deleteMedicine = createAsyncThunk('pharmacy/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/pharmacy/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete medicine');
  }
});

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMedicines.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMedicines.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(addMedicine.fulfilled, (state, action) => { state.list.push(action.payload); })
      
      .addCase(updateMedicine.fulfilled, (state, action) => {
        const index = state.list.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.list = state.list.filter((m) => m._id !== action.payload);
      });
  },
});

export default pharmacySlice.reducer;
