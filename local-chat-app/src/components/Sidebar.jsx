import { useState, useEffect } from 'react';
import { getOtherCharacters, getCharacter, getChatKey } from '../data/characters';
import './Sidebar.css';

function Sidebar({ currentUser, activePartner, onSelectPartner }) {
  const others = getOtherCharacters(currentUser);
  const [previews, setPreviews] = useState({});

  // Load last message previews and listen for storage changes
  useEffect(() => {
    function loadPreviews() {
      const result = {};
      others.forEach((char) => {
        const key = getChatKey(currentUser, char.name);
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const msgs = JSON.parse(raw);
            if (msgs.length > 0) {
              const last = msgs[msgs.length - 1];
              const unread = msgs.filter((m) => !m.seenBy.includes(currentUser)).length;
              result[char.name] = { lastMessage: last, unread };
            }
          }
        } catch {
          // ignore parse errors
        }
      });
      setPreviews(result);
    }

    loadPreviews();

    function handleStorage(event) {
      if (event.key && event.key.startsWith('chat_')) {
        loadPreviews();
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [currentUser, others.length]);

  function formatTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  return (
    <div className="sidebar" id="conversation-list">
      <div className="sidebar__search">
        <svg className="sidebar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="sidebar__search-text">Search</span>
      </div>

      <div className="sidebar__label">Messages</div>

      <div className="sidebar__list">
        {others.map((char) => {
          const preview = previews[char.name];
          const isActive = activePartner === char.name;
          const hasUnread = preview && preview.unread > 0;

          return (
            <button
              key={char.id}
              className={`convo-item ${isActive ? 'convo-item--active' : ''} ${hasUnread ? 'convo-item--unread' : ''}`}
              onClick={() => onSelectPartner(char.name)}
              id={`convo-${char.id}`}
            >
              <div className="convo-item__avatar-wrap">
                <div className="convo-item__ring">
                  <div className="convo-item__ring-inner">
                    <span className="convo-item__avatar">{char.avatar}</span>
                  </div>
                </div>
                {hasUnread && <span className="convo-item__unread-dot" />}
              </div>

              <div className="convo-item__content">
                <div className="convo-item__top">
                  <span className="convo-item__name">{char.name}</span>
                  {preview && (
                    <span className="convo-item__time">
                      {formatTime(preview.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                <p className="convo-item__preview">
                  {preview ? (
                    <>
                      {preview.lastMessage.sender === currentUser && (
                        <span className="convo-item__you">You: </span>
                      )}
                      {preview.lastMessage.text}
                    </>
                  ) : (
                    <span className="convo-item__no-msg">Start a conversation</span>
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
