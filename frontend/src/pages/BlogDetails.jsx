import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Calendar, Edit3, Trash2, Share2, Tag, 
  MessageSquare, User, AlertCircle, Check 
} from 'lucide-react';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LikeButton from '../components/LikeButton';
import CommentSection from '../components/CommentSection';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const fetchPostDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await postAPI.getById(id);
      if (res.data && res.data.success) {
        setPost(res.data.post);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err.response?.data?.message || 'Article not found or could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action will permanently remove all associated comments and likes.')) {
      return;
    }

    try {
      const res = await postAPI.delete(id);
      if (res.data && res.data.success) {
        alert('Blog post deleted successfully.');
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert(err.response?.data?.message || 'Failed to delete post.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{
          width: '44px',
          height: '44px',
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTop: '3px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p style={{ color: '#94a3b8' }}>Loading detailed article view...</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="glass-card" style={{ maxWidth: '600px', margin: '40px auto', padding: '40px', textAlign: 'center' }}>
        <AlertCircle size={40} color="#f43f5e" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ marginBottom: '10px' }}>Article Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>{error || 'The requested article does not exist or was removed.'}</p>
        <Link to="/" className="btn-primary" id="btn-back-home-error">
          <ArrowLeft size={16} /> Return to Articles
        </Link>
      </div>
    );
  }

  const isAuthor = isAuthenticated && (user?.id === post.author_id || user?.role === 'admin');

  return (
    <article className="post-detail-container" id="post-detail-view">
      {/* Back Link */}
      <Link to="/" className="back-link" id="link-back-to-articles">
        <ArrowLeft size={18} />
        <span>Back to all articles</span>
      </Link>

      {/* Post Header */}
      <header className="post-header">
        <div className="post-header-meta">
          <span className="category-badge">{post.category || 'Technology'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#94a3b8' }}>
            <Clock size={14} /> {post.read_time || '5 min read'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#94a3b8' }}>
            <Calendar size={14} /> {formatDate(post.created_at)}
          </span>
        </div>

        <h1 className="post-detail-title">{post.title}</h1>
      </header>

      {/* Author and Action Bar */}
      <div className="post-author-bar">
        <div className="post-author-info">
          <div className="post-author-avatar-lg">
            {getInitials(post.author_name)}
          </div>
          <div>
            <div className="post-author-name">{post.author_name || 'Anonymous Author'}</div>
            <div className="post-author-sub">
              {post.author_bio || 'Technology author & developer'}
            </div>
          </div>
        </div>

        {/* Author Actions (Edit / Delete) */}
        {isAuthor && (
          <div className="post-actions-group">
            <Link to={`/edit/${post.id}`} className="btn-secondary" id="btn-edit-post" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <Edit3 size={15} /> Edit
            </Link>
            <button onClick={handleDeletePost} className="btn-danger" id="btn-delete-post" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <Trash2 size={15} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Featured Cover Image */}
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="post-featured-image"
          id="post-featured-image"
        />
      )}

      {/* Article Body Content */}
      <section className="post-body-content" id="post-body-content">
        {post.content}
      </section>

      {/* Tags */}
      {post.tags && (
        <div className="post-tags-container">
          {post.tags.split(',').map((tag, idx) => (
            <span key={idx} className="tag-badge">
              <Tag size={12} /> {tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Interactive Engagement Bar */}
      <div className="post-interact-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LikeButton
            postId={post.id}
            initialLikesCount={post.likes_count}
            initialIsLiked={post.is_liked}
            onLikeChange={(newCount, liked) => {
              setPost((prev) => ({ ...prev, likes_count: newCount, is_liked: liked }));
            }}
          />

          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
            <MessageSquare size={18} />
            <span>{post.comments ? post.comments.length : post.comments_count || 0} Comments</span>
          </span>
        </div>

        <button onClick={handleShare} className="btn-secondary" id="btn-share-post" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
          {copiedShare ? (
            <>
              <Check size={16} color="#10b981" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 size={16} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Comments Section */}
      <CommentSection
        postId={post.id}
        initialComments={post.comments || []}
        onCommentChange={(newCount) => {
          setPost((prev) => ({ ...prev, comments_count: newCount }));
        }}
      />
    </article>
  );
};

export default BlogDetails;
