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

interface TransactionState {
  data: any | null;
  loading: boolean;
  error: any | null;
}

export const getProducts = createAsyncThunk<any, any, { rejectValue: string }>(
  "product",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await api.get<any>("product", { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Request failed"
      );
    }
  }
);

export const getProductsDropdown = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("season/dropdown", async (params: any, { rejectWithValue }) => {
  try {
    const response = await api.get<any>("product/dropdown", { params });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || "Request failed");
  }
});

const initialState: any = {
  data: null,
  loading: false,
  dropdown: false,
  error: null,
  reducer: null,
};

const productSlice: any = createSlice({
  name: "product",
  initialState,
  reducers: {
    setData: (state: any, action: PayloadAction<any>) => {
      state.data = action.payload.results;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, handlePending)
      .addCase(getProducts.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.data = action.payload.results;
      })
      .addCase(getProducts.rejected, handleRejected)
      // Dropdown
      .addCase(getProductsDropdown.pending, handlePending)
      .addCase(getProductsDropdown.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.dropdown = action.payload;
      })
      .addCase(getProductsDropdown.rejected, handleRejected);
  },
}) as Slice<TransactionState, typeof productSlice.reducers, "product"> & {
  reducer: any;
};

export const { setData } = productSlice.actions;
export default productSlice.reducer;
