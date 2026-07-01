import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsersAndPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const [usersRes, postsRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/users'),
          fetch('https://jsonplaceholder.typicode.com/posts')
        ]);
        
        if (!usersRes.ok) {
          throw new Error(`HTTP error! Status: ${usersRes.status}`);
        }
        
        const usersData = await usersRes.json();
        const postsData = postsRes.ok ? await postsRes.json() : [];
        
        const mappedUsers = usersData.map(user => ({
          ...user,
          postsCount: postsData.filter(post => post.userId === user.id).length
        }));
        
        setUsers(mappedUsers);
      } catch (err) {
        setError(err.message || 'Failed to retrieve users directory. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndPosts();
  }, []);

  const filteredUsers = users.filter((user) => {
    const nameMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = user.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || emailMatch || companyMatch;
  });

  if (loading) {
    return (
      <div>
        <div className="flex-between">
          <h1 className="page-title">Users Directory</h1>
        </div>
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-title-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>Error</span>
        </div>
        <div className="error-message-text">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex-between">
        <h1 className="page-title">Users Directory</h1>
        <div className="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state-block">
          <p className="empty-state-text">No users found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid-container">
          {filteredUsers.map((user) => (
            <Link to={`/users/${user.id}`} key={user.id} className="item-card">
              <h2 className="item-card-title">{user.name}</h2>
              <div className="item-card-body">
                <div className="user-info-row">
                  <div className="user-info-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>
                    </svg>
                    <span className="info-label">Username</span>
                    <span className="info-val">{user.username}</span>
                  </div>
                  <div className="user-info-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <span className="info-label">Email</span>
                    <span className="info-val">{user.email}</span>
                  </div>
                  <div className="user-info-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
                      <path d="M9 22v-4h6v4"/>
                      <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
                    </svg>
                    <span className="info-label">Company</span>
                    <span className="info-val">{user.company?.name}</span>
                  </div>
                  <div className="user-info-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                      <path d="M6 6h10"/><path d="M6 10h10"/>
                    </svg>
                    <span className="info-label">Articles</span>
                    <span className="info-val" style={{ color: 'var(--accent)', fontWeight: 600 }}>{user.postsCount} published</span>
                  </div>
                </div>
              </div>
              <div className="item-card-footer">
                <span>{user.address?.city}</span>
                <span className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                  View Profile
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

