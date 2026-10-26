import React from 'react';
import { Database, Server, Layout, FileCode } from 'lucide-react';

const About = () => {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="category-badge" style={{ marginBottom: '12px' }}>
          College Project Documentation
        </span>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '16px' }}>
          Full-Stack Blog System <span className="gradient-text">Architecture</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '720px', margin: '0 auto' }}>
          System documentation explaining design, relational database modeling, stateless JWT authentication, and component structure.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Layout size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Frontend (React + Vite)</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Built using modular functional components, React Context for global authentication state, client-side routing with React Router, and Axios API interceptors.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Server size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Backend (Node + Express)</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Structured with controllers, models, routes, token-verification middlewares, and parameterized SQL queries against SQL injection.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Database size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Database (MySQL 8.0)</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Relational InnoDB engine with foreign keys (ON DELETE CASCADE), unique constraints for likes and emails, and dual-engine fallback.
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '36px', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Database size={22} color="#6366f1" />
          <span>Relational Database Modeling</span>
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '0.95rem' }}>
          The schema contains 4 normalized tables with strict relational integrity:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: '#818cf8' }}>users Table</strong>
            <ul style={{ listStyle: 'none', marginTop: '8px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.8' }}>
              <li>• id (INT PK AI)</li>
              <li>• name (VARCHAR)</li>
              <li>• email (VARCHAR UNIQUE)</li>
              <li>• password (BCRYPT HASH)</li>
              <li>• role (VARCHAR)</li>
              <li>• created_at (TIMESTAMP)</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: '#a78bfa' }}>posts Table</strong>
            <ul style={{ listStyle: 'none', marginTop: '8px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.8' }}>
              <li>• id (INT PK AI)</li>
              <li>• title (VARCHAR)</li>
              <li>• content (LONGTEXT)</li>
              <li>• category (VARCHAR)</li>
              <li>• cover_image (VARCHAR)</li>
              <li>• author_id (FK → users.id)</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: '#f472b6' }}>comments Table</strong>
            <ul style={{ listStyle: 'none', marginTop: '8px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.8' }}>
              <li>• id (INT PK AI)</li>
              <li>• post_id (FK → posts.id)</li>
              <li>• user_id (FK → users.id)</li>
              <li>• content (TEXT)</li>
              <li>• created_at (TIMESTAMP)</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: '#34d399' }}>likes Table</strong>
            <ul style={{ listStyle: 'none', marginTop: '8px', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.8' }}>
              <li>• id (INT PK AI)</li>
              <li>• post_id (FK → posts.id)</li>
              <li>• user_id (FK → users.id)</li>
              <li>• UNIQUE(post_id, user_id)</li>
              <li>• created_at (TIMESTAMP)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '36px', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileCode size={22} color="#8b5cf6" />
          <span>REST API Endpoints</span>
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: '#818cf8' }}>
                <th style={{ padding: '10px' }}>Method</th>
                <th style={{ padding: '10px' }}>Endpoint</th>
                <th style={{ padding: '10px' }}>Access</th>
                <th style={{ padding: '10px' }}>Description</th>
              </tr>
            </thead>
            <tbody style={{ color: '#cbd5e1' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px' }}><span style={{ color: '#34d399', fontWeight: 700 }}>POST</span></td>
                <td style={{ padding: '10px' }}><code>/api/auth/register</code></td>
                <td style={{ padding: '10px' }}>Public</td>
                <td style={{ padding: '10px' }}>Register new user</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px' }}><span style={{ color: '#34d399', fontWeight: 700 }}>POST</span></td>
                <td style={{ padding: '10px' }}><code>/api/auth/login</code></td>
                <td style={{ padding: '10px' }}>Public</td>
                <td style={{ padding: '10px' }}>User login & JWT issuance</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px' }}><span style={{ color: '#60a5fa', fontWeight: 700 }}>GET</span></td>
                <td style={{ padding: '10px' }}><code>/api/posts</code></td>
                <td style={{ padding: '10px' }}>Public</td>
                <td style={{ padding: '10px' }}>Get all posts with filters</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px' }}><span style={{ color: '#60a5fa', fontWeight: 700 }}>GET</span></td>
                <td style={{ padding: '10px' }}><code>/api/posts/:id</code></td>
                <td style={{ padding: '10px' }}>Optional Auth</td>
                <td style={{ padding: '10px' }}>Get post details with comments & like state</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px' }}><span style={{ color: '#34d399', fontWeight: 700 }}>POST</span></td>
                <td style={{ padding: '10px' }}><code>/api/posts</code></td>
                <td style={{ padding: '10px' }}>JWT Bearer</td>
                <td style={{ padding: '10px' }}>Publish new blog post</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px' }}><span style={{ color: '#fbbf24', fontWeight: 700 }}>PUT</span></td>
                <td style={{ padding: '10px' }}><code>/api/posts/:id</code></td>
                <td style={{ padding: '10px' }}>JWT (Author)</td>
                <td style={{ padding: '10px' }}>Update existing post</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px' }}><span style={{ color: '#f87171', fontWeight: 700 }}>DELETE</span></td>
                <td style={{ padding: '10px' }}><code>/api/posts/:id</code></td>
                <td style={{ padding: '10px' }}>JWT (Author)</td>
                <td style={{ padding: '10px' }}>Delete post and relations</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px' }}><span style={{ color: '#34d399', fontWeight: 700 }}>POST</span></td>
                <td style={{ padding: '10px' }}><code>/api/likes/post/:postId</code></td>
                <td style={{ padding: '10px' }}>JWT Bearer</td>
                <td style={{ padding: '10px' }}>Toggle post like</td>
              </tr>
              <tr>
                <td style={{ padding: '10px' }}><span style={{ color: '#34d399', fontWeight: 700 }}>POST</span></td>
                <td style={{ padding: '10px' }}><code>/api/comments/post/:postId</code></td>
                <td style={{ padding: '10px' }}>JWT Bearer</td>
                <td style={{ padding: '10px' }}>Add comment</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default About;
