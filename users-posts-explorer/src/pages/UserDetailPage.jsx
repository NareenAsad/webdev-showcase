import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showPosts, setShowPosts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetailAndPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const [userRes, postsRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/users/${id}`),
          fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`)
        ]);

        if (!userRes.ok) {
          if (userRes.status === 404) {
            throw new Error('User profile not found.');
          }
          throw new Error(`HTTP error! Status: ${userRes.status}`);
        }
        
        const userData = await userRes.json();
        setUser(userData);

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetailAndPosts();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="detail-wrapper">
        <button onClick={handleBack} className="btn btn-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-wrapper">
        <button onClick={handleBack} className="btn btn-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
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
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : '??';

  return (
    <div className="detail-wrapper">
      <button onClick={handleBack} className="btn btn-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Users
      </button>

      <div className="detail-card">
        <div className="detail-header-block">
          <div className="detail-header-info">
            <h1 className="detail-main-title">{user.name}</h1>
            <p className="detail-sub-title">@{user.username}</p>
          </div>
          <div className="detail-avatar-large">
            {initials}
          </div>
        </div>

        <div className="detail-grid-layout">
          <div className="detail-block">
            <h2 className="detail-block-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Contact Details
            </h2>
            
            <div className="detail-field">
              <span className="detail-field-label">Email</span>
              <span className="detail-field-value">{user.email}</span>
            </div>

            <div className="detail-field">
              <span className="detail-field-label">Phone</span>
              <span className="detail-field-value">{user.phone}</span>
            </div>

            <div className="detail-field">
              <span className="detail-field-label">Website</span>
              <span className="detail-field-value">
                <a 
                  href={`https://${user.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  {user.website}
                </a>
              </span>
            </div>
          </div>

          <div className="detail-block">
            <h2 className="detail-block-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              Company Info
            </h2>
            
            <div className="detail-field">
              <span className="detail-field-label">Name</span>
              <span className="detail-field-value" style={{ fontWeight: 600 }}>{user.company?.name}</span>
            </div>

            <div className="detail-field">
              <span className="detail-field-label">Tagline</span>
              <span className="detail-field-value" style={{ fontStyle: 'italic' }}>"{user.company?.catchPhrase}"</span>
            </div>

            <div className="detail-field">
              <span className="detail-field-label">Focus</span>
              <span className="detail-field-value">{user.company?.bs}</span>
            </div>
          </div>

          <div className="detail-block" style={{ gridColumn: 'span 2' }}>
            <h2 className="detail-block-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Address &amp; Location
            </h2>
            
            <div className="detail-field">
              <span className="detail-field-label">Suite</span>
              <span className="detail-field-value">{user.address?.suite}</span>
            </div>

            <div className="detail-field">
              <span className="detail-field-label">Street</span>
              <span className="detail-field-value">{user.address?.street}</span>
            </div>

            <div className="detail-field">
              <span className="detail-field-label">City</span>
              <span className="detail-field-value">{user.address?.city}</span>
            </div>

            <div className="detail-field">
              <span className="detail-field-label">Zip Code</span>
              <span className="detail-field-value">{user.address?.zipcode}</span>
            </div>

            {user.address?.geo && (
              <div className="detail-field">
                <span className="detail-field-label">Geo</span>
                <span className="detail-field-value" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic toggle button for user posts */}
        <button 
          onClick={() => setShowPosts(!showPosts)} 
          className="btn btn-primary" 
          style={{ marginTop: '2.5rem', width: '100%', justifyContent: 'center' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
            <path d="M6 6h10"/>
            <path d="M6 10h10"/>
          </svg>
          {showPosts ? "Hide" : "View"} Published Articles ({posts.length})
        </button>

        {showPosts && (
          <div style={{ marginTop: '2.5rem', borderTop: '1.5px solid var(--border)', paddingTop: '2.5rem' }}>
            <h2 className="comments-header-title" style={{ marginBottom: '1.5rem' }}>
              Articles by {user.name} <span className="comments-count-badge">{posts.length}</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {posts.map(post => (
                <Link 
                  to={`/posts/${post.id}`} 
                  key={post.id} 
                  className="comment-card-item" 
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', transition: 'border-color 0.2s' }}
                >
                  <h3 className="commenter-name" style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', textTransform: 'none' }}>
                    {post.title}
                  </h3>
                  <p className="comment-body-content" style={{ color: 'var(--text-secondary)' }}>
                    {post.body.substring(0, 120)}...
                  </p>
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.75rem' }}>
                    Read Article
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

