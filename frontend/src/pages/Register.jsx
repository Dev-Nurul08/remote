import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthModal, { GoogleIcon } from '../components/GoogleAuthModal';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await register(name.trim(), email.trim(), password, bio.trim());
    setLoading(false);

    if (res.success) {
      navigate('/', { replace: true });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-header">
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            marginBottom: '14px',
            border: '1px solid #a7f3d0'
          }}>
            <UserPlus size={26} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register to write articles, leave feedback, and interact with authors.</p>
        </div>

        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="btn-google"
          id="btn-google-register"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        <div className="auth-divider">
          <span>or register with email</span>
        </div>

        {error && (
          <div className="alert-box alert-error" id="register-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id="register-form">
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="register-name">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#7c3aed' }} />
              <input
                id="register-name"
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="register-email">Gmail or Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#2563eb' }} />
              <input
                id="register-email"
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '42px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="register-password">Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#d97706' }} />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="register-confirm-password">Confirm *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#d97706' }} />
                <input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="register-bio">Short Bio (Optional)</label>
            <div style={{ position: 'relative' }}>
              <FileText size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#64748b' }} />
              <textarea
                id="register-bio"
                placeholder="Software engineer and tech enthusiast..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ paddingLeft: '42px', minHeight: '68px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            disabled={loading}
            id="register-submit-button"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }} id="link-to-login">
            Sign In
          </Link>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={() => navigate('/', { replace: true })}
      />
    </div>
  );
};

export default Register;
