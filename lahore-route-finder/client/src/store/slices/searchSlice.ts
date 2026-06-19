import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE } from '../../config.ts';

const API = `${API_BASE}/api/route-finder/search`;

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

import { clientFindRoute } from '../../utils/clientRouteFinder.ts';
import type { APIRoute, APIStop } from '../../utils/clientGraphBuilder.ts';

export const runSearch = createAsyncThunk(
  'search/run',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const res = await fetch(API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(params),
      });
      if (!res.ok) {
        const data = await res.json();
        return rejectWithValue(data.msg || 'Search failed');
      }
      return (await res.json()) as SearchResult;
    } catch (error) {
      console.warn("Network error during search API call. Falling back to offline client routing...", error);
      try {
        // Fetch cached routes and stops using GET which is intercepted by service worker
        const [routesRes, stopsRes] = await Promise.all([
          fetch(`${API_BASE}/api/routes`),
          fetch(`${API_BASE}/api/stops`)
        ]);
        
        if (!routesRes.ok || !stopsRes.ok) {
           return rejectWithValue('Offline search failed: Required data is not cached.');
        }

        const allRoutes = await routesRes.json() as APIRoute[];
        const allStops = await stopsRes.json() as APIStop[];

        const result = clientFindRoute(params.originName, params.destinationName, allStops, allRoutes);
        
        if ('error' in result) {
           return rejectWithValue(result.error);
        }
        return result as SearchResult;
      } catch (offlineErr) {
        return rejectWithValue('You are offline and routing data is not cached.');
      }
    }
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
