import { createSlice, createAsyncThunk, PayloadAction, Slice } from '@reduxjs/toolkit';
import api from '../../connection/axios';
import { handlePending, handleFulfilled, handleRejected } from '../asyncHandlers';
import { Season } from "../../types/common"

interface TransactionState {
  data: any | null;
  loading: boolean;
  error: any | null;
}


export const getSeasons = createAsyncThunk<any , any, { rejectValue: string }>(
  'season',
  async (params : any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>('season', {params});
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);

export const getSeasonsDropdown = createAsyncThunk<any , any, { rejectValue: string }>(
    'season/dropdown',
    async (params : any, { rejectWithValue }) => {
      try {
        const response = await api.get<any>('season/dropdown', {params});
        return response.data;  
      } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || 'Request failed');
      }
    }
  );
  

export const createSeason = createAsyncThunk<any , Season, { rejectValue: string }>(
  'customer/createSeason',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<any>('season', payload);
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Request failed');
    }
  }
);


const initialState: any = {
  data: null,
  dropdown: null,
  loading: false,
  error: null,
  reducer: null
};

const seasonSlice: any = createSlice({
  name: 'season',
  initialState,
  reducers: {
    setData: (state: any, action: PayloadAction<any>) => {
      state.data = action.payload.results;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSeasons.pending, handlePending)
      .addCase(getSeasons.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload.results;
      })
      .addCase(getSeasons.rejected, handleRejected)
      // Dropdown
      .addCase(getSeasonsDropdown.pending, handlePending)
      .addCase(getSeasonsDropdown.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.dropdown = action.payload;
      })
      .addCase(getSeasonsDropdown.rejected, handleRejected)
       // Create
      .addCase(createSeason.pending, handlePending)
      .addCase(createSeason.fulfilled, handleFulfilled)
      .addCase(createSeason.rejected, handleRejected)
  },
})as Slice<TransactionState, typeof seasonSlice.reducers, 'season'> & { reducer: any };;

export const { setData } = seasonSlice.actions;
export default seasonSlice.reducer;