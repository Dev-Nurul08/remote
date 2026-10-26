const db = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, name, email, bio, role, avatar, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

const createUser = async (name, email, password, bio) => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, bio, role) VALUES (?, ?, ?, ?, "user")',
    [name, email, password, bio || 'Web enthusiast']
  );
  return result.insertId;
};

const updateProfile = async (id, name, bio) => {
  await db.query('UPDATE users SET name = ?, bio = ? WHERE id = ?', [name, bio, id]);
};

const getUserStats = async (userId) => {
  const [postRows] = await db.query('SELECT COUNT(*) as totalPosts FROM posts WHERE author_id = ?', [userId]);
  const [likeRows] = await db.query('SELECT COUNT(*) as totalLikes FROM likes WHERE user_id = ?', [userId]);
  const [commentRows] = await db.query('SELECT COUNT(*) as totalComments FROM comments WHERE user_id = ?', [userId]);

  return {
    totalPosts: postRows[0]?.totalPosts || 0,
    totalLikesGiven: likeRows[0]?.totalLikes || 0,
    totalComments: commentRows[0]?.totalComments || 0
  };
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateProfile,
  getUserStats
};
