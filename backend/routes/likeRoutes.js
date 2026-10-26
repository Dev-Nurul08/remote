const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { requireAuth, optionalAuth } = require('../middlewares/authMiddleware');

router.post('/post/:postId', requireAuth, likeController.toggleLike);
router.get('/post/:postId', optionalAuth, likeController.getPostLikes);

module.exports = router;
