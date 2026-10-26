const commentModel = require('../models/commentModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getComments = async (req, res) => {
  try {
    const comments = await commentModel.getByPostId(req.params.postId);
    return sendSuccess(res, 'Comments fetched', { count: comments.length, comments });
  } catch (err) {
    return sendError(res, 'Failed to retrieve comments', 500);
  }
};

const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return sendError(res, 'Comment text cannot be empty', 400);
    }

    const commentId = await commentModel.create(postId, userId, content.trim());
    const newComment = {
      id: commentId,
      post_id: Number(postId),
      user_id: userId,
      content: content.trim(),
      created_at: new Date().toISOString(),
      user_name: req.user.name
    };

    return sendSuccess(res, 'Comment posted successfully', { comment: newComment }, 201);
  } catch (err) {
    return sendError(res, 'Failed to post comment', 500);
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const existing = await commentModel.getById(commentId);

    if (!existing) {
      return sendError(res, 'Comment not found', 404);
    }

    if (existing.user_id !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 'You can only delete your own comments', 403);
    }

    await commentModel.remove(commentId);

    return sendSuccess(res, 'Comment deleted successfully');
  } catch (err) {
    return sendError(res, 'Failed to delete comment', 500);
  }
};

module.exports = {
  getComments,
  addComment,
  deleteComment
};
