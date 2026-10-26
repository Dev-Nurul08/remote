import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(res.message);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setEmail('nurul@example.com');
      setPassword('password123');
    } else {
      setEmail('demo@example.com');
      setPassword('password123');
    }
    setError('');
  };

  return (
    <div className="auth-page-container">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', marginBottom: '12px' }}>
            <LogIn size={26} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to like, comment, and publish articles.</p>
        </div>

        <div className="demo-credentials-box">
          <div className="demo-credentials-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Quick Demo Credentials
            </span>
          </div>
          <p className="demo-credentials-text" style={{ marginBottom: '10px' }}>
            Click below to auto-fill pre-seeded credentials:
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('user')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px', flex: 1 }}
              id="btn-fill-demo-user"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px', flex: 1 }}
              id="btn-fill-demo-admin"
            >
              Admin Author
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-box alert-error" id="login-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id="login-form">
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="login-email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: '#64748b', padding: '4px' }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            disabled={loading}
            id="login-submit-button"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#94a3b8' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }} id="link-to-register">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
