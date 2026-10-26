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
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

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
        <MessageSquare size={24} color="#d97706" />
        <span style={{ color: '#0f172a' }}>Discussion ({comments.length})</span>
      </h3>

      {isAuthenticated ? (
        <div className="comment-input-card">
          <form onSubmit={handleAddComment}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div className="author-mini-avatar">
                {getInitials(user?.name)}
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>
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
              placeholder="Join the discussion... Share your thoughts, question, or technical feedback"
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
        <div className="glass-card" style={{ padding: '28px', textAlign: 'center', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', color: '#0f172a' }}>
            Join the Discussion
          </h4>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '16px' }}>
            Please sign in to share your thoughts and participate in this article's discussion.
          </p>
          <Link to="/login" className="btn-primary" id="btn-login-to-comment">
            <LogIn size={16} />
            <span>Sign in to Comment</span>
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {comments.length === 0 ? (
          <div className="glass-card" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
            <p>No comments yet. Be the first to share your perspective!</p>
          </div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment-item" id={`comment-item-${c.id}`}>
              <div className="comment-item-header">
                <div className="comment-user-info">
                  <div className="author-mini-avatar">
                    {getInitials(c.user_name)}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                      {c.user_name || 'User'}
                    </span>
                    <span style={{ margin: '0 8px', color: '#cbd5e1' }}>•</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                </div>

                {isAuthenticated && (user?.id === c.user_id || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="btn-danger"
                    title="Delete Comment"
                    style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                    id={`btn-delete-comment-${c.id}`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <p className="comment-text">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
