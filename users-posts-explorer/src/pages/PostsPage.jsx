import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message || 'Failed to retrieve posts. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const bodyMatch = post.body?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || bodyMatch;
  });

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const getReadingTime = (text) => {
    if (!text) return 1;
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 30)); // Assume 30 words per minute for realistic layout
  };

  if (loading) {
    return (
      <div>
        <div className="flex-between">
          <h1 className="page-title">Articles Feed</h1>
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
        <h1 className="page-title">Articles Feed</h1>
        <div className="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search posts by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="empty-state-block">
          <p className="empty-state-text">No articles found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid-container">
          {filteredPosts.map((post) => (
            <Link to={`/posts/${post.id}`} key={post.id} className="item-card">
              <h2 className="item-card-title">{post.title}</h2>
              <p className="item-card-body">{truncateText(post.body, 120)}</p>
              <div className="item-card-footer">
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px', color: 'var(--text-muted)' }}>
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Author {post.userId}
                  <span style={{ margin: '0 0.5rem', color: 'var(--border)' }}>•</span>
                  {getReadingTime(post.body)} min read
                </span>
                <span className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                  Read Article
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

