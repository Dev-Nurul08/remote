const db = require('../config/db');

// -------------------------------------------------------------
// Get Comments for a Post
// -------------------------------------------------------------
exports.getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const query = `
      SELECT 
        c.id, 
        c.post_id, 
        c.user_id, 
        c.content, 
        c.created_at,
        u.name AS user_name,
        u.avatar AS user_avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `;

    const [comments] = await db.query(query, [postId]);

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (err) {
    console.error('Error fetching comments:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve comments.'
    });
  }
};

// -------------------------------------------------------------
// Add New Comment
// -------------------------------------------------------------
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty.'
      });
    }

    // Verify post exists
    const [posts] = await db.query('SELECT id FROM posts WHERE id = ?', [postId]);
    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cannot comment: Blog post not found.'
      });
    }

    const insertSql = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(insertSql, [postId, userId, content.trim()]);
    const newCommentId = result.insertId;

    // Fetch the inserted comment with user details
    const [inserted] = await db.query(`
      SELECT 
        c.id, 
        c.post_id, 
        c.user_id, 
        c.content, 
        c.created_at,
        u.name AS user_name,
        u.avatar AS user_avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [newCommentId]);

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully!',
      comment: inserted[0]
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to post comment.'
    });
  }
};

// -------------------------------------------------------------
// Delete Comment
// -------------------------------------------------------------
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const [existing] = await db.query('SELECT user_id, post_id FROM comments WHERE id = ?', [commentId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.'
      });
    }

    // Allow deletion if user is comment author or admin
    if (existing[0].user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete your own comments.'
      });
    }

    await db.query('DELETE FROM comments WHERE id = ?', [commentId]);

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully!'
    });
  } catch (err) {
    console.error('Error deleting comment:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete comment.'
    });
  }
};
