import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="homepage-wrapper">
      <section className="hero-split">
        <div className="hero-left">
          <h1 className="hero-title-split">
            Browse <span className="highlight-users">Users</span>,<br />
            Explore <span className="highlight-posts">Posts</span>.
          </h1>
          <p className="hero-tagline-split">
            A modern React application to discover users, read posts, and dive into comment threads — all fetched live from a REST API.
          </p>
          <div className="hero-actions-split">
            <Link to="/users" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              Browse Users
            </Link>
            <Link to="/posts" className="btn btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
              Browse Posts
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">10</div>
              <div className="stat-label">USERS</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-num">100</div>
              <div className="stat-label">POSTS</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-num">500</div>
              <div className="stat-label">COMMENTS</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          {/* Mockup User Card */}
          <div className="mockup-card user-mock">
            <div className="mock-header">
              <div className="mock-avatar">EL</div>
              <div className="mock-header-lines">
                <div className="mock-line title-line"></div>
                <div className="mock-line subtitle-line"></div>
              </div>
              <span className="mock-badge">USER #3</span>
            </div>
            <div className="mock-body">
              <div className="mock-info-item">
                <span className="mock-icon">✉</span>
                <div className="mock-line text-line long"></div>
              </div>
              <div className="mock-info-item">
                <span className="mock-icon">🏢</span>
                <div className="mock-line text-line medium"></div>
              </div>
            </div>
          </div>

          {/* Mockup Post Card */}
          <div className="mockup-card post-mock">
            <span className="mock-badge teal-badge">POST #12</span>
            <div className="mock-body-lines">
              <div className="mock-line title-line long"></div>
              <div className="mock-line text-line full"></div>
              <div className="mock-line text-line full"></div>
              <div className="mock-line text-line medium"></div>
            </div>
            <div className="mock-footer">
              <span className="mock-comments">💬 5 comments</span>
              <span className="mock-readmore">Read more →</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features-grid" style={{ marginTop: '2rem' }}>
        <div className="feature-card">
          <h2 className="feature-title">Verified Profiles</h2>
          <p className="feature-desc">
            Access verified user portfolios complete with localized contact detail parameters, physical geolocation addresses, corporate company structures, and business slogans.
          </p>
          <Link to="/users" className="btn btn-secondary" style={{ display: 'inline-flex', alignSelf: 'flex-start', marginTop: 'auto' }}>
            Browse Index
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        <div className="feature-card">
          <h2 className="feature-title">Articles Library</h2>
          <p className="feature-desc">
            Dive into an integrated collection of publication records. Select individual items to inspect structural bodies and follow community-driven thread comments.
          </p>
          <Link to="/posts" className="btn btn-secondary" style={{ display: 'inline-flex', alignSelf: 'flex-start', marginTop: 'auto' }}>
            View Feed
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
