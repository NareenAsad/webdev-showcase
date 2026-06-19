import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = 'http://localhost:5000/api/auth';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user:  JSON.parse(localStorage.getItem('lrf_user') ?? 'null'),
  token: localStorage.getItem('lrf_token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (creds: { email: string; password: string }, { rejectWithValue }) => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.msg || 'Login failed');
    return data as { token: string; user: User };
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { username: string; email: string; password: string; role?: string }, { rejectWithValue }) => {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.msg || 'Registration failed');
    return data as { token: string; user: User };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('lrf_token');
      localStorage.removeItem('lrf_user');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => { state.loading = true; state.error = null; };
    const handleFulfilled = (state: AuthState, action: { payload: { token: string; user: User } }) => {
      state.loading = false;
      state.token   = action.payload.token;
      state.user    = action.payload.user;
      localStorage.setItem('lrf_token', action.payload.token);
      localStorage.setItem('lrf_user',  JSON.stringify(action.payload.user));
    };
    const handleRejected = (state: AuthState, action: { payload: unknown }) => {
      state.loading = false;
      state.error   = action.payload as string;
    };
    builder
      .addCase(login.pending,     handlePending)
      .addCase(login.fulfilled,   handleFulfilled)
      .addCase(login.rejected,    handleRejected)
      .addCase(register.pending,  handlePending)
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(register.rejected, handleRejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
