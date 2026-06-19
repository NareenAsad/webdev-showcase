import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE } from '../../config.ts';

const API = `${API_BASE}/api/stops`;

export interface Stop {
  _id: string;
  name: string;
  locationId: string | { _id: string; name: string };
  order?: number;
}

interface StopsState {
  items: Stop[];
  loading: boolean;
  error: string | null;
}

const initialState: StopsState = { items: [], loading: false, error: null };

export const fetchStops = createAsyncThunk('stops/fetchAll', async () => {
  const res = await fetch(API);
  return (await res.json()) as Stop[];
});

const stopsSlice = createSlice({
  name: 'stops',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStops.pending,   (s) => { s.loading = true; })
      .addCase(fetchStops.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchStops.rejected,  (s, a) => { s.loading = false; s.error = a.error.message ?? null; });
  },
});

export default stopsSlice.reducer;
