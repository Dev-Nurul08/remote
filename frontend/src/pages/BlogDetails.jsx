import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Calendar, Edit3, Trash2, Share2, Tag, 
  MessageSquare, AlertCircle, Check, Heart 
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
        <p style={{ color: '#64748b' }}>Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="glass-card" style={{ maxWidth: '500px', margin: '40px auto', padding: '36px', textAlign: 'center' }}>
        <AlertCircle size={36} color="#e11d48" style={{ margin: '0 auto 12px' }} />
        <h2 style={{ marginBottom: '8px', color: '#0f172a' }}>Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>{error}</p>
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
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#64748b' }}>
            <Clock size={14} color="#2563eb" /> {post.read_time || '5 min read'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#64748b' }}>
            <Calendar size={14} color="#7c3aed" /> {formatDate(post.created_at)}
          </span>
        </div>

        <h1 className="post-full-title">{post.title}</h1>
      </header>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}>
            {getInitials(post.author_name)}
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{post.author_name || 'Author'}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{post.author_bio || 'Author & Developer'}</div>
          </div>
        </div>

        {isAuthor && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to={`/edit/${post.id}`} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.84rem' }}>
              <Edit3 size={15} color="#d97706" /> Edit
            </Link>
            <button onClick={handleDelete} className="btn-danger" style={{ padding: '7px 14px', fontSize: '0.84rem' }}>
              <Trash2 size={15} /> Delete
            </button>
          </div>
        )}
      </div>

      {post.cover_image && (
        <img
          src={post.cover_image}
          alt={post.title}
          className="post-cover-image"
          id="post-featured-image"
        />
      )}

      <div className="post-article-content" id="post-body-content">
        {post.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {post.tags && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {post.tags.split(',').map((tag, idx) => (
            <span key={idx} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              backgroundColor: '#f1f5f9',
              borderRadius: '6px',
              fontSize: '0.82rem',
              color: '#475569'
            }}>
              <Tag size={12} color="#7c3aed" /> {tag.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="post-actions-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LikeButton
            postId={post.id}
            initialLikesCount={post.likes_count}
            initialIsLiked={post.is_liked}
            onLikeChange={(count, liked) => {
              setPost((prev) => ({ ...prev, likes_count: count, is_liked: liked }));
            }}
          />

          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
            <MessageSquare size={18} color="#d97706" />
            <span>{post.comments ? post.comments.length : post.comments_count || 0} Comments</span>
          </span>
        </div>

        <button onClick={handleShare} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
          {copied ? (
            <>
              <Check size={16} color="#059669" />
              <span>Copied Link!</span>
            </>
          ) : (
            <>
              <Share2 size={16} color="#2563eb" />
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
