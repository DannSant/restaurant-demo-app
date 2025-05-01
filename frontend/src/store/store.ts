// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import businessDayReducer from "./slices/businessDaySlice";
import ordersReducer from "./slices/ordersSlice";
import orderDetailsReducer from "./slices/orderDetailsSlice";
export const store = configureStore({
  reducer: {
     products: productsReducer,
     orders: ordersReducer,
     orderDetails: orderDetailsReducer,
    businessDay: businessDayReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
