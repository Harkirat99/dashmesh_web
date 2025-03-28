import { createSlice, createAsyncThunk, PayloadAction, Slice } from '@reduxjs/toolkit';
import api from '../../connection/axios';
import { handlePending, handleFulfilled, handleRejected } from '../asyncHandlers';
import { Transaction } from "../../types/common"

interface TransactionState {
  data: any | null;
  loading: boolean;
  error: any | null;
}


export const getTransactions = createAsyncThunk<any , any, { rejectValue: string }>(
  'transaction',
  async (params : any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>('transaction', {params});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);


export const getGlobalTransactions = createAsyncThunk<any , any, { rejectValue: string }>(
  'order/getGlobalTransactions',
  async (params : any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>('transaction/global', {params});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);


export const createTransaction = createAsyncThunk<any , Transaction, { rejectValue: string }>(
  'customer/createTransaction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<any>('transaction', payload);
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

const transactionSlice: any = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setData: (state: any, action: PayloadAction<any>) => {
      state.data = action.payload.results;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, handlePending)
      .addCase(getTransactions.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload.results;
      })
      .addCase(getTransactions.rejected, handleRejected)
      // Global transactions
      .addCase(getGlobalTransactions.pending, handlePending)
      .addCase(getGlobalTransactions.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload;
      })
      .addCase(getGlobalTransactions.rejected, handleRejected)
       // Transaction Create
      .addCase(createTransaction.pending, handlePending)
      .addCase(createTransaction.fulfilled, handleFulfilled)
      .addCase(createTransaction.rejected, handleRejected)
  },
})as Slice<TransactionState, typeof transactionSlice.reducers, 'transaction'> & { reducer: any };;

export const { setData } = transactionSlice.actions;
export default transactionSlice.reducer;