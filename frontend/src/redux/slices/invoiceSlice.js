import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchInvoices = createAsyncThunk('invoices/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/invoices', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch invoices');
  }
});

export const fetchInvoice = createAsyncThunk('invoices/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/invoices/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch invoice');
  }
});

export const createInvoice = createAsyncThunk('invoices/create', async (invoiceData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/invoices', invoiceData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create invoice');
  }
});

export const payInvoice = createAsyncThunk('invoices/pay', async ({ id, paymentMethod, paidAmount }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/invoices/${id}/pay`, { paymentMethod, paidAmount });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Payment failed');
  }
});

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchInvoices.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchInvoices.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchInvoice.fulfilled, (state, action) => { state.current = action.payload; })
      .addCase(createInvoice.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(payInvoice.fulfilled, (state, action) => {
        const idx = state.list.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.current?._id === action.payload._id) state.current = action.payload;
      });
  },
});

export const { clearCurrent, clearError } = invoiceSlice.actions;
export default invoiceSlice.reducer;
