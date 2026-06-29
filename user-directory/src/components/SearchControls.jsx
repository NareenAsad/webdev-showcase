import React from 'react';

export default function SearchControls({
  searchTerm,
  setSearchTerm,
  pageSize,
  setPageSize,
  apiUrl,
  setApiUrl
}) {
  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="controls-panel">
      {/* Search Input Box */}
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Search SVG Icon */}
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      {/* Control Actions & Toggles */}
      <div className="controls-actions">
        {/* API Switcher for testing errors */}
        <div className="select-wrapper">
          <span className="select-label">Data Source:</span>
          <select
            className="custom-select"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          >
            <option value="https://jsonplaceholder.typicode.com/users">
              JSONPlaceholder Users (Success)
            </option>
            <option value="https://jsonplaceholder.typicode.com/invalid-route-error">
              Broken Endpoint (Simulate Error)
            </option>
          </select>
        </div>

        {/* Page Size Selection */}
        <div className="select-wrapper">
          <span className="select-label">Page Size:</span>
          <select
            className="custom-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={3}>3 Users</option>
            <option value={5}>5 Users</option>
            <option value={10}>10 Users</option>
            <option value={15}>15 Users</option>
          </select>
        </div>

        {/* Clear Search Button (Visible only when search contains text) */}
        {searchTerm && (
          <button className="btn btn-secondary" onClick={handleClear}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Clear Search
          </button>
        )}
      </div>
    </div>
  );
}
