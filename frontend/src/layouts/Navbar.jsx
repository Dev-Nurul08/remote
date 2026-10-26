import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, PenSquare, TrendingUp, Grid, Compass, 
  LogOut, User as UserIcon, MessageSquare 
} from 'lucide-react';
import { getInitials } from '../utils/helpers';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-brand" id="nav-brand-logo">
          <div className="nav-brand-icon">
            <BookOpen size={20} />
          </div>
          <span style={{ fontWeight: 800 }}>
            Dev<span style={{ color: '#2563eb' }}>Pulse</span>
          </span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/" 
                end 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                id="nav-link-articles"
              >
                <BookOpen size={16} color="#2563eb" />
                <span>Articles</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/?filter=trending" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                id="nav-link-trending"
              >
                <TrendingUp size={16} color="#d97706" />
                <span>Trending</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/?filter=categories" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                id="nav-link-categories"
              >
                <Grid size={16} color="#7c3aed" />
                <span>Categories</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/about" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                id="nav-link-explore"
              >
                <Compass size={16} color="#059669" />
                <span>About</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-user">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
              <Link 
                to="/create" 
                className="btn-success" 
                id="nav-btn-write" 
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                <PenSquare size={16} />
                <span>Write Post</span>
              </Link>

              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: '1px solid #e2e8f0',
                    borderRadius: '24px',
                    padding: '4px 10px 4px 4px',
                    cursor: 'pointer'
                  }}
                  id="nav-user-menu-btn"
                >
                  <div className="user-avatar-badge">
                    {getInitials(user?.name)}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '46px',
                    width: '200px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '8px',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        fontSize: '0.88rem',
                        color: '#334155',
                        borderRadius: '6px',
                        fontWeight: 500
                      }}
                      className="nav-dropdown-item"
                    >
                      <UserIcon size={16} color="#2563eb" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/profile?tab=comments"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        fontSize: '0.88rem',
                        color: '#334155',
                        borderRadius: '6px',
                        fontWeight: 500
                      }}
                      className="nav-dropdown-item"
                    >
                      <MessageSquare size={16} color="#d97706" />
                      <span>My Comments</span>
                    </Link>

                    <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }} />

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        fontSize: '0.88rem',
                        color: '#e11d48',
                        borderRadius: '6px',
                        fontWeight: 500,
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={16} color="#e11d48" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link 
                to="/login" 
                className="btn-secondary" 
                id="nav-btn-login" 
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn-primary" 
                id="nav-btn-register" 
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
