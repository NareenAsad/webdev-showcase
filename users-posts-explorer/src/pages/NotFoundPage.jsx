import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="detail-wrapper" style={{ textAlign: 'center', padding: '1.5rem 2rem' }}>
      <div className="detail-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 className="hero-title" style={{ fontSize: '6rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
          404
        </h1>
        <h2 className="feature-title" style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>
          Page Not Found
        </h2>
        <p className="feature-desc" style={{ marginBottom: '2.5rem' }}>
          The page you are looking for does not exist, has been removed, or the address was entered incorrectly.
        </p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
