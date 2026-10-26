import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, Trash2, LogIn } from 'lucide-react';
import { commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getInitials, formatDate } from '../utils/helpers';

const CommentSection = ({ postId, initialComments = [], onCommentChange }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await commentAPI.add(postId, { content: text.trim() });
      if (res.data?.success) {
        const added = res.data.comment;
        const updated = [added, ...comments];
        setComments(updated);
        setText('');
        if (onCommentChange) onCommentChange(updated.length);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const res = await commentAPI.delete(commentId);
      if (res.data?.success) {
        const updated = comments.filter((c) => c.id !== commentId);
        setComments(updated);
        if (onCommentChange) onCommentChange(updated.length);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <section className="comments-section" id="comments-section">
      <h3 className="comments-header">
        <MessageSquare size={24} color="#8b5cf6" />
        <span>Discussion ({comments.length})</span>
      </h3>

      {isAuthenticated ? (
        <div className="glass-card comment-input-card">
          <form onSubmit={handleAddComment}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div className="author-mini-avatar">
                {getInitials(user?.name)}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                {user?.name}
              </span>
            </div>

            {error && (
              <div className="alert-box alert-error" style={{ padding: '8px 12px', marginBottom: '12px' }}>
                {error}
              </div>
            )}

            <textarea
              className="comment-textarea"
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              id="comment-input-textarea"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !text.trim()}
                id="comment-submit-button"
              >
                <Send size={16} />
                <span>{loading ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center', marginBottom: '32px' }}>
          <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Join the Discussion</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '18px' }}>
            Please sign in to post comments.
          </p>
          <Link to="/login" className="btn-primary" id="btn-login-to-comment">
            <LogIn size={16} />
            <span>Sign in to Comment</span>
          </Link>
        </div>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="glass-card" style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
            <p>No comments yet. Be the first to share your thoughts.</p>
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="glass-card comment-item" id={`comment-item-${c.id}`}>
              <div className="comment-avatar">
                {getInitials(c.user_name)}
              </div>
              <div className="comment-content-wrap">
                <div className="comment-meta">
                  <div>
                    <span className="comment-author-name">{c.user_name || 'User'}</span>
                    <span style={{ margin: '0 8px', color: '#64748b' }}>•</span>
                    <span className="comment-date">{formatDate(c.created_at)}</span>
                  </div>

                  {isAuthenticated && (user?.id === c.user_id || user?.role === 'admin') && (
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="btn-icon"
                      title="Delete Comment"
                      style={{ padding: '6px', color: '#f43f5e' }}
                      id={`btn-delete-comment-${c.id}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="comment-text">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
