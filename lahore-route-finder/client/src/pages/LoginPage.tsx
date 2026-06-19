import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks.ts';
import { login, clearError } from '../store/slices/authSlice.ts';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const res = await dispatch(login({ email, password }));
    if (login.fulfilled.match(res)) {
      navigate('/admin'); // Redirect to admin dashboard on success
    }
  };

  return (
    <main className="search-page">
      <form className="search-card" onSubmit={handleSubmit} noValidate>
        <header className="search-card-header">
          <h1>Admin Login</h1>
          <p>Sign in to manage locations, stops, and routes</p>
        </header>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="search-submit" style={{ marginTop: '1.5rem' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login →'}
        </button>
      </form>
    </main>
  );
}
