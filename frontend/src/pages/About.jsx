import React from 'react';
import { Database, Server, Layout, ShieldCheck, Heart, Users, Sparkles, Code2 } from 'lucide-react';

const About = () => {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="hero-pill" style={{ marginBottom: '16px' }}>
          <Sparkles size={14} color="#2563eb" />
          <span>About DevPulse</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
          Empowering Developers & <span style={{ color: '#2563eb' }}>Technical Writers</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
          DevPulse is a full-featured blogging and community publishing platform engineered to share knowledge, engineering tutorials, and technical insights.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div className="glass-card" style={{ padding: '26px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid #dbeafe'
          }}>
            <Layout size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Interactive User Interface
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Built using modern React, responsive flex/grid layouts, clean typography, live interaction counters, and fast client-side navigation.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '26px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#f5f3ff',
            color: '#7c3aed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid #ddd6fe'
          }}>
            <Server size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Robust RESTful Backend
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Engineered with Node.js and Express, following human controller-model architecture, JWT token middleware, and Google OAuth compatibility.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '26px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid #a7f3d0'
          }}>
            <Database size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Relational MySQL Engine
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Normalized relational database structure with foreign keys, ON DELETE CASCADE integrity, user metrics aggregation, and connection pooling.
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={22} color="#059669" />
          <span>Core Capabilities & Features</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Google OAuth & Password
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.5' }}>
              One-click Google authentication and secure bcrypt-hashed email registration.
            </p>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Full CRUD Publishing
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.5' }}>
              Write, edit, and delete your own articles with category tagging and image presets.
            </p>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Likes & Discussions
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: '1.5' }}>
              Instant like toggles, comment discussion feeds, and profile history review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
