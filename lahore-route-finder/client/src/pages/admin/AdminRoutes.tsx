import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks.ts';

import { API_BASE } from '../../config.ts';

const API = `${API_BASE}/api/routes`;
const STOPS_API = `${API_BASE}/api/stops`;

interface Route {
  _id: string;
  name: string;
  stops: { _id: string; name: string }[];
}

interface Stop {
  _id: string;
  name: string;
}

export default function AdminRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [name, setName] = useState('');
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const { token } = useAppSelector(s => s.auth);

  useEffect(() => {
    fetch(API).then(r => r.json()).then(setRoutes).catch(console.error);
    fetch(STOPS_API).then(r => r.json()).then(setStops).catch(console.error);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStops.length < 2) {
      alert('A route must have at least 2 stops.');
      return;
    }
    
    const payload = { name, stops: selectedStops };
    
    const res = await fetch(API, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const newRoute = await res.json();
      // Populate stops for UI
      newRoute.stops = selectedStops.map(id => stops.find(s => s._id === id)).filter(Boolean);
      
      setRoutes([...routes, newRoute]);
      setName('');
      setSelectedStops([]);
    } else {
      alert('Failed to create route');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setRoutes(routes.filter(r => r._id !== id));
    }
  };

  const toggleStop = (id: string) => {
    if (selectedStops.includes(id)) {
      setSelectedStops(selectedStops.filter(s => s !== id));
    } else {
      setSelectedStops([...selectedStops, id]);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Manage Routes</h1>
      
      <div style={{ background: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>Add New Route</h2>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Route Name (e.g. Speedo Bus 1)</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Stops (in order)</label>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'var(--color-surface2)' }}>
              {stops.map(s => (
                <label key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.2rem', borderRadius: '4px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedStops.includes(s._id)} 
                    onChange={() => toggleStop(s._id)}
                  />
                  <span>{s.name}</span>
                  {selectedStops.includes(s._id) && (
                    <span style={{ marginLeft: 'auto', marginRight: '0.5rem', fontSize: '0.8rem', background: 'var(--color-primary)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '12px', fontWeight: 'bold' }}>
                      {selectedStops.indexOf(s._id) + 1}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="search-submit" style={{ alignSelf: 'flex-start', width: 'auto', padding: '0.85rem 2.5rem' }}>Create Route</button>
        </form>
      </div>

      <div style={{ background: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '0.5rem' }}>Route Name</th>
              <th style={{ padding: '0.5rem' }}>Stops Count</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.5rem' }}>{r.name}</td>
                <td style={{ padding: '0.5rem' }}>{r.stops?.length || 0}</td>
                <td style={{ padding: '0.5rem' }}>
                  <button className="btn-secondary" onClick={() => handleDelete(r._id)} style={{ color: 'var(--color-error)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
