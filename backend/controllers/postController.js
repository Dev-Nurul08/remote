const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const likeModel = require('../models/likeModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getReadTime = (text) => {
  const words = (text || '').trim().split(/\s+/).length;
  const mins = Math.ceil(words / 200) || 1;
  return `${mins} min read`;
};

const getAllPosts = async (req, res) => {
  try {
    const { search, category, authorId } = req.query;
    const posts = await postModel.getAll(search, category, authorId);

    return sendSuccess(res, 'Posts fetched', { count: posts.length, posts });
  } catch (err) {
    return sendError(res, 'Failed to fetch posts', 500);
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postModel.getById(req.params.id);

    if (!post) {
      return sendError(res, 'Post not found', 404);
    }

    const currentUserId = req.user ? req.user.id : null;
    const isLiked = await likeModel.isLikedByUser(post.id, currentUserId);
    const comments = await commentModel.getByPostId(post.id);

    return sendSuccess(res, 'Post fetched', {
      post: {
        ...post,
        is_liked: isLiked,
        comments
      }
    });
  } catch (err) {
    return sendError(res, 'Failed to retrieve post', 500);
  }
};

const createPost = async (req, res) => {
  try {
    const { title, summary, content, category, tags, cover_image } = req.body;

    if (!title || !content) {
      return sendError(res, 'Title and content are required', 400);
    }

    const postSummary = summary && summary.trim() ? summary.trim() : content.substring(0, 160) + '...';
    const readTime = getReadTime(content);
    const defaultCover = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80';

    const newPostId = await postModel.create({
      title: title.trim(),
      summary: postSummary,
      content: content.trim(),
      category: category || 'Technology',
      tags: tags || 'React, Node',
      cover_image: cover_image || defaultCover,
      read_time: readTime,
      author_id: req.user.id
    });

    return sendSuccess(res, 'Post published successfully', { postId: newPostId }, 201);
  } catch (err) {
    return sendError(res, 'Failed to publish post', 500);
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, summary, content, category, tags, cover_image } = req.body;

    const existing = await postModel.getById(postId);

    if (!existing) {
      return sendError(res, 'Post not found', 404);
    }

    if (existing.author_id !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'You can only edit your own posts', 403);
    }

    const postSummary = summary && summary.trim() ? summary.trim() : content.substring(0, 160) + '...';
    const readTime = getReadTime(content);

    await postModel.update(postId, {
      title: title.trim(),
      summary: postSummary,
      content: content.trim(),
      category: category || 'Technology',
      tags: tags || 'General',
      cover_image: cover_image || existing.cover_image,
      read_time: readTime
    });

    return sendSuccess(res, 'Post updated successfully', { postId });
  } catch (err) {
    return sendError(res, 'Failed to update post', 500);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const existing = await postModel.getById(postId);

    if (!existing) {
      return sendError(res, 'Post not found', 404);
    }

    if (existing.author_id !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'You can only delete your own posts', 403);
    }

    await postModel.remove(postId);

    return sendSuccess(res, 'Post deleted successfully');
  } catch (err) {
    return sendError(res, 'Failed to delete post', 500);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
