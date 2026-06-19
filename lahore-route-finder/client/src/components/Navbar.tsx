import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks.ts';
import { logout } from '../store/slices/authSlice.ts';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <NavLink to="/" className="navbar-brand">
        <span className="brand-dot-red">Lahore</span>
        &nbsp;
        <span className="brand-dot-orange">Route</span>
        &nbsp;Finder
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/"       className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
          Home
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Search
        </NavLink>
        {user ? (
          <button
            id="logout-btn"
            className="nav-link"
            style={{ background: 'none', border: 'none' }}
            onClick={() => dispatch(logout())}
          >
            Logout ({user.username})
          </button>
        ) : (
          <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
