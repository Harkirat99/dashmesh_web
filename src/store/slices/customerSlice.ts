import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../connection/axios';
import { handlePending, handleFulfilled, handleRejected } from '../asyncHandlers';
import { Customer } from "../../types/common"

interface CustomerState {
  data: any | null;
  loading: boolean;
  error: any | null;
}

interface SearchParams {
    search?: any;
    status?: any;
}

export const getCustomers = createAsyncThunk<any , SearchParams, { rejectValue: string }>(
  'customer',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get<any>('customer', {params});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Login failed');
    }
  }
);


export const createCustomer = createAsyncThunk<any , Customer, { rejectValue: string }>(
  'customer/createCustomer',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<any>('customer', payload);
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Login failed');
    }
  }
);
const initialState: CustomerState = {
  data: [],
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any>) => {
      state.data = action.payload.results;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, handlePending)
      .addCase(getCustomers.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload.results;
      })
      .addCase(getCustomers.rejected, handleRejected)
      // Customer
      .addCase(createCustomer.pending, handlePending)
      .addCase(createCustomer.fulfilled, handleFulfilled)
      .addCase(createCustomer.rejected, handleRejected)
  },
});

export const { setData } = customerSlice.actions;
export default customerSlice.reducer;
