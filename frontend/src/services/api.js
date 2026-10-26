import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  googleAuth: (data) => api.post('/auth/google', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const postAPI = {
  getAll: (params) => api.get('/posts', { params }),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`)
};

export const commentAPI = {
  getByPost: (postId) => api.get(`/comments/post/${postId}`),
  getMyComments: () => api.get('/comments/my-comments'),
  add: (postId, data) => api.post(`/comments/post/${postId}`, data),
  delete: (id) => api.delete(`/comments/${id}`)
};

export const likeAPI = {
  toggle: (postId) => api.post(`/likes/post/${postId}`),
  getLikes: (postId) => api.get(`/likes/post/${postId}`)
};

export default api;
