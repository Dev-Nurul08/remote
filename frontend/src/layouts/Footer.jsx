import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Database, Heart, ShieldCheck, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div className="nav-brand" style={{ marginBottom: '8px' }}>
            <div className="nav-brand-icon">
              <BookOpen size={18} />
            </div>
            <span style={{ fontWeight: 800 }}>
              Dev<span style={{ color: '#2563eb' }}>Pulse</span>
            </span>
          </div>
          <p className="footer-brand-desc">
            A modern full-stack blogging platform built with React, Node.js, Express, and MySQL. Features OAuth sign-in, article publishing, interactive likes, and discussion threads.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.86rem', color: '#64748b' }}>
            <Database size={16} color="#2563eb" />
            <span>Relational MySQL Database with Cascade Constraints</span>
          </div>
        </div>

        <div>
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">All Articles</Link></li>
            <li><Link to="/?filter=trending" className="footer-link">Trending Posts</Link></li>
            <li><Link to="/?filter=categories" className="footer-link">Categories</Link></li>
            <li><Link to="/create" className="footer-link">Write Article</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title">Technology</h4>
          <ul className="footer-links">
            <li><span className="footer-link">Google OAuth & JWT</span></li>
            <li><span className="footer-link">Bcrypt Password Hashing</span></li>
            <li><span className="footer-link">Express REST API</span></li>
            <li><span className="footer-link">MySQL Connection Pool</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          Built with <Heart size={14} color="#e11d48" style={{ display: 'inline', verticalAlign: 'middle' }} /> by <strong>Dev-Nurul</strong>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#64748b' }}>
            <ShieldCheck size={14} color="#059669" /> Secure Auth
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#64748b' }}>
            <Code2 size={14} color="#2563eb" /> Clean Architecture
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
