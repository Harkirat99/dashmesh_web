import { createSlice, createAsyncThunk, PayloadAction, Slice } from '@reduxjs/toolkit';
import api from '../../connection/axios';
import { handlePending, handleFulfilled, handleRejected } from '../asyncHandlers';

interface DashboardState {
  data: any | null;
  loading: boolean;
  error: any | null;
  stats?: any | null,
}


export const getStats = createAsyncThunk<any , any, { rejectValue: string }>(
  'dashboard/getStats',
  async (params : any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>('dashboard/stats', {params});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);

export const getOrdersChart = createAsyncThunk<any , any, { rejectValue: string }>(
  'dashboard/getOrdersChart',
  async (params : any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>('dashboard/orders', {params});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);

const initialState: any = {
  data: null,
  stats: null,
  ordersAreaChart: null,
  loading: false,
  error: null,
  reducer: null
};

const dashboardSlice: any = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setData: (state: any, action: PayloadAction<any>) => {
      state.data = action.payload.results;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStats.pending, handlePending)
      .addCase(getStats.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.stats = action.payload;
       })
      .addCase(getStats.rejected, handleRejected)
       // Orders Area Chart
      .addCase(getOrdersChart.pending, handlePending)
      .addCase(getOrdersChart.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.ordersAreaChart = action.payload;
       })
      .addCase(getOrdersChart.rejected, handleRejected)
   
  },
})as Slice<DashboardState, typeof dashboardSlice.reducers, 'dashboard'> & { reducer: any };;

export const { setData } = dashboardSlice.actions;
export default dashboardSlice.reducer;