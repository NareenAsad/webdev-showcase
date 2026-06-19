import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks.ts';
import type { Location } from '../../store/slices/locationsSlice.ts';

import { API_BASE } from '../../config.ts';

const API = `${API_BASE}/api/locations`;

export default function AdminLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('Lahore');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const { token } = useAppSelector(s => s.auth);

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name, city,
      coordinates: (lat && lng) ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined
    };
    
    const res = await fetch(API, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const newLoc = await res.json();
      setLocations([...locations, newLoc]);
      setName(''); setLat(''); setLng('');
    } else {
      alert('Failed to create location');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setLocations(locations.filter(l => l._id !== id));
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Manage Locations</h1>
      
      <div style={{ background: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>Add New Location</h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Gajjumata" required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">City</label>
            <input className="form-input" value={city} onChange={e => setCity(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Lat (opt)</label>
            <input type="number" step="any" className="form-input" value={lat} onChange={e => setLat(e.target.value)} placeholder="31.5158" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Lng (opt)</label>
            <input type="number" step="any" className="form-input" value={lng} onChange={e => setLng(e.target.value)} placeholder="74.3223" />
          </div>
          <button type="submit" className="search-submit" style={{ padding: '0.85rem 2rem' }}>Add</button>
        </form>
      </div>

      <div style={{ background: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '0.5rem' }}>Name</th>
              <th style={{ padding: '0.5rem' }}>City</th>
              <th style={{ padding: '0.5rem' }}>Coordinates</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map(l => (
              <tr key={l._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.5rem' }}>{l.name}</td>
                <td style={{ padding: '0.5rem' }}>{l.city}</td>
                <td style={{ padding: '0.5rem' }}>
                  {l.coordinates ? `${l.coordinates.lat.toFixed(4)}, ${l.coordinates.lng.toFixed(4)}` : 'N/A'}
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <button className="btn-secondary" onClick={() => handleDelete(l._id)} style={{ color: 'var(--color-error)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
