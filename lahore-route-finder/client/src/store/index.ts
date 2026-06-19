// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import locationsReducer from './slices/locationsSlice.ts';
import stopsReducer from './slices/stopsSlice.ts';
import routesReducer from './slices/routesSlice.ts';
import searchReducer from './slices/searchSlice.ts';

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    locations: locationsReducer,
    stops:     stopsReducer,
    routes:    routesReducer,
    search:    searchReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
