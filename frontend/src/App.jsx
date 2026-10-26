import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import BlogDetails from './pages/BlogDetails';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import About from './pages/About';

// 404 Fallback Page
const NotFound = () => (
  <div className="glass-card" style={{ maxWidth: '500px', margin: '60px auto', padding: '48px 24px', textAlign: 'center' }}>
    <h1 style={{ fontSize: '3rem', marginBottom: '8px', color: '#6366f1' }}>404</h1>
    <h2 style={{ marginBottom: '12px' }}>Page Not Found</h2>
    <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
      The page you requested does not exist or has been moved.
    </p>
    <Link to="/" className="btn-primary" id="btn-404-home">
      Back to Home
    </Link>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Authenticated Protected Routes */}
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

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
