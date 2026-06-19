import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import Navbar from './components/Navbar.tsx';
import HomePage from './pages/HomePage.tsx';
import SearchPage from './pages/SearchPage.tsx';
import ResultPage from './pages/ResultPage.tsx';

import LoginPage from './pages/LoginPage.tsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import AdminHome from './pages/admin/AdminHome.tsx';
import AdminLocations from './pages/admin/AdminLocations.tsx';
import AdminStops from './pages/admin/AdminStops.tsx';
import AdminRoutes from './pages/admin/AdminRoutes.tsx';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"       element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/login"  element={<LoginPage />} />
          
          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }>
            <Route index element={<AdminHome />} />
            <Route path="locations" element={<AdminLocations />} />
            <Route path="stops" element={<AdminStops />} />
            <Route path="routes" element={<AdminRoutes />} />
          </Route>

          <Route path="*"       element={
            <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
              <h2 style={{ fontSize: '3rem' }}>404</h2>
              <p style={{ color: 'var(--color-muted)', marginTop: '0.5rem' }}>Page not found.</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
