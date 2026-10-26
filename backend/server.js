const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, getMode } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    db: getMode(),
    time: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Blog Backend Running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error'
  });
});

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Start error:', err);
  }
};

start();

module.exports = app;
