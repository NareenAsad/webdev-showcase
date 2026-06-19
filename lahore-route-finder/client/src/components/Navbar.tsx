import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks.ts';
import { logout } from '../store/slices/authSlice.ts';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  );

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <NavLink to="/" className="navbar-brand">
        <span className="brand-dot-red">Lahore</span>
        &nbsp;
        <span className="brand-dot-orange">Route</span>
        &nbsp;Finder
      </NavLink>

      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center' }}>
        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
          Home
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Search
        </NavLink>
        {user ? (
          <>
            {user.role === 'admin' ? (
              <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                Admin
              </NavLink>
            ) : (
              <button
                id="logout-btn"
                className="nav-link"
                style={{ background: 'none', border: 'none' }}
                onClick={() => dispatch(logout())}
              >
                Logout ({user.username})
              </button>
            )}
          </>
        ) : (
          <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Login
          </NavLink>
        )}

        {/* Theme toggle button */}
        <button
          className="toggle-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
