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

export const updateProduct = createAsyncThunk<any, { id: string; data: any }, { rejectValue: string }>(
  "product/updateProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, data } = payload;
      const response = await api.put<any>(`product/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Request failed");
    }
  }
);

export const deleteProduct = createAsyncThunk<any, string, { rejectValue: string }>(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete<any>(`product/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Request failed");
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
      // Update Product
      .addCase(updateProduct.pending, handlePending)
      .addCase(updateProduct.fulfilled, handleFulfilled)
      .addCase(updateProduct.rejected, handleRejected)
      // Delete Product
      .addCase(deleteProduct.pending, handlePending)
      .addCase(deleteProduct.fulfilled, handleFulfilled)
      .addCase(deleteProduct.rejected, handleRejected)
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
