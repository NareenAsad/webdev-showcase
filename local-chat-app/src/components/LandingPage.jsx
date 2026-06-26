import './LandingPage.css';

function LandingPage({ onGetStarted }) {
  return (
    <div className="landing" id="landing-page">
      {/* Background neon mesh glows */}
      <div className="landing__glow landing__glow--top" />
      <div className="landing__glow landing__glow--bottom" />

      {/* Navigation Header */}
      <header className="landing__header">
        <div className="landing__logo">
          <span className="landing__logo-text">SyncChat</span>
        </div>
        <button className="landing__header-btn" onClick={onGetStarted}>
          Launch App
        </button>
      </header>

      {/* Hero Section */}
      <main className="landing__hero">
        <div className="landing__hero-content">
          <div className="landing__badge">Serverless Multi-Tab Messenger</div>
          <h1 className="landing__title">
            Real-Time Chat <br />
            <span className="landing__title-gradient">Powered by LocalStorage</span>
          </h1>
          <p className="landing__tagline">
            Experience seamless cross-window chat sync and unique message-seen counters without any backend servers or socket connections.
          </p>

          <button className="landing__cta-btn" onClick={onGetStarted} id="get-started-btn">
            <span>Get Started</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* Feature Cards */}
        <div className="landing__features">
          <div className="feature-card">
            <div className="feature-card__icon-box" style={{ '--color': '#833AB4' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h3 className="feature-card__title">HTML5 Storage Sync</h3>
            <p className="feature-card__desc">
              Synchronizes chat content across completely different browser tabs using the browser's native `storage` event API.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon-box" style={{ '--color': '#E1306C' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3 className="feature-card__title">Unique Seen Tracking</h3>
            <p className="feature-card__desc">
              Tracks the exact list of users who have read each message, updating counts and turning markers blue instantly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon-box" style={{ '--color': '#F77737' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="feature-card__title">6 Ready-made Profiles</h3>
            <p className="feature-card__desc">
              Switch profiles dynamically to experiment with group interactions and personal chat logs with separate keys.
            </p>
          </div>
        </div>
      </main>

      <footer className="landing__footer">
        <div className="landing__footer-container">
          <div className="landing__footer-brand">
            <span className="landing__logo-text landing__logo-text--small">SyncChat</span>
            <p className="landing__footer-tagline">
              A secure, serverless browser-to-browser messaging sandbox built entirely on top of modern HTML5 Web Storage APIs.
            </p>
          </div>
          
          <div className="landing__footer-links">
            <div className="landing__footer-col">
              <h4 className="landing__footer-title">Sandbox Features</h4>
              <span className="landing__footer-link">Real-Time Event Sync</span>
              <span className="landing__footer-link">Unique Seen Counter</span>
              <span className="landing__footer-link">Multi-Client Simulation</span>
            </div>
            <div className="landing__footer-col">
              <h4 className="landing__footer-title">Built With</h4>
              <a href="https://react.dev" target="_blank" rel="noreferrer" className="landing__footer-link">React JS</a>
              <span className="landing__footer-link">CSS3 Variables</span>
              <span className="landing__footer-link">Vite Sandbox</span>
            </div>
          </div>
        </div>
        
        <div className="landing__footer-bottom">
          <p className="landing__footer-copy">© 2026 SyncChat. Serverless Web Simulation Sandbox.</p>
          <div className="landing__footer-socials">
            <span className="landing__footer-badge">No Database Needed</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
