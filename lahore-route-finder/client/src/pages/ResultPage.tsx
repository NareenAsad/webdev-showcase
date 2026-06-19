import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks.ts';
import type { Leg } from '../store/slices/searchSlice.ts';
import MapView from '../components/MapView.tsx';

interface FareDetails {
  legFares: { name: string; fare: number; type: 'metrobus' | 'orangeline' | 'speedo' }[];
  totalFare: number;
}

function calculateEstimatedFare(legs: Leg[]): FareDetails {
  const legFares = legs.map((leg) => {
    const nameLower = leg.routeName.toLowerCase();
    let fare = 30; // default/fallback
    let type: 'metrobus' | 'orangeline' | 'speedo' = 'speedo';

    if (nameLower.includes('metrobus')) {
      fare = 30;
      type = 'metrobus';
    } else if (nameLower.includes('orange line') || nameLower.includes('orangeline')) {
      fare = 40;
      type = 'orangeline';
    } else {
      // Speedo default: PKR 20 base, plus PKR 5 per stop, capped at PKR 80 per leg
      const stopCount = leg.stops.length;
      fare = Math.min(20 + stopCount * 5, 80);
      type = 'speedo';
    }

    return {
      name: leg.routeName,
      fare,
      type
    };
  });

  const totalFare = legFares.reduce((sum, item) => sum + item.fare, 0);
  return { legFares, totalFare };
}

function getTransportIcon(routeName: string, size = 18) {
  const nameLower = routeName.toLowerCase();
  if (nameLower.includes('orange line') || nameLower.includes('orangeline')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.4rem', marginLeft: '0.4rem' }}>
        <rect x="4" y="3" width="16" height="14" rx="2" />
        <path d="M4 11h16" />
        <path d="M12 3v8" />
        <path d="M8 17l-3 4" />
        <path d="M16 17l3 4" />
      </svg>
    );
  } else if (nameLower.includes('metrobus')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.4rem', marginLeft: '0.4rem' }}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
        <path d="M6 14h2" />
        <path d="M16 14h2" />
      </svg>
    );
  } else {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.4rem', marginLeft: '0.4rem' }}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
      </svg>
    );
  }
}

function LegCard({ leg, index, total }: { leg: Leg; index: number; total: number }) {
  return (
    <div className="leg-item">
      {/* Timeline column */}
      <div className="leg-line-col" aria-hidden="true">
        <div className={`leg-dot${index === total - 1 ? ' end' : ''}`} />
        {index < total - 1 && <div className="leg-connector" />}
      </div>

      {/* Card */}
      <div className="leg-card">
        <div className="leg-route-name" style={{ display: 'inline-flex', alignItems: 'center' }}>
          {getTransportIcon(leg.routeName)}
          <span>{leg.routeName}</span>
        </div>

        <div className="leg-stops">
          {/* Board */}
          <div className="leg-stop-row">
            <div className="stop-icon board" aria-hidden="true" />
            <div>
              <div className="stop-name">{leg.board.name}</div>
              {leg.board.location && <div className="stop-sub">{leg.board.location}</div>}
            </div>
            <span className="stop-tag tag-board">Board</span>
          </div>

          {/* Intermediate stops (collapsed if > 3) */}
          {leg.stops.slice(0, -1).length > 0 && (
            <details style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '0.25rem' }}>
              <summary style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                {leg.stops.length - 1} intermediate stops
              </summary>
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {leg.stops.slice(0, -1).map((s) => (
                  <div key={s.stopId} className="leg-stop-row">
                    <div className="stop-icon" aria-hidden="true" />
                    <div className="stop-name" style={{ fontWeight: 400, fontSize: '0.9rem' }}>{s.name}</div>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Alight */}
          <div className="leg-stop-row">
            <div className="stop-icon alight" aria-hidden="true" />
            <div>
              <div className="stop-name">{leg.alight.name}</div>
              {leg.alight.location && <div className="stop-sub">{leg.alight.location}</div>}
            </div>
            <span className="stop-tag tag-alight">Alight</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const navigate = useNavigate();
  const { result, loading, error } = useAppSelector((s) => s.search);

  if (loading) {
    return (
      <div className="result-page">
        <div className="spinner-wrapper">
          <div className="spinner" role="status" aria-label="Searching..." />
          <p style={{ color: 'var(--color-muted)' }}>Finding the best route…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-page">
        <div className="empty-state">
          <div className="icon">⚠️</div>
          <h2>Route Not Found</h2>
          <p>{error}</p>
          <button id="result-search-again-error-btn" className="btn-primary mt-2" onClick={() => navigate('/search')}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-page">
        <div className="empty-state">
          <div className="icon">🗺️</div>
          <h2>No Results Yet</h2>
          <p>Search for a route to see your journey plan here.</p>
          <button id="result-go-search-btn" className="btn-primary mt-2" onClick={() => navigate('/search')}>
            Search Route
          </button>
        </div>
      </div>
    );
  }

  const { origin, destination, legs, transfers, totalStops, algorithm, message } = result;
  const fareDetails = calculateEstimatedFare(legs);

  return (
    <main className="result-page has-results" aria-labelledby="result-heading">
      <header className="result-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="result-title" id="result-heading">
              {origin} → {destination}
            </h1>
            <div className="result-meta">
              <span className="result-badge highlight">
                {algorithm === 'bfs' ? '🔀 Fewest Transfers' : '⚡ Shortest Path'}
              </span>
              <span className="result-badge">
                🚌 {legs.length} legs
              </span>
              {transfers > 0 && (
                <span className="result-badge">
                  🔄 {transfers} transfers
                </span>
              )}
              {totalStops != null && (
                <span className="result-badge green">
                  📍 {totalStops} stops
                </span>
              )}
            </div>
          </div>

          <button
            id="result-search-again-btn"
            className="search-again-btn"
            onClick={() => navigate('/search')}
          >
            ← Search Again
          </button>
        </div>
      </header>

      {message && (
        <div className="alert alert-error" role="status">{message}</div>
      )}

      {legs.length === 0 ? (
        <div className="empty-state">
          <div className="icon">✅</div>
          <h2>Already There!</h2>
          <p>Your origin and destination are the same stop.</p>
        </div>
      ) : (
        <div className="result-content-layout">
          <div>
            <div className="legs-timeline" aria-label="Journey steps">
              {legs.map((leg, i) => (
                <React.Fragment key={`${leg.routeId}-${i}`}>
                  <LegCard leg={leg} index={i} total={legs.length} />
                  {i < legs.length - 1 && (
                    <div className="transfer-pill" aria-label="Transfer here">
                      🔄 Transfer at {leg.alight.name}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Fare Breakdown Card */}
            <div className="fare-card">
              <div className="fare-card-title">
                <span className="icon">💳</span>
                <span>Fare Estimator Breakdown</span>
              </div>
              <div className="fare-list">
                {fareDetails.legFares.map((f, i) => (
                  <div key={i} className="fare-item">
                    <span className="fare-item-name">
                      {getTransportIcon(f.name, 14)}
                      {f.name} ({f.type === 'metrobus' ? 'Metrobus Flat Fare' : f.type === 'orangeline' ? 'Orange Line Flat Fare' : 'Speedo Distance Fare'})
                    </span>
                    <span className="fare-item-value">PKR {f.fare}</span>
                  </div>
                ))}
              </div>
              <div className="fare-total">
                <span className="fare-total-label">Total Estimated Fare</span>
                <span className="fare-total-value">PKR {fareDetails.totalFare}</span>
              </div>
            </div>
          </div>

          <div className="map-sidebar">
            <MapView result={result} />
          </div>
        </div>
      )}
    </main>
  );
}
