import { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import UserSelect from './components/UserSelect';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { getCharacter } from './data/characters';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activePartner, setActivePartner] = useState(null);

  function handleSelectUser(userName) {
    setCurrentUser(userName);
    setActivePartner(null);
  }

  function handleLogout() {
    setCurrentUser(null);
    setActivePartner(null);
  }

  function handleSelectPartner(partnerName) {
    setActivePartner(partnerName);
  }

  const currentChar = currentUser ? getCharacter(currentUser) : null;

  // Render Landing Page first
  if (showLanding && !currentUser) {
    return (
      <div className="app app--logged-out">
        <LandingPage onGetStarted={() => setShowLanding(false)} />
      </div>
    );
  }

  // Not logged in — show user selection
  if (!currentUser) {
    return (
      <div className="app app--logged-out">
        <UserSelect 
          onSelectUser={handleSelectUser} 
          onBack={() => setShowLanding(true)}
        />
      </div>
    );
  }

  // Logged in — show Instagram DM layout
  return (
    <div className="app app--logged-in">
      <div className="app-layout">
        {/* Sidebar */}
        <aside className="app-sidebar">
          {/* Sidebar Header */}
          <div className="sidebar-header">
            <div className="sidebar-header__user">
              <div className="avatar-ring" style={{ '--ring-size': '32px' }}>
                <div className="avatar-ring__inner">
                  <span className="sidebar-header__avatar">{currentChar.avatar}</span>
                </div>
              </div>
              <span className="sidebar-header__name">{currentUser}</span>
            </div>
            <button
              className="sidebar-header__logout"
              onClick={handleLogout}
              id="logout-btn"
              title="Switch account"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>

          {/* Conversation List */}
          <Sidebar
            currentUser={currentUser}
            activePartner={activePartner}
            onSelectPartner={handleSelectPartner}
          />
        </aside>

        {/* Chat Area */}
        <main className="app-chat">
          {activePartner ? (
            <ChatWindow user={currentUser} partner={activePartner} />
          ) : (
            <div className="app-chat__empty">
              <div className="app-chat__empty-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="app-chat__empty-title">Your Messages</h2>
              <p className="app-chat__empty-text">
                Select a conversation from the sidebar to start chatting
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
