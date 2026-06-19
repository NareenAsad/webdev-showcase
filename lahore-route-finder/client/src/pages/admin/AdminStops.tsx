import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks.ts';

const API = 'http://localhost:5000/api/stops';
const LOC_API = 'http://localhost:5000/api/locations';

interface Stop {
  _id: string;
  name: string;
  location?: { _id: string; name: string };
}

interface Location {
  _id: string;
  name: string;
}

export default function AdminStops() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState('');
  const [locationId, setLocationId] = useState('');
  const { token } = useAppSelector(s => s.auth);

  useEffect(() => {
    fetch(API).then(r => r.json()).then(setStops).catch(console.error);
    fetch(LOC_API).then(r => r.json()).then(setLocations).catch(console.error);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, location: locationId || undefined };
    
    const res = await fetch(API, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const newStop = await res.json();
      // Need to populate location name manually for quick UI update
      const loc = locations.find(l => l._id === locationId);
      if (loc) newStop.location = loc;

      setStops([...stops, newStop]);
      setName('');
      setLocationId('');
    } else {
      alert('Failed to create stop');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setStops(stops.filter(s => s._id !== id));
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Manage Stops</h1>
      
      <div style={{ background: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>Add New Stop</h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Gajjumata Stop" required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Location</label>
            <select className="form-input" value={locationId} onChange={e => setLocationId(e.target.value)} style={{ appearance: 'auto' }}>
              <option value="">-- None --</option>
              {locations.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
            </select>
          </div>
          <button type="submit" className="search-submit" style={{ padding: '0.85rem 2rem' }}>Add</button>
        </form>
      </div>

      <div style={{ background: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '0.5rem' }}>Name</th>
              <th style={{ padding: '0.5rem' }}>Location</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stops.map(s => (
              <tr key={s._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.5rem' }}>{s.name}</td>
                <td style={{ padding: '0.5rem' }}>{s.location?.name || 'N/A'}</td>
                <td style={{ padding: '0.5rem' }}>
                  <button className="btn-secondary" onClick={() => handleDelete(s._id)} style={{ color: 'var(--color-error)' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
