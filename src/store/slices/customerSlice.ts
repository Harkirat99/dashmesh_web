import { createSlice, createAsyncThunk, PayloadAction, Slice } from '@reduxjs/toolkit';
import api from '../../connection/axios';
import { handlePending, handleFulfilled, handleRejected } from '../asyncHandlers';
import { Customer } from "../../types/common"

interface CustomerState {
  data: any | null;
  loading: boolean;
  error: any | null;
  reducer: any
}

interface SearchParams {
    search?: any;
    status?: any;
    sortBy?: any;
}

export const getCustomers = createAsyncThunk<any , SearchParams, { rejectValue: string }>(
  'customer',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get<any>('customer', {params});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);

export const getCustomerDetail = createAsyncThunk<any, String, { rejectValue: string }>(
  'customer/getDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<any>(`customer/${id}`, {});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
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
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);
const initialState: any = {
  data: null,
  loading: false,
  error: null,
  reducer: null
};

const customerSlice: any = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setData: (state: any, action: PayloadAction<any>) => {
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
      // Customer Detail
      .addCase(getCustomerDetail.pending, handlePending)
      .addCase(getCustomerDetail.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload;
      })
      .addCase(getCustomerDetail.rejected, handleRejected)
  },
})as Slice<CustomerState, typeof customerSlice.reducers, 'customer'> & { reducer: any };;

export const { setData } = customerSlice.actions;
export default customerSlice.reducer;