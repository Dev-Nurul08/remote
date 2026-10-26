const db = require('../config/db');

// -------------------------------------------------------------
// Toggle Like (Like / Unlike)
// -------------------------------------------------------------
exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    // Verify post exists
    const [posts] = await db.query('SELECT id FROM posts WHERE id = ?', [postId]);
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    // Check if user already liked this post
    const [existing] = await db.query(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    let isLiked = false;

    if (existing.length > 0) {
      // Unlike: remove like
      await db.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
      isLiked = false;
    } else {
      // Like: insert like
      await db.query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
      isLiked = true;
    }

    // Get updated like count
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM likes WHERE post_id = ?',
      [postId]
    );
    const likesCount = countResult[0].total;

    return res.status(200).json({
      success: true,
      message: isLiked ? 'Post liked!' : 'Post unliked.',
      is_liked: isLiked,
      likes_count: likesCount
    });
  } catch (err) {
    console.error('Error toggling like:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update like status.'
    });
  }
};

// -------------------------------------------------------------
// Get Like Status for a Post
// -------------------------------------------------------------
exports.getPostLikes = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user ? req.user.id : null;

    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM likes WHERE post_id = ?',
      [postId]
    );
    const likesCount = countResult[0].total;

    let isLiked = false;
    if (userId) {
      const [userLike] = await db.query(
        'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      isLiked = userLike.length > 0;
    }

    return res.status(200).json({
      success: true,
      likes_count: likesCount,
      is_liked: isLiked
    });
  } catch (err) {
    console.error('Error fetching post likes:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve like status.'
    });
  }
};
