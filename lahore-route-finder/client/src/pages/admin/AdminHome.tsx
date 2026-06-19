import React from 'react';

export default function AdminHome() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Admin Dashboard</h1>
      <p style={{ color: 'var(--color-muted)' }}>Welcome to the admin panel. Here you can manage locations, stops, and routes for the Lahore Route Finder.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Locations</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>Manage cities and main areas.</p>
          <a href="/admin/locations" className="btn-primary" style={{ display: 'inline-block' }}>Manage Locations</a>
        </div>
        
        <div style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Stops</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>Manage individual transport stops.</p>
          <a href="/admin/stops" className="btn-primary" style={{ display: 'inline-block' }}>Manage Stops</a>
        </div>
        
        <div style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Routes</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>Manage bus and train lines.</p>
          <a href="/admin/routes" className="btn-primary" style={{ display: 'inline-block' }}>Manage Routes</a>
        </div>
      </div>
    </div>
  );
}
