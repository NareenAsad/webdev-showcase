import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-text">
          &copy; {currentYear} Users &amp; Posts Explorer. All rights reserved.
        </div>
        <div className="footer-links">
          <a href="https://jsonplaceholder.typicode.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            JSONPlaceholder API
          </a>
          <a href="#" className="footer-link">
            Privacy
          </a>
          <a href="#" className="footer-link">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
