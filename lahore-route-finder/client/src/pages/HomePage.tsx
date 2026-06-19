import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero-section" aria-labelledby="hero-heading">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680 }}>
          <div className="hero-badge">
            <span>🚌</span> Lahore Transit Network
          </div>

          <h1 className="hero-title" id="hero-heading">
            Find Your Route
            <br />
            <span className="grad-red">Metrobus</span>{' '}
            &amp;{' '}
            <span className="grad-orange">Orange Line</span>
          </h1>

          <p className="hero-subtitle">
            Instantly find the best bus route across Lahore's transit network.
            Type your origin and destination — we'll handle the rest.
          </p>

          <div className="hero-cta-group">
            <button
              id="hero-search-btn"
              className="btn-primary"
              onClick={() => navigate('/search')}
            >
              🔍 Search Route
            </button>
            <button
              id="hero-about-btn"
              className="btn-secondary"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num stat-red">27</div>
              <div className="stat-label">Metrobus Stops</div>
            </div>
            <div className="stat-item">
              <div className="stat-num stat-orange">26</div>
              <div className="stat-label">Orange Line Stops</div>
            </div>
            <div className="stat-item">
              <div className="stat-num stat-blue">34+</div>
              <div className="stat-label">Speedo Routes</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="features-section" aria-labelledby="features-heading">
        <h2 className="section-heading" id="features-heading">Why Lahore Route Finder?</h2>
        <p className="section-sub">Everything you need to navigate Lahore's public transit.</p>

        <div className="features-grid">
          {[
            { icon: '⚡', title: 'Instant Results',    desc: 'BFS-powered fewest-transfer routing gives you answers in milliseconds.' },
            { icon: '🗺️', title: 'Full Network',      desc: 'Covers Metrobus, Orange Line, and Speedo bus routes across the city.' },
            { icon: '🔄', title: 'Multi-leg Journeys', desc: 'Handles transfers seamlessly — get a step-by-step journey plan.' },
            { icon: '📍', title: 'GPS Lookup',         desc: "Don't know the stop name? Search by coordinates and we find the nearest stop." },
            { icon: '🧠', title: 'Smart Algorithms',   desc: 'Choose BFS for fewest transfers, or Dijkstra for the shortest path.' },
            { icon: '🔒', title: 'Admin Panel',        desc: 'Route admins can add and update stops and routes in real time.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon" aria-hidden="true">{icon}</div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
