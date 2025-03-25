// src/store/utils/asyncHandlers.ts
import { PayloadAction } from '@reduxjs/toolkit';

interface AsyncState {
  loading: boolean;
  error: string | null;
}

export const handlePending = (state: AsyncState): void => {
  state.loading = true;
  state.error = null;
};

export const handleFulfilled = (state: AsyncState): void => {
  state.loading = false;
};

export const handleRejected = (state: AsyncState, action: PayloadAction<any>): void => {
  state.loading = false;
  state.error = action.payload;
};
