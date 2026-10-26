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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLikesCount(initialLikesCount);
    setIsLiked(initialIsLiked);
  }, [initialLikesCount, initialIsLiked]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      if (window.confirm('You must be logged in to like this blog post. Would you like to go to the login page?')) {
        navigate('/login');
      }
      return;
    }

    if (isSubmitting) return;

    // Optimistic UI Update
    const prevCount = likesCount;
    const prevLiked = isLiked;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);
    setIsSubmitting(true);

    try {
      const res = await likeAPI.toggle(postId);
      if (res.data && res.data.success) {
        setIsLiked(res.data.is_liked);
        setLikesCount(res.data.likes_count);
        if (onLikeChange) {
          onLikeChange(res.data.likes_count, res.data.is_liked);
        }
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert optimistic update
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      className={`like-btn ${isLiked ? 'liked' : ''}`}
      disabled={isSubmitting}
      id={`btn-like-post-${postId}`}
      title={isLiked ? 'Unlike this post' : 'Like this post'}
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
