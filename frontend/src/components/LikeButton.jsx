import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { likeAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LikeButton = ({ postId, initialLikesCount = 0, initialIsLiked = false, onLikeChange }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLikesCount(initialLikesCount);
    setIsLiked(initialIsLiked);
  }, [initialLikesCount, initialIsLiked]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      if (window.confirm('Please log in to like this post. Go to login?')) {
        navigate('/login');
      }
      return;
    }

    if (submitting) return;

    const previousCount = likesCount;
    const previousState = isLiked;

    setIsLiked(!previousState);
    setLikesCount(previousState ? Math.max(0, previousCount - 1) : previousCount + 1);
    setSubmitting(true);

    try {
      const res = await likeAPI.toggle(postId);
      if (res.data?.success) {
        setIsLiked(res.data.is_liked);
        setLikesCount(res.data.likes_count);
        if (onLikeChange) {
          onLikeChange(res.data.likes_count, res.data.is_liked);
        }
      }
    } catch (err) {
      setIsLiked(previousState);
      setLikesCount(previousCount);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      className={`like-btn ${isLiked ? 'liked' : ''}`}
      disabled={submitting}
      id={`btn-like-post-${postId}`}
      title={isLiked ? 'Unlike' : 'Like'}
    >
      <Heart
        size={20}
        color={isLiked ? '#f43f5e' : 'currentColor'}
        fill={isLiked ? '#f43f5e' : 'none'}
      />
      <span>
        {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
      </span>
    </button>
  );
};

export default LikeButton;
