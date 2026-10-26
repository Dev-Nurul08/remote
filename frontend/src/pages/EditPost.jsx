import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, AlertCircle, ArrowLeft } from 'lucide-react';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { calculateReadTime } from '../utils/helpers';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await postAPI.getById(id);
        if (res.data?.success) {
          const p = res.data.post;

          if (p.author_id !== user?.id && user?.role !== 'admin') {
            alert('Unauthorized: You can only edit your own posts.');
            navigate(`/blog/${id}`);
            return;
          }

          setTitle(p.title || '');
          setCategory(p.category || 'Technology');
          setTags(p.tags || '');
          setCoverImage(p.cover_image || '');
          setSummary(p.summary || '');
          setContent(p.content || '');
        }
      } catch (err) {
        setError('Failed to load post details for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title: title.trim(),
        category,
        tags: tags.trim(),
        cover_image: coverImage.trim(),
        summary: summary.trim() || content.substring(0, 160) + '...',
        content: content.trim()
      };

      const res = await postAPI.update(id, payload);
      if (res.data?.success) {
        navigate(`/blog/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: '#94a3b8' }}>Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button
          onClick={() => navigate(`/blog/${id}`)}
          className="back-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to Article
        </button>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
          Edit <span className="gradient-text">Article</span>
        </h1>
        <p style={{ color: '#94a3b8' }}>
          Modify the article content, update tags, or improve your summary.
        </p>
      </div>

      {error && (
        <div className="alert-box alert-error" id="edit-post-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }} id="edit-post-form">
        <div className="auth-form-group">
          <label className="auth-label" htmlFor="edit-title">Article Title *</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ fontSize: '1.1rem', fontWeight: 600 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label className="auth-label" htmlFor="edit-category">Category</label>
            <select
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Technology">Technology</option>
              <option value="Database">Database</option>
              <option value="WebDev">Web Development</option>
              <option value="Programming">Programming</option>
              <option value="Cloud">Cloud & DevOps</option>
              <option value="AI/ML">AI & Data Science</option>
            </select>
          </div>

          <div>
            <label className="auth-label" htmlFor="edit-tags">Tags</label>
            <input
              id="edit-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        <div className="auth-form-group">
          <label className="auth-label" htmlFor="edit-cover-image">Cover Image URL</label>
          <input
            id="edit-cover-image"
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
        </div>

        <div className="auth-form-group">
          <label className="auth-label" htmlFor="edit-summary">Short Summary</label>
          <textarea
            id="edit-summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ minHeight: '75px' }}
          />
        </div>

        <div className="auth-form-group">
          <label className="auth-label" htmlFor="edit-content">Full Article Content *</label>
          <textarea
            id="edit-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ minHeight: '280px', fontSize: '1rem', lineHeight: '1.7' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => navigate(`/blog/${id}`)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            id="btn-save-edit"
          >
            <Edit3 size={16} />
            <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
