const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { requireAuth, optionalAuth } = require('../middlewares/authMiddleware');

router.get('/', postController.getAllPosts);
router.get('/:id', optionalAuth, postController.getPostById);
router.post('/', requireAuth, postController.createPost);
router.put('/:id', requireAuth, postController.updatePost);
router.delete('/:id', requireAuth, postController.deletePost);

module.exports = router;
