import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  isLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/test-dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFoldersOpen, setIsFoldersOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          TikTok Summarizer
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button 
        className="mobile-menu-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
      >
        ☰
      </button>

      <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/test-dashboard" className="navbar-link">
          Dashboard
        </Link>

        {/* Desktop Folders Menu */}
        {isDashboard && (
          <>
            {/* Desktop View */}
            <div className="navbar-menu desktop-only">
              <button 
                className="menu-trigger"
                onClick={() => setIsFoldersOpen(!isFoldersOpen)}
                aria-expanded={isFoldersOpen}
              >
                Folders <span className="menu-arrow">▼</span>
              </button>
              <ul className={`dropdown-menu ${isFoldersOpen ? 'show' : ''}`}>
                <li><Link to="/test-dashboard">All Videos</Link></li>
                <li><Link to="/test-dashboard?status=processing">Processing</Link></li>
                <li><Link to="/test-dashboard?status=completed">Completed</Link></li>
              </ul>
            </div>

            {/* Mobile View */}
            <div className="mobile-folders mobile-only">
              <button 
                className="mobile-submenu-trigger"
                onClick={() => setIsFoldersOpen(!isFoldersOpen)}
              >
                Folders <span className={`menu-arrow ${isFoldersOpen ? 'open' : ''}`}>▼</span>
              </button>
              <ul className={`mobile-submenu ${isFoldersOpen ? 'show' : ''}`}>
                <li><Link to="/test-dashboard">All Videos</Link></li>
                <li><Link to="/test-dashboard?status=processing">Processing</Link></li>
                <li><Link to="/test-dashboard?status=completed">Completed</Link></li>
              </ul>
            </div>
          </>
        )}

        <div className="auth-links">
          {!isLoggedIn ? (
            <>
              <Link to="/sign-up" className="navbar-link">Sign Up</Link>
              <Link to="/sign-in" className="navbar-link">Sign In</Link>
            </>
          ) : (
            <button className="navbar-link" onClick={() => {}}>Sign Out</button>
          )}
        </div>
      </div>
    </nav>
  );
}; 