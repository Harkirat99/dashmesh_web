import { createSlice, createAsyncThunk, PayloadAction, Slice } from '@reduxjs/toolkit';
import api from '../../connection/axios';
import { handlePending, handleFulfilled, handleRejected } from '../asyncHandlers';
import { Order } from "../../types/common"

interface OrderState {
  data: any | null;
  loading: boolean;
  error: any | null;
}


export const getOrders = createAsyncThunk<any , any, { rejectValue: string }>(
  'order',
  async (params : any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>('order', {params});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);

export const getGlobalOrders = createAsyncThunk<any , any, { rejectValue: string }>(
  'order/getGlobalOrders',
  async (params : any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>('order/global', {params});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);

export const createOrder = createAsyncThunk<any , Order, { rejectValue: string }>(
  'customer/createOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<any>('order', payload);
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

const orderSlice: any = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setData: (state: any, action: PayloadAction<any>) => {
      state.data = action.payload.results;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, handlePending)
      .addCase(getOrders.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload.results;
      })
      .addCase(getOrders.rejected, handleRejected)
      // 
      .addCase(getGlobalOrders.pending, handlePending)
      .addCase(getGlobalOrders.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload;
      })
      .addCase(getGlobalOrders.rejected, handleRejected)
       // Order Create
      .addCase(createOrder.pending, handlePending)
      .addCase(createOrder.fulfilled, handleFulfilled)
      .addCase(createOrder.rejected, handleRejected)
  },
})as Slice<OrderState, typeof orderSlice.reducers, 'order'> & { reducer: any };;

export const { setData } = orderSlice.actions;
export default orderSlice.reducer;