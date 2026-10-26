const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { requireAuth } = require('../middleware/authMiddleware');

// Get comments for a post
router.get('/post/:postId', commentController.getCommentsByPost);

// Add comment to a post (protected)
router.post('/post/:postId', requireAuth, commentController.addComment);

// Delete comment (protected)
router.delete('/:id', requireAuth, commentController.deleteComment);

module.exports = router;
