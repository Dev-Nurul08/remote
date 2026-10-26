import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Calendar, Edit3, Trash2, Share2, Tag, 
  MessageSquare, AlertCircle, Check 
} from 'lucide-react';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, getInitials } from '../utils/helpers';
import LikeButton from '../components/LikeButton';
import CommentSection from '../components/CommentSection';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await postAPI.getById(id);
      if (res.data?.success) {
        setPost(res.data.post);
      }
    } catch (err) {
      setError('Article could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await postAPI.delete(id);
      if (res.data?.success) {
        navigate('/');
      }
    } catch (err) {
      alert('Failed to delete post.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: '#94a3b8' }}>Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="glass-card" style={{ maxWidth: '500px', margin: '40px auto', padding: '36px', textAlign: 'center' }}>
        <AlertCircle size={36} color="#f43f5e" style={{ margin: '0 auto 12px' }} />
        <h2 style={{ marginBottom: '8px' }}>Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '20px' }}>{error}</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft size={16} /> Return to Articles
        </Link>
      </div>
    );
  }

  const isAuthor = isAuthenticated && (user?.id === post.author_id || user?.role === 'admin');

  return (
    <article className="post-detail-container" id="post-detail-view">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} />
        <span>Back to all articles</span>
      </Link>

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

      <div className="post-author-bar">
        <div className="post-author-info">
          <div className="post-author-avatar-lg">
            {getInitials(post.author_name)}
          </div>
          <div>
            <div className="post-author-name">{post.author_name || 'Author'}</div>
            <div className="post-author-sub">{post.author_bio || 'Author & Developer'}</div>
          </div>
        </div>

        {isAuthor && (
          <div className="post-actions-group">
            <Link to={`/edit/${post.id}`} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <Edit3 size={15} /> Edit
            </Link>
            <button onClick={handleDelete} className="btn-danger" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <Trash2 size={15} /> Delete
            </button>
          </div>
        )}
      </div>

      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="post-featured-image"
          id="post-featured-image"
        />
      )}

      <section className="post-body-content" id="post-body-content">
        {post.content}
      </section>

      {post.tags && (
        <div className="post-tags-container">
          {post.tags.split(',').map((tag, idx) => (
            <span key={idx} className="tag-badge">
              <Tag size={12} /> {tag.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="post-interact-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LikeButton
            postId={post.id}
            initialLikesCount={post.likes_count}
            initialIsLiked={post.is_liked}
            onLikeChange={(count, liked) => {
              setPost((prev) => ({ ...prev, likes_count: count, is_liked: liked }));
            }}
          />

          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.9rem' }}>
            <MessageSquare size={18} />
            <span>{post.comments ? post.comments.length : post.comments_count || 0} Comments</span>
          </span>
        </div>

        <button onClick={handleShare} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
          {copied ? (
            <>
              <Check size={16} color="#10b981" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Share2 size={16} />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      <CommentSection
        postId={post.id}
        initialComments={post.comments || []}
        onCommentChange={(count) => {
          setPost((prev) => ({ ...prev, comments_count: count }));
        }}
      />
    </article>
  );
};

export default BlogDetails;
