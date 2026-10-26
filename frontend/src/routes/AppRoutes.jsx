import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import Home from '../pages/Home';
import BlogDetails from '../pages/BlogDetails';
import CreatePost from '../pages/CreatePost';
import EditPost from '../pages/EditPost';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import About from '../pages/About';

const NotFound = () => (
  <div className="glass-card" style={{ maxWidth: '480px', margin: '60px auto', padding: '40px 24px', textAlign: 'center' }}>
    <h1 style={{ fontSize: '3rem', color: '#6366f1', marginBottom: '8px' }}>404</h1>
    <h2 style={{ marginBottom: '12px' }}>Page Not Found</h2>
    <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
      The page you requested does not exist or has been moved.
    </p>
    <Link to="/" className="btn-primary" id="btn-404-home">
      Back to Home
    </Link>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
