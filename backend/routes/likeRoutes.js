const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');

// Toggle like for a post (protected)
router.post('/post/:postId', requireAuth, likeController.toggleLike);

// Get like count and status for a post
router.get('/post/:postId', optionalAuth, likeController.getPostLikes);

module.exports = router;
