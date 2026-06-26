import { CHARACTERS } from '../data/characters';
import './UserSelect.css';

function UserSelect({ onSelectUser, onBack }) {
  return (
    <div className="user-select" id="user-select-screen">
      {/* Dynamic Background Glows */}
      <div className="user-select__glow user-select__glow--purple" />
      <div className="user-select__glow user-select__glow--pink" />

      {onBack && (
        <button className="user-select__back-btn" onClick={onBack} title="Back to landing page">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back</span>
        </button>
      )}

      <div className="user-select__container">
        <div className="user-select__content">
          <div className="user-select__heading-group">
            <div className="user-select__logo">
              <span className="user-select__logo-text">SyncChat</span>
            </div>
            <p className="user-select__subtitle">
              Select your profile to enter the chat workspace
            </p>
            <div className="user-select__divider" />
          </div>

          <div className="user-select__grid">
            {CHARACTERS.map((char) => (
              <button
                key={char.id}
                className="user-card"
                onClick={() => onSelectUser(char.name)}
                id={`select-${char.id}-btn`}
                aria-label={`Join as ${char.name}`}
                style={{ 
                  '--accent': char.color,
                  '--accent-glow': `${char.color}25`
                }}
              >
                <div className="user-card__avatar-wrap">
                  <div className="user-card__ring">
                    <div className="user-card__ring-inner">
                      <span className="user-card__avatar">{char.avatar}</span>
                    </div>
                  </div>
                  <span className="user-card__badge" style={{ background: char.color }} />
                </div>
                <div className="user-card__info">
                  <span className="user-card__name">{char.name}</span>
                  <span className="user-card__status">Available</span>
                </div>
              </button>
            ))}
          </div>

          <div className="user-select__footer">
            <svg className="user-select__footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p className="user-select__hint">
              Open this app in two separate windows or tabs to simulate real-time message sync between different users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSelect;
