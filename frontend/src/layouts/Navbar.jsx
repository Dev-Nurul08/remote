import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenSquare, LogOut, BookOpen, Layers } from 'lucide-react';
import { getInitials } from '../utils/helpers';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-brand" id="nav-brand-logo">
          <div className="nav-brand-icon">
            <BookOpen size={20} />
          </div>
          <span>
            Dev<span className="gradient-text">Pulse</span>
          </span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-link-home">
                Articles
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink to="/create" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-link-create">
                  <PenSquare size={16} /> Write Post
                </NavLink>
              </li>
            )}
            <li>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} id="nav-link-about">
                <Layers size={16} /> Docs
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-user">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/create" className="btn-primary" id="nav-btn-write" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <PenSquare size={16} /> New Article
              </Link>

              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} id="nav-user-profile-link" title="My Profile">
                <div className="user-avatar-badge">
                  {getInitials(user?.name)}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </Link>

              <button 
                onClick={handleLogout} 
                className="btn-icon" 
                title="Logout"
                id="nav-btn-logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn-secondary" id="nav-btn-login" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" id="nav-btn-register" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
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
