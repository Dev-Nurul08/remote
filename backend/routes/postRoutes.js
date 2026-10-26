const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');

// Get all posts (public, search/filter)
router.get('/', postController.getAllPosts);

// Get single post by id (with optional user context for like detection)
router.get('/:id', optionalAuth, postController.getPostById);

// Create new post (protected)
router.post('/', requireAuth, postController.createPost);

// Update post (protected)
router.put('/:id', requireAuth, postController.updatePost);

// Delete post (protected)
router.delete('/:id', requireAuth, postController.deletePost);

module.exports = router;
