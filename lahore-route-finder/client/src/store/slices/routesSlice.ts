import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE } from '../../config.ts';

const API = `${API_BASE}/api/routes`;

export interface Route {
  _id: string;
  name: string;
  stops: string[];
  distance?: number;
  duration?: number;
}

interface RoutesState {
  items: Route[];
  loading: boolean;
  error: string | null;
}

const initialState: RoutesState = { items: [], loading: false, error: null };

export const fetchRoutes = createAsyncThunk('routes/fetchAll', async () => {
  const res = await fetch(API);
  return (await res.json()) as Route[];
});

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.pending,   (s) => { s.loading = true; })
      .addCase(fetchRoutes.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchRoutes.rejected,  (s, a) => { s.loading = false; s.error = a.error.message ?? null; });
  },
});

export default routesSlice.reducer;
