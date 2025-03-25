import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import orderReducer from './slices/orderSlice';
import transactionReducer from './slices/transactionSlice';


type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};  

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store: any = configureStore({
  reducer: {
    auth: persistedReducer,
    customer: customerReducer,
    order: orderReducer,
    transaction: transactionReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type { RootState, AppDispatch };