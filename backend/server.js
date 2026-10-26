const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase, getDbType } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development & ease of testing
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

// System Health & Diagnostics route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    message: 'College Blog Project API is running smoothly',
    databaseEngine: getDbType().toUpperCase(),
    timestamp: new Date().toISOString()
  });
});

// Root API Welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Full-Stack Blog Website API (React + Node + Express + MySQL)',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/register, /api/auth/login, /api/auth/me',
      posts: '/api/posts (GET, POST), /api/posts/:id (GET, PUT, DELETE)',
      comments: '/api/comments/post/:postId (GET, POST), /api/comments/:id (DELETE)',
      likes: '/api/likes/post/:postId (POST toggle, GET count)'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server and Database
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 College Blog Project Backend Server Started!`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`💾 Database Engine: ${getDbType().toUpperCase()}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
