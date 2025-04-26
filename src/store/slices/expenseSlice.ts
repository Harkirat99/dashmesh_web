import { createSlice, createAsyncThunk, PayloadAction, Slice } from '@reduxjs/toolkit';
import api from '../../connection/axios';
import { handlePending, handleFulfilled, handleRejected } from '../asyncHandlers';
import { Expense } from "../../types/common"

interface TransactionState {
  data: any | null;
  loading: boolean;
  error: any | null;
}


export const getExpenses = createAsyncThunk<any , any, { rejectValue: string }>(
  'expense',
  async (params : any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>('expense', {params});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);


export const getExpenseLedger = createAsyncThunk<any , any, { rejectValue: string }>(
  'expense/ledger',
  async (params : any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>('expense/ledger', {params});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);


export const createExpense = createAsyncThunk<any , Expense, { rejectValue: string }>(
  'customer/createExpense',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<any>('expense', payload);
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

const expenseSlice: any = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setData: (state: any, action: PayloadAction<any>) => {
      state.data = action.payload.results;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.pending, handlePending)
      .addCase(getExpenses.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload.results;
      })
      .addCase(getExpenses.rejected, handleRejected)
      // Ledger
      .addCase(getExpenseLedger.pending, handlePending)
      .addCase(getExpenseLedger.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload;
      })
      .addCase(getExpenseLedger.rejected, handleRejected)
       // Create
      .addCase(createExpense.pending, handlePending)
      .addCase(createExpense.fulfilled, handleFulfilled)
      .addCase(createExpense.rejected, handleRejected)
  },
})as Slice<TransactionState, typeof expenseSlice.reducers, 'expense'> & { reducer: any };;

export const { setData } = expenseSlice.actions;
export default expenseSlice.reducer;