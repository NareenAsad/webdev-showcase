import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';

// Register the service worker
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
