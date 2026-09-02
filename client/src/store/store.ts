import { configureStore } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "../slices/auth.slice";
import transactionReducer from "../slices/transaction.slice";
import adminReducer from "../slices/admin.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transaction: transactionReducer,
    admin: adminReducer,
  },
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;