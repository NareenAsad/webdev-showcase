import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostAndMetadata = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Post Detail
        const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if (!postRes.ok) {
          if (postRes.status === 404) {
            throw new Error('Article not found.');
          }
          throw new Error(`HTTP error fetching post! Status: ${postRes.status}`);
        }
        const postData = await postRes.json();
        setPost(postData);

        // 2. Fetch Author and Comments in parallel
        const [authorRes, commentsRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/users/${postData.userId}`),
          fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
        ]);

        if (authorRes.ok) {
          const authorData = await authorRes.json();
          setAuthor(authorData);
        }

        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData);
        } else {
          throw new Error(`HTTP error fetching comments! Status: ${commentsRes.status}`);
        }

      } catch (err) {
        setError(err.message || 'Failed to retrieve article and comments.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndMetadata();
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

  if (!post) return null;

  const authorInitials = author 
    ? author.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'AU';

  return (
    <div className="detail-wrapper">
      <button onClick={handleBack} className="btn btn-back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Articles
      </button>

      <article className="detail-card">
        <div className="detail-header-block">
          <div className="detail-header-info">
            <h1 className="detail-main-title">{post.title}</h1>
            <p className="detail-sub-title">
              Published by:{' '}
              {author ? (
                <Link 
                  to={`/users/${author.id}`} 
                  style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  {author.name}
                </Link>
              ) : (
                `Author ${post.userId}`
              )}
            </p>
          </div>
          <div className="detail-avatar-large">
            {authorInitials}
          </div>
        </div>

        <div className="detail-section">
          <p className="detail-body-text">{post.body}</p>
        </div>

        <section className="comments-section">
          <h2 className="comments-header-title">
            Discussion <span className="comments-count-badge">{comments.length}</span>
          </h2>

          <div className="comments-list-stack">
            {comments.map((comment) => {
              const commentInitials = comment.name 
                ? comment.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() 
                : '??';

              return (
                <div key={comment.id} className="comment-card-item">
                  <div className="comment-avatar-small">
                    {commentInitials}
                  </div>
                  <div className="comment-content-block">
                    <div className="comment-header-row">
                      <span className="commenter-name">{comment.name}</span>
                      <span className="commenter-email">{comment.email}</span>
                    </div>
                    <p className="comment-body-content">{comment.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </article>
    </div>
  );
}

