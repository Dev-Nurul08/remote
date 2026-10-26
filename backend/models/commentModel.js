const db = require('../config/db');

const getByPostId = async (postId) => {
  const sql = `
    SELECT 
      c.id, 
      c.post_id, 
      c.user_id, 
      c.content, 
      c.created_at,
      u.name AS user_name
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at DESC
  `;

  const [rows] = await db.query(sql, [postId]);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM comments WHERE id = ?', [id]);
  return rows[0];
};

const create = async (postId, userId, content) => {
  const [res] = await db.query(
    'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
    [postId, userId, content]
  );
  return res.insertId;
};

const remove = async (id) => {
  await db.query('DELETE FROM comments WHERE id = ?', [id]);
};

module.exports = {
  getByPostId,
  getById,
  create,
  remove
};
