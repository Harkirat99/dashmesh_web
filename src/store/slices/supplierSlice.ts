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
import { Supplier } from "../../types/common";

interface TransactionState {
  data: any | null;
  loading: boolean;
  error: any | null;
}

export const getSuppliers = createAsyncThunk<any, any, { rejectValue: string }>(
  "supplier",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>("supplier", { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Request failed"
      );
    }
  }
);

export const getSupplierDetail = createAsyncThunk<
  any,
  String,
  { rejectValue: string }
>("supplier/getSupplierDetail", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<any>(`supplier/${id}`, {});
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Request failed");
  }
});

export const createSupplier = createAsyncThunk<
  any,
  Supplier,
  { rejectValue: string }
>("supplier/createSupplier", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post<any>("supplier", payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Request failed");
  }
});

const initialState: any = {
  data: null,
  detail: null,
  loading: false,
  error: null,
  reducer: null,
};

const supplierSlice: any = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    setData: (state: any, action: PayloadAction<any>) => {
      state.data = action.payload.results;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSuppliers.pending, handlePending)
      .addCase(getSuppliers.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload.results;
      })
      .addCase(getSuppliers.rejected, handleRejected)
      // Create
      .addCase(createSupplier.pending, handlePending)
      .addCase(createSupplier.fulfilled, handleFulfilled)
      .addCase(createSupplier.rejected, handleRejected)
      // Customer Detail
      .addCase(getSupplierDetail.pending, handlePending)
      .addCase(getSupplierDetail.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.detail = action.payload;
      })
      .addCase(getSupplierDetail.rejected, handleRejected);
  },
}) as Slice<TransactionState, typeof supplierSlice.reducers, "supplier"> & {
  reducer: any;
};

export const { setData } = supplierSlice.actions;
export default supplierSlice.reducer;
