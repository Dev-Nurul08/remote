const db = require('../config/db');

const isLikedByUser = async (postId, userId) => {
  if (!userId) return false;
  const [rows] = await db.query(
    'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
    [postId, userId]
  );
  return rows.length > 0;
};

const getCount = async (postId) => {
  const [rows] = await db.query(
    'SELECT COUNT(*) as total FROM likes WHERE post_id = ?',
    [postId]
  );
  return rows[0]?.total || 0;
};

const addLike = async (postId, userId) => {
  await db.query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
};

const removeLike = async (postId, userId) => {
  await db.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
};

module.exports = {
  isLikedByUser,
  getCount,
  addLike,
  removeLike
};
