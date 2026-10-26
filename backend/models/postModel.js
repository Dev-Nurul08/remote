const db = require('../config/db');

const getAll = async (search, category, authorId) => {
  let sql = `
    SELECT 
      p.id, 
      p.title, 
      p.summary, 
      p.category, 
      p.tags, 
      p.cover_image, 
      p.read_time, 
      p.author_id, 
      p.created_at, 
      p.updated_at,
      u.name AS author_name,
      u.email AS author_email,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE 1=1
  `;

  const params = [];

  if (search) {
    sql += ' AND (p.title LIKE ? OR p.summary LIKE ? OR p.content LIKE ?)';
    const q = `%${search}%`;
    params.push(q, q, q);
  }

  if (category && category !== 'All') {
    sql += ' AND p.category = ?';
    params.push(category);
  }

  if (authorId) {
    sql += ' AND p.author_id = ?';
    params.push(authorId);
  }

  sql += ' ORDER BY p.created_at DESC';

  const [rows] = await db.query(sql, params);
  return rows;
};

const getById = async (id) => {
  const sql = `
    SELECT 
      p.id, 
      p.title, 
      p.summary, 
      p.content, 
      p.category, 
      p.tags, 
      p.cover_image, 
      p.read_time, 
      p.author_id, 
      p.created_at, 
      p.updated_at,
      u.name AS author_name,
      u.email AS author_email,
      u.bio AS author_bio,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.id = ?
  `;

  const [rows] = await db.query(sql, [id]);
  return rows[0];
};

const create = async (postData) => {
  const { title, summary, content, category, tags, cover_image, read_time, author_id } = postData;
  const sql = `
    INSERT INTO posts (title, summary, content, category, tags, cover_image, read_time, author_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [res] = await db.query(sql, [title, summary, content, category, tags, cover_image, read_time, author_id]);
  return res.insertId;
};

const update = async (id, postData) => {
  const { title, summary, content, category, tags, cover_image, read_time } = postData;
  const sql = `
    UPDATE posts 
    SET title = ?, summary = ?, content = ?, category = ?, tags = ?, cover_image = ?, read_time = ?
    WHERE id = ?
  `;

  await db.query(sql, [title, summary, content, category, tags, cover_image, read_time, id]);
};

const remove = async (id) => {
  await db.query('DELETE FROM posts WHERE id = ?', [id]);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
