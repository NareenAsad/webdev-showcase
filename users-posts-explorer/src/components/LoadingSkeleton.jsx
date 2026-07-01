import React from 'react';

export function CardSkeleton({ count = 6 }) {
  return (
    <div className="grid-container">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-line skeleton-title skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-desc skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-desc mid skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-desc short skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-footer skeleton-shimmer"></div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="detail-wrapper">
      <div className="skeleton-detail-wrapper">
        <div className="skeleton-line skeleton-detail-title skeleton-shimmer"></div>
        <div className="skeleton-line skeleton-detail-subtitle skeleton-shimmer"></div>
        <div className="skeleton-detail-grid">
          <div className="skeleton-line skeleton-detail-block skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-detail-block skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-detail-block skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-detail-block skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ type = 'card', count = 6 }) {
  if (type === 'detail') {
    return <DetailSkeleton />;
  }
  return <CardSkeleton count={count} />;
}
