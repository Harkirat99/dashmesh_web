import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import orderReducer from './slices/orderSlice';
import transactionReducer from './slices/transactionSlice';
import dashboardSlice from './slices/dashboardSlice';
import seasonSlice from './slices/seasonSlice';
import supplierSlice from './slices/supplierSlice';
import stockSlice from './slices/stockSlice';
import productSlice from './slices/productSlice';
import expenseSlice from './slices/expenseSlice';

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
    transaction: transactionReducer,
    dashboard: dashboardSlice,
    season: seasonSlice,
    supplier: supplierSlice,
    stock: stockSlice,
    product: productSlice,
    expense: expenseSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type { RootState, AppDispatch };