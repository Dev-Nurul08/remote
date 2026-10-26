import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken) {
        setToken(savedToken);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {}
        }

        try {
          const res = await authAPI.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await authAPI.login({ email, password });
      if (res.data?.success) {
        const { token: jwt, user: userData } = res.data;

        setToken(jwt);
        setUser(userData);

        localStorage.setItem('token', jwt);
        localStorage.setItem('user', JSON.stringify(userData));

        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const loginWithGoogle = async (googleData) => {
    setAuthError(null);
    try {
      const res = await authAPI.googleAuth(googleData);
      if (res.data?.success) {
        const { token: jwt, user: userData } = res.data;

        setToken(jwt);
        setUser(userData);

        localStorage.setItem('token', jwt);
        localStorage.setItem('user', JSON.stringify(userData));

        return { success: true };
      }
      return { success: false, message: 'Google authentication failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Google authentication failed';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, bio = '') => {
    setAuthError(null);
    try {
      const res = await authAPI.register({ name, email, password, bio });
      if (res.data?.success) {
        const { token: jwt, user: userData } = res.data;

        setToken(jwt);
        setUser(userData);

        localStorage.setItem('token', jwt);
        localStorage.setItem('user', JSON.stringify(userData));

        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (fields) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const clearError = () => setAuthError(null);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    authError,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};

export default AuthContext;
