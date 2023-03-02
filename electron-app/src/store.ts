import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import viewsReducer from './slices/viewsSlice';

// create a redux store
export const store = configureStore({
  reducer: {
    views: viewsReducer,
  },
});

// Infer the `RootState` `AppDispatch` and `AppThunk` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;