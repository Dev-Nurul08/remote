import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GitBranch, Database, Code, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Information */}
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
            A full-stack, enterprise-grade college project blog application featuring JWT authentication, relational MySQL schema design, real-time likes, and threaded comments.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
            <Database size={16} color="#6366f1" />
            <span>Database: MySQL (InnoDB with Foreign Keys & Cascades)</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">All Articles</Link></li>
            <li><Link to="/create" className="footer-link">Publish Post</Link></li>
            <li><Link to="/about" className="footer-link">System Architecture</Link></li>
            <li><Link to="/login" className="footer-link">Login & Demo Portal</Link></li>
          </ul>
        </div>

        {/* College Project Architecture */}
        <div>
          <h4 className="footer-col-title">College Modules</h4>
          <ul className="footer-links">
            <li><span className="footer-link">JWT Stateless Auth</span></li>
            <li><span className="footer-link">Bcrypt Salt Hashing</span></li>
            <li><span className="footer-link">Relational DB Cascades</span></li>
            <li><span className="footer-link">RESTful Express Routing</span></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div>
          Created with <Heart size={14} color="#f43f5e" style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> by <strong>Dev-Nurul</strong> for Full-Stack Project Submission.
        </div>
        <div className="tech-badges">
          <span className="tech-badge">React + Vite</span>
          <span className="tech-badge">Node.js Express</span>
          <span className="tech-badge">MySQL 8.0</span>
          <span className="tech-badge">JWT Authentication</span>
          <span className="tech-badge">REST API</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
