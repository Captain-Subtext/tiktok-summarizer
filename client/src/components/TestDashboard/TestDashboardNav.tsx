import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const TestDashboardNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dashboard-nav') && !target.closest('.hamburger-button')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <div 
        className={`nav-overlay ${isMenuOpen ? 'visible' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <nav 
        className={`dashboard-nav ${isMenuOpen ? 'open' : ''}`}
      >
        <div className="folders-section">
          <div className="folders-header">
            <h2>Folders</h2>
            <button className="add-folder-button">+</button>
          </div>
          <ul className="folders-list">
            <li><Link to="/test-dashboard">All Videos</Link></li>
            <li><Link to="/test-dashboard?status=processing">Processing</Link></li>
            <li><Link to="/test-dashboard?status=completed">Completed</Link></li>
          </ul>
        </div>
      </nav>
    </>
  );
}; 