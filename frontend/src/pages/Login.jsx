import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthModal, { GoogleIcon } from '../components/GoogleAuthModal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

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

    const res = await login(email.trim(), password);
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
      <div className="auth-card">
        <div className="auth-header">
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            marginBottom: '14px',
            border: '1px solid #dbeafe'
          }}>
            <LogIn size={26} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to read, like, comment, and publish articles.</p>
        </div>

        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="btn-google"
          id="btn-google-login"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        <div className="auth-divider">
          <span>or sign in with email</span>
        </div>

        {error && (
          <div className="alert-box alert-error" id="login-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id="login-form">
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="login-email">Email or Gmail</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#2563eb' }} />
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
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#d97706' }} />
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
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  padding: '4px',
                  cursor: 'pointer'
                }}
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

        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
            Quick Demo Accounts:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('user')}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 10px', flex: 1 }}
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 10px', flex: 1 }}
            >
              Admin Author
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#64748b' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: 600 }} id="link-to-register">
            Create an account
          </Link>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={() => navigate(redirectPath, { replace: true })}
      />
    </div>
  );
};

export default Login;
