import React, { useState } from 'react';
import SearchControls from './components/SearchControls';
import UserDirectory from './components/UserDirectory';

export default function App() {
  const [apiUrl, setApiUrl] = useState('https://jsonplaceholder.typicode.com/users');
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="app-container">
      {/* Title Header Section */}
      <header className="app-header">
        <h1 className="app-title">User Directory</h1>
        <p className="app-subtitle">
          Live searching the directory database with React hooks and glassmorphism.
        </p>
      </header>

      {/* Sibling Controller Component (Lifting State Up Demonstration) */}
      <SearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        pageSize={pageSize}
        setPageSize={setPageSize}
        apiUrl={apiUrl}
        setApiUrl={setApiUrl}
      />

      {/* Main Directory List Component */}
      <main>
        <UserDirectory
          apiUrl={apiUrl}
          pageSize={pageSize}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </main>

      {/* Footer Branding */}
      <footer className="app-footer">
        <p>Live Search Directory — Built with React & Vite</p>
      </footer>
    </div>
  );
}
