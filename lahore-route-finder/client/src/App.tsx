import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import Navbar from './components/Navbar.tsx';
import HomePage from './pages/HomePage.tsx';
import SearchPage from './pages/SearchPage.tsx';
import ResultPage from './pages/ResultPage.tsx';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"       element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/result" element={<ResultPage />} />
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
