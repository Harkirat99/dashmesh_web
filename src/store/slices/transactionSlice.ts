import { createSlice, createAsyncThunk, PayloadAction, Slice } from '@reduxjs/toolkit';
import api from '../../connection/axios';
import { handlePending, handleFulfilled, handleRejected } from '../asyncHandlers';

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
  },
})as Slice<TransactionState, typeof transactionSlice.reducers, 'transaction'> & { reducer: any };;

export const { setData } = transactionSlice.actions;
export default transactionSlice.reducer;