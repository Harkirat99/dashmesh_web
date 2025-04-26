import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Slice,
} from "@reduxjs/toolkit";
import api from "../../connection/axios";
import {
  handlePending,
  handleFulfilled,
  handleRejected,
} from "../asyncHandlers";
import { Stock } from "../../types/common";

interface TransactionState {
  data: any | null;
  loading: boolean;
  error: any | null;
}

export const getStocks = createAsyncThunk<any, any, { rejectValue: string }>(
  "stock",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>("stock", { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Request failed"
      );
    }
  }
);

export const createStock = createAsyncThunk<
  any,
  Stock,
  { rejectValue: string }
>("stock/createStock", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<any>("stock", payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Request failed");
  }
});

const initialState: any = {
  data: null,
  loading: false,
  error: null,
  reducer: null,
};

const stockSlice: any = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setData: (state: any, action: PayloadAction<any>) => {
      state.data = action.payload.results;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStocks.pending, handlePending)
      .addCase(getStocks.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload.results;
      })
      .addCase(getStocks.rejected, handleRejected)
      // Create
      .addCase(createStock.pending, handlePending)
      .addCase(createStock.fulfilled, handleFulfilled)
      .addCase(createStock.rejected, handleRejected);
  },
}) as Slice<TransactionState, typeof stockSlice.reducers, "stock"> & {
  reducer: any;
};

export const { setData } = stockSlice.actions;
export default stockSlice.reducer;
