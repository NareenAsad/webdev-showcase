import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = 'http://localhost:5000/api/route-finder/search';

export interface LegStop {
  stopId: string;
  name:   string;
  location: string | null;
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
}

export interface Leg {
  routeId:   string;
  routeName: string;
  board:  LegStop;
  alight: LegStop;
  stops:  LegStop[];
}

export interface SearchResult {
  origin:      string;
  destination: string;
  algorithm:   string;
  totalStops:  number;
  totalWeight: number | null;
  transfers:   number;
  legs:        Leg[];
  message?:    string;
}

interface SearchState {
  result:  SearchResult | null;
  loading: boolean;
  error:   string | null;
  // Last query params for display
  lastOrigin:      string;
  lastDestination: string;
  lastAlgorithm:   string;
}

const initialState: SearchState = {
  result:          null,
  loading:         false,
  error:           null,
  lastOrigin:      '',
  lastDestination: '',
  lastAlgorithm:   'bfs',
};

interface SearchParams {
  originName:      string;
  destinationName: string;
  algorithm:       'bfs' | 'dijkstra';
}

export const runSearch = createAsyncThunk(
  'search/run',
  async (params: SearchParams, { rejectWithValue }) => {
    const res = await fetch(API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.msg || 'Search failed');
    return data as SearchResult;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch(state) {
      state.result  = null;
      state.error   = null;
    },
    setLastQuery(state, action: { payload: { origin: string; destination: string; algorithm: string } }) {
      state.lastOrigin      = action.payload.origin;
      state.lastDestination = action.payload.destination;
      state.lastAlgorithm   = action.payload.algorithm;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runSearch.pending,    (s) => { s.loading = true; s.error = null; })
      .addCase(runSearch.fulfilled,  (s, a) => { s.loading = false; s.result = a.payload; })
      .addCase(runSearch.rejected,   (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export const { clearSearch, setLastQuery } = searchSlice.actions;
export default searchSlice.reducer;
