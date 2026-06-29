import React, { useState, useEffect } from 'react';

export default function UserDirectory({ apiUrl, pageSize, searchTerm, setSearchTerm }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Effect #1 — fetch on mount / when apiUrl prop or retryTrigger changes
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl, { signal });
        if (!response.ok) {
          throw new Error(`Server returned status: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Validate that data is an array
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          throw new Error("Invalid API response format (expected an array of users)");
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to retrieve directory list.');
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    // Clean up / abort in-flight request if apiUrl changes quickly
    return () => {
      controller.abort();
    };
  }, [apiUrl, retryTrigger]);

  // Effect #2 — debounced search logging (cleanup demonstration)
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(`Searching for: ${searchTerm}`);
    }, 500);
    
    return () => clearTimeout(timer); // cleanup!
  }, [searchTerm]);

  // Filtering users by searchTerm (case-insensitive name check)
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Slicing to the first pageSize results
  const displayedUsers = filteredUsers.slice(0, pageSize);

  // Effect #3 (Stretch Goal) — updates document.title to show the result count
  useEffect(() => {
    document.title = `Users: ${displayedUsers.length} shown of ${filteredUsers.length}`;
  }, [displayedUsers.length, filteredUsers.length]);

  const handleRetry = () => {
    setRetryTrigger((prev) => prev + 1);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const getGradient = (id) => {
    const gradients = [
      'linear-gradient(135deg, #6366F1 0%, #818cf8 100%)', // Indigo
      'linear-gradient(135deg, #10B981 0%, #34d399 100%)', // Emerald
      'linear-gradient(135deg, #3B82F6 0%, #60a5fa 100%)', // Blue
      'linear-gradient(135deg, #F43F5E 0%, #fb7185 100%)', // Rose
      'linear-gradient(135deg, #8B5CF6 0%, #a78bfa 100%)', // Purple
      'linear-gradient(135deg, #F59E0B 0%, #fbbf24 100%)', // Amber
    ];
    return gradients[id % gradients.length] || gradients[0];
  };

  // 1. Rendering Logic: Show loading skeletons
  if (loading) {
    return (
      <div>
        <div className="results-header">
          <div className="results-count">Connecting to user database...</div>
        </div>
        <div className="user-grid">
          {Array.from({ length: pageSize }).map((_, idx) => (
            <div key={idx} className="skeleton-card">
              <div className="skeleton-shimmer"></div>
              <div className="skeleton-header">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-info">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-subtitle"></div>
                </div>
              </div>
              <div className="skeleton-body">
                <div className="skeleton-line skeleton-line-long"></div>
                <div className="skeleton-line skeleton-line-medium"></div>
                <div className="skeleton-line skeleton-line-short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Rendering Logic: Show error state card
  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h3 className="error-title">Database Fetch Failed</h3>
        <p className="error-message">{error}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={handleRetry}>
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  // 3. Rendering Logic: Show "No users found" empty state
  if (displayedUsers.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <h3 className="empty-title">No Users Found</h3>
        <p className="empty-message">
          We couldn't find any users matching "<strong>{searchTerm}</strong>".
        </p>
        <button className="btn btn-primary" onClick={() => setSearchTerm('')}>
          Reset Search
        </button>
      </div>
    );
  }

  // 4. Rendering Logic: Display grid of matching users
  return (
    <div>
      <div className="results-header">
        <div className="results-count">
          Showing <span>{displayedUsers.length}</span> of <span>{filteredUsers.length}</span> matching users
        </div>
      </div>

      <div className="user-grid">
        {displayedUsers.map((user) => (
          <div key={user.id} className="user-card">
            {/* Header: Avatar, Name and Username */}
            <div className="card-header">
              <div className="avatar-wrapper">
                <div
                  className="user-avatar"
                  style={{ background: getGradient(user.id) }}
                >
                  {getInitials(user.name)}
                </div>
              </div>
              <div className="user-info">
                <h4 className="user-name">{user.name}</h4>
                <span className="user-username">@{user.username || 'username'}</span>
              </div>
            </div>

            {/* Body: Contact details with icons */}
            <div className="card-body">
              <div className="detail-item">
                <svg
                  className="detail-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div className="detail-text">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{user.email || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-item">
                <svg
                  className="detail-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div className="detail-text">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{user.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-item">
                <svg
                  className="detail-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <div className="detail-text">
                  <span className="detail-label">Company</span>
                  <span className="detail-value">{user.company?.name || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-item">
                <svg
                  className="detail-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <div className="detail-text">
                  <span className="detail-label">Website</span>
                  <span className="detail-value">{user.website || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-item">
                <svg
                  className="detail-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <div className="detail-text">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">
                    {user.address?.suite && `${user.address.suite}, `}
                    {user.address?.street && `${user.address.street}, `}
                    {user.address?.city || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
