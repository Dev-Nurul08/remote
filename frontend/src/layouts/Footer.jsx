import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Database, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div className="nav-brand" style={{ marginBottom: '8px' }}>
            <div className="nav-brand-icon">
              <BookOpen size={18} />
            </div>
            <span>
              Dev<span className="gradient-text">Pulse</span>
            </span>
          </div>
          <p className="footer-brand-desc">
            Full-stack blog platform built with React, Node.js, Express, and MySQL. Features authentication, real-time likes, and discussions.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
            <Database size={16} color="#6366f1" />
            <span>Database: MySQL with foreign key cascades</span>
          </div>
        </div>

        <div>
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Articles</Link></li>
            <li><Link to="/create" className="footer-link">Publish Post</Link></li>
            <li><Link to="/about" className="footer-link">Architecture</Link></li>
            <li><Link to="/login" className="footer-link">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title">Stack Details</h4>
          <ul className="footer-links">
            <li><span className="footer-link">JWT Authentication</span></li>
            <li><span className="footer-link">Bcrypt Hashing</span></li>
            <li><span className="footer-link">REST API</span></li>
            <li><span className="footer-link">MySQL Relational DB</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          Built with <Heart size={14} color="#f43f5e" style={{ display: 'inline', verticalAlign: 'middle' }} /> by <strong>Dev-Nurul</strong>
        </div>
        <div className="tech-badges">
          <span className="tech-badge">React</span>
          <span className="tech-badge">Node.js</span>
          <span className="tech-badge">Express</span>
          <span className="tech-badge">MySQL</span>
          <span className="tech-badge">JWT</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
