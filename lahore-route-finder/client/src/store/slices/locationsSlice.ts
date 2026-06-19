import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = 'http://localhost:5000/api/locations';

export interface Location {
  _id: string;
  name: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
}

interface LocationsState {
  items: Location[];
  suggestions: Location[];
  loading: boolean;
  error: string | null;
}

const initialState: LocationsState = {
  items:       [],
  suggestions: [],
  loading:     false,
  error:       null,
};

export const fetchLocations = createAsyncThunk('locations/fetchAll', async () => {
  const res = await fetch(API);
  return (await res.json()) as Location[];
});

export const searchLocations = createAsyncThunk(
  'locations/search',
  async (query: string) => {
    const res = await fetch(`${API}?search=${encodeURIComponent(query)}`);
    const data = await res.json();
    // If backend returns all and doesn't filter, we filter client-side
    if (Array.isArray(data)) {
      return data.filter((l: Location) =>
        l.name.toLowerCase().includes(query.toLowerCase())
      ) as Location[];
    }
    return [] as Location[];
  }
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    clearSuggestions(state) { state.suggestions = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending,    (s) => { s.loading = true; })
      .addCase(fetchLocations.fulfilled,  (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchLocations.rejected,   (s, a) => { s.loading = false; s.error = a.error.message ?? null; })
      .addCase(searchLocations.fulfilled, (s, a) => { s.suggestions = a.payload; });
  },
});

export const { clearSuggestions } = locationsSlice.actions;
export default locationsSlice.reducer;
