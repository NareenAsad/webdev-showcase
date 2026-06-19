import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch } from '../../hooks.ts';
import { logout } from '../../store/slices/authSlice.ts';

export default function AdminDashboard() {
  const dispatch = useAppDispatch();

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <header className="admin-sidebar-header">
          <span className="admin-sidebar-title">Admin Portal</span>
        </header>

        <nav className="admin-nav-list" aria-label="Admin Navigation">
          <NavLink to="/admin" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`} end>
            {/* Dashboard grid icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/locations" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            {/* Location map marker icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 22s-8-6.75-8-12a8 8 0 0 1 16 0c0 5.25-8 12-8 12z" />
            </svg>
            <span>Locations</span>
          </NavLink>

          <NavLink to="/admin/stops" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            {/* Stop dot icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" fill="currentColor" />
            </svg>
            <span>Stops</span>
          </NavLink>

          <NavLink to="/admin/routes" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
            {/* Route path connector icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="18" r="3" />
              <line x1="6" y1="9" x2="6" y2="18" />
              <line x1="6" y1="18" x2="15" y2="18" />
            </svg>
            <span>Routes</span>
          </NavLink>
        </nav>
        
        <div className="admin-sidebar-footer">
          <button 
            className="search-submit" 
            style={{ width: '100%', background: 'rgba(226, 35, 26, 0.1)', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', boxShadow: 'none' }}
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
