import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout?: () => void;
}

export const Navbar = ({ isLoggedIn, onLogout }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          TikTok Summarizer
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mobile-menu-button"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="nav-link">Sign Up</Link>
              <Link to="/signin" className="nav-link">Sign In</Link>
            </>
          ) : (
            <>
              <Link to="/account" className="nav-link">My Account</Link>
              <button 
                onClick={onLogout}
                className="nav-link logout-button"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}; 