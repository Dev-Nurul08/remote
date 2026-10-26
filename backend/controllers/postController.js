const db = require('../config/db');

// Calculate estimated read time
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = (content || '').trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes || 1} min read`;
};

// -------------------------------------------------------------
// Get All Posts (with Search, Category filter, Likes & Comments counts)
// -------------------------------------------------------------
exports.getAllPosts = async (req, res) => {
  try {
    const { search, category, tag, authorId } = req.query;

    let query = `
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
        u.avatar AS author_avatar,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if (search && search.trim()) {
      query += ` AND (p.title LIKE ? OR p.summary LIKE ? OR p.content LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (category && category !== 'All') {
      query += ` AND p.category = ?`;
      params.push(category.trim());
    }

    if (tag && tag.trim()) {
      query += ` AND p.tags LIKE ?`;
      params.push(`%${tag.trim()}%`);
    }

    if (authorId) {
      query += ` AND p.author_id = ?`;
      params.push(authorId);
    }

    query += ` ORDER BY p.created_at DESC`;

    const [posts] = await db.query(query, params);

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog posts.'
    });
  }
};

// -------------------------------------------------------------
// Get Single Post By ID (Detailed View)
// -------------------------------------------------------------
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const currentUserId = req.user ? req.user.id : null;

    const postQuery = `
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
        u.avatar AS author_avatar,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
    `;

    const [posts] = await db.query(postQuery, [postId]);

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    const post = posts[0];

    // Check if the currently logged-in user liked this post
    let isLikedByUser = false;
    if (currentUserId) {
      const [userLike] = await db.query(
        'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, currentUserId]
      );
      isLikedByUser = userLike.length > 0;
    }

    // Fetch comments with author details
    const commentsQuery = `
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

    const [comments] = await db.query(commentsQuery, [postId]);

    return res.status(200).json({
      success: true,
      post: {
        ...post,
        is_liked: isLikedByUser,
        comments
      }
    });
  } catch (err) {
    console.error('Error fetching post details:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blog post details.'
    });
  }
};

// -------------------------------------------------------------
// Create New Blog Post
// -------------------------------------------------------------
exports.createPost = async (req, res) => {
  try {
    const { title, summary, content, category, tags, cover_image } = req.body;
    const authorId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required to publish a blog post.'
      });
    }

    const postSummary = summary && summary.trim() ? summary.trim() : content.substring(0, 160) + '...';
    const readTime = calculateReadTime(content);
    const postCategory = category || 'Technology';
    const postTags = tags || 'General, Web';
    const defaultCover = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80';
    const postCover = cover_image && cover_image.trim() ? cover_image.trim() : defaultCover;

    const insertSql = `
      INSERT INTO posts (title, summary, content, category, tags, cover_image, read_time, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(insertSql, [
      title.trim(),
      postSummary,
      content.trim(),
      postCategory,
      postTags,
      postCover,
      readTime,
      authorId
    ]);

    const createdPostId = result.insertId;

    return res.status(201).json({
      success: true,
      message: 'Blog post published successfully!',
      postId: createdPostId
    });
  } catch (err) {
    console.error('Error creating post:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish blog post.'
    });
  }
};

// -------------------------------------------------------------
// Update Existing Post
// -------------------------------------------------------------
exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, summary, content, category, tags, cover_image } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check post ownership
    const [existing] = await db.query('SELECT author_id FROM posts WHERE id = ?', [postId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    if (existing[0].author_id !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only edit your own blog posts.'
      });
    }

    const readTime = calculateReadTime(content);
    const postSummary = summary && summary.trim() ? summary.trim() : content.substring(0, 160) + '...';

    const updateSql = `
      UPDATE posts 
      SET title = ?, summary = ?, content = ?, category = ?, tags = ?, cover_image = ?, read_time = ?
      WHERE id = ?
    `;

    await db.query(updateSql, [
      title.trim(),
      postSummary,
      content.trim(),
      category || 'Technology',
      tags || 'General',
      cover_image,
      readTime,
      postId
    ]);

    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully!',
      postId
    });
  } catch (err) {
    console.error('Error updating post:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update blog post.'
    });
  }
};

// -------------------------------------------------------------
// Delete Post
// -------------------------------------------------------------
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const [existing] = await db.query('SELECT author_id FROM posts WHERE id = ?', [postId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.'
      });
    }

    if (existing[0].author_id !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete your own blog posts.'
      });
    }

    await db.query('DELETE FROM posts WHERE id = ?', [postId]);

    return res.status(200).json({
      success: true,
      message: 'Blog post and related comments/likes deleted successfully!'
    });
  } catch (err) {
    console.error('Error deleting post:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete blog post.'
    });
  }
};
