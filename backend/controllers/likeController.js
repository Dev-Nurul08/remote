const likeModel = require('../models/likeModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const toggleLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const liked = await likeModel.isLikedByUser(postId, userId);

    if (liked) {
      await likeModel.removeLike(postId, userId);
    } else {
      await likeModel.addLike(postId, userId);
    }

    const likesCount = await likeModel.getCount(postId);

    return sendSuccess(res, liked ? 'Unliked post' : 'Liked post', {
      is_liked: !liked,
      likes_count: likesCount
    });
  } catch (err) {
    return sendError(res, 'Failed to update like status', 500);
  }
};

const getPostLikes = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user ? req.user.id : null;

    const likesCount = await likeModel.getCount(postId);
    const isLiked = await likeModel.isLikedByUser(postId, userId);

    return sendSuccess(res, 'Like status fetched', {
      likes_count: likesCount,
      is_liked: isLiked
    });
  } catch (err) {
    return sendError(res, 'Failed to retrieve like status', 500);
  }
};

module.exports = {
  toggleLike,
  getPostLikes
};
