import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, Trash2, User, LogIn } from 'lucide-react';
import { commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId, initialComments = [], onCommentChange }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize when initial comments prop updates
  React.useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await commentAPI.add(postId, { content: newComment.trim() });
      if (res.data && res.data.success) {
        const added = res.data.comment;
        const updated = [added, ...comments];
        setComments(updated);
        setNewComment('');
        if (onCommentChange) onCommentChange(updated.length);
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
      setErrorMsg(err.response?.data?.message || 'Could not post your comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await commentAPI.delete(commentId);
      if (res.data && res.data.success) {
        const updated = comments.filter((c) => c.id !== commentId);
        setComments(updated);
        if (onCommentChange) onCommentChange(updated.length);
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert(err.response?.data?.message || 'Failed to delete comment.');
    }
  };

  return (
    <section className="comments-section" id="comments-section">
      <h3 className="comments-header">
        <MessageSquare size={24} color="#8b5cf6" />
        <span>Discussion ({comments.length})</span>
      </h3>

      {/* Comment Input or Guest Prompt */}
      {isAuthenticated ? (
        <div className="glass-card comment-input-card">
          <form onSubmit={handleAddComment}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div className="author-mini-avatar">
                {getInitials(user?.name)}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                Commenting as {user?.name}
              </span>
            </div>

            {errorMsg && (
              <div className="alert-box alert-error" style={{ padding: '8px 12px', marginBottom: '12px' }}>
                {errorMsg}
              </div>
            )}

            <textarea
              className="comment-textarea"
              placeholder="Share your thoughts, ask questions, or contribute feedback..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              id="comment-input-textarea"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || !newComment.trim()}
                id="comment-submit-button"
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center', marginBottom: '32px' }}>
          <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Join the Discussion</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '18px' }}>
            Please log in to leave comments and engage with other readers.
          </p>
          <Link to="/login" className="btn-primary" id="btn-login-to-comment">
            <LogIn size={16} />
            <span>Sign in to Comment</span>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="glass-card" style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="glass-card comment-item" id={`comment-item-${comment.id}`}>
              <div className="comment-avatar">
                {getInitials(comment.user_name)}
              </div>
              <div className="comment-content-wrap">
                <div className="comment-meta">
                  <div>
                    <span className="comment-author-name">{comment.user_name || 'Anonymous User'}</span>
                    <span style={{ margin: '0 8px', color: '#64748b' }}>•</span>
                    <span className="comment-date">{formatDate(comment.created_at)}</span>
                  </div>

                  {/* Allow comment deletion if the user is the author or admin */}
                  {isAuthenticated && (user?.id === comment.user_id || user?.role === 'admin') && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="btn-icon"
                      title="Delete Comment"
                      style={{ padding: '6px', color: '#f43f5e' }}
                      id={`btn-delete-comment-${comment.id}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="comment-text">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
