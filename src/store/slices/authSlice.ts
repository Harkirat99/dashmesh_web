// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../connection/axios';
import { handlePending, handleFulfilled, handleRejected } from '../asyncHandlers';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: any | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: any;
  tokens: {
    access: {
      token: string,
    },
    refresh: {
      token: string,
    }
  };
  refreshToken: string;
}

export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('auth/login', credentials);
      const { access, refresh } = response.data.tokens;
      localStorage.setItem('accessToken', access.token);
      localStorage.setItem('refreshToken', refresh.token);
      return response.data;  
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Login failed');
    }
  }
);

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        handleFulfilled(state);
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.access.token;;
        state.refreshToken = action.payload.tokens.refresh.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, handleRejected)
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
