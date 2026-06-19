import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks.ts';

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAppSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="empty-state" style={{ marginTop: '4rem' }}>
        <div className="icon">🚫</div>
        <h2>Access Denied</h2>
        <p>You must be an admin to view this page.</p>
        <a href="/" className="btn-primary mt-2" style={{ display: 'inline-block' }}>Go Home</a>
      </div>
    );
  }

  return <>{children}</>;
}
