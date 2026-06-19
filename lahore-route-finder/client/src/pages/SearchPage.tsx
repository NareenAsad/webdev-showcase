import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks.ts';
import { runSearch, setLastQuery } from '../store/slices/searchSlice.ts';
import { fetchLocations } from '../store/slices/locationsSlice.ts';
import Autocomplete from '../components/Autocomplete.tsx';
import type { Location } from '../store/slices/locationsSlice.ts';
import { useEffect } from 'react';

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [originText,      setOriginText]      = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [originLoc,       setOriginLoc]       = useState<Location | null>(null);
  const [destLoc,         setDestLoc]         = useState<Location | null>(null);
  const [algorithm, setAlgorithm]             = useState<'bfs' | 'dijkstra'>('bfs');
  const [err, setErr]                         = useState('');

  // Pre-load all locations so autocomplete has data
  useEffect(() => { dispatch(fetchLocations()); }, [dispatch]);

  const handleSwap = () => {
    setOriginText(destinationText);
    setDestinationText(originText);
    setOriginLoc(destLoc);
    setDestLoc(originLoc);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    const origin      = originLoc?.name      || originText.trim();
    const destination = destLoc?.name        || destinationText.trim();

    if (!origin)      { setErr('Please enter an origin stop.');      return; }
    if (!destination) { setErr('Please enter a destination stop.'); return; }
    if (origin === destination) { setErr('Origin and destination cannot be the same.'); return; }

    dispatch(setLastQuery({ origin, destination, algorithm }));

    const result = await dispatch(runSearch({ originName: origin, destinationName: destination, algorithm }));

    if (runSearch.fulfilled.match(result)) {
      navigate('/result');
    } else {
      setErr((result.payload as string) || 'No route found.');
    }
  };

  return (
    <main className="search-page">
      <form className="search-card" onSubmit={handleSubmit} noValidate>
        <header className="search-card-header">
          <h1>Find a Route</h1>
          <p>Search across Metrobus, Orange Line &amp; Speedo routes</p>
        </header>

        {err && <div className="alert alert-error" role="alert">{err}</div>}

        {/* Origin */}
        <div className="form-group">
          <label className="form-label" htmlFor="origin-input">From (Origin Stop)</label>
          <Autocomplete
            id="origin-input"
            placeholder="Select starting location..."
            value={originText}
            onChange={(v) => { setOriginText(v); setOriginLoc(null); }}
            onSelect={(loc) => { setOriginLoc(loc); setOriginText(loc.name); }}
          />
        </div>

        {/* Swap button */}
        <div className="divider-swap">
          <button
            type="button"
            id="swap-btn"
            className="swap-btn"
            onClick={handleSwap}
            title="Swap origin and destination"
            aria-label="Swap origin and destination"
          >
            ⇅
          </button>
        </div>

        {/* Destination */}
        <div className="form-group">
          <label className="form-label" htmlFor="destination-input">To (Destination Stop)</label>
          <Autocomplete
            id="destination-input"
            placeholder="Select destination..."
            value={destinationText}
            onChange={(v) => { setDestinationText(v); setDestLoc(null); }}
            onSelect={(loc) => { setDestLoc(loc); setDestinationText(loc.name); }}
          />
        </div>

        {/* Algorithm selector */}
        <div className="form-group">
          <span className="form-label">Routing Mode</span>
          <div className="algo-group">
            <button
              type="button"
              id="algo-bfs-btn"
              className={`algo-btn${algorithm === 'bfs' ? ' selected' : ''}`}
              onClick={() => setAlgorithm('bfs')}
            >
              🔀 Fewest Transfers
            </button>
            <button
              type="button"
              id="algo-dijkstra-btn"
              className={`algo-btn${algorithm === 'dijkstra' ? ' selected' : ''}`}
              onClick={() => setAlgorithm('dijkstra')}
            >
              ⚡ Shortest Path
            </button>
          </div>
        </div>

        <button type="submit" id="search-submit-btn" className="search-submit">
          Search Route →
        </button>
      </form>
    </main>
  );
}
