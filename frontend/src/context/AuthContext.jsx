import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize Auth from localStorage on application load
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('blog_auth_token');
      const savedUser = localStorage.getItem('blog_auth_user');

      if (savedToken) {
        setToken(savedToken);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            console.error('Failed to parse cached user:', e);
          }
        }

        // Verify token with backend
        try {
          const res = await authAPI.getMe();
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('blog_auth_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Stored token was invalid or expired. Resetting session.');
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await authAPI.login({ email, password });
      if (res.data && res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        
        setToken(receivedToken);
        setUser(receivedUser);

        localStorage.setItem('blog_auth_token', receivedToken);
        localStorage.setItem('blog_auth_user', JSON.stringify(receivedUser));

        return { success: true, message: res.data.message || 'Login successful!' };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please verify your credentials.';
      setAuthError(message);
      return { success: false, message };
    }
  };

  // Registration handler
  const register = async (name, email, password, bio = '') => {
    setAuthError(null);
    try {
      const res = await authAPI.register({ name, email, password, bio });
      if (res.data && res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;

        setToken(receivedToken);
        setUser(receivedUser);

        localStorage.setItem('blog_auth_token', receivedToken);
        localStorage.setItem('blog_auth_user', JSON.stringify(receivedUser));

        return { success: true, message: res.data.message || 'Registration successful!' };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please check inputs.';
      setAuthError(message);
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('blog_auth_token');
    localStorage.removeItem('blog_auth_user');
  };

  // Update User Profile in Context
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('blog_auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  const clearError = () => setAuthError(null);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    authError,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook to consume Auth Context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
