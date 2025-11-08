import { configureStore } from '@reduxjs/toolkit';

import animeReducer from '../features/anime/animeSlice';

export const store = configureStore({
  reducer: {
    anime: animeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

