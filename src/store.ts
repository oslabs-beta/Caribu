import { configureStore } from '@reduxjs/toolkit';
import viewsReducer from './slices/viewsSlice';

// create a redux store
export const store = configureStore({
  reducer: {
    views: viewsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;