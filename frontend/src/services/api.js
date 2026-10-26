import axios from 'axios';

// Detect API base URL: works both with Vite proxy and direct backend port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('blog_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired / unauthorized, clear token if necessary
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');
      if (!isLoginRequest && localStorage.getItem('blog_auth_token')) {
        console.warn('Session expired. Please log in again.');
        // We let the AuthContext handle state or re-login
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Posts Endpoints
export const postAPI = {
  getAll: (params) => api.get('/posts', { params }),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

// Comments Endpoints
export const commentAPI = {
  getByPost: (postId) => api.get(`/comments/post/${postId}`),
  add: (postId, data) => api.post(`/comments/post/${postId}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Likes Endpoints
export const likeAPI = {
  toggle: (postId) => api.post(`/likes/post/${postId}`),
  getLikes: (postId) => api.get(`/likes/post/${postId}`),
};

// Health Check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
