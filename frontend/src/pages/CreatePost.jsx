import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenSquare, AlertCircle, ArrowLeft, Image as ImageIcon, Tag, Layers } from 'lucide-react';
import { postAPI } from '../services/api';
import { calculateReadTime } from '../utils/helpers';

const PRESET_IMAGES = [
  { label: 'Coding', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Database', url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1000&auto=format&fit=crop&q=80' },
  { label: 'AI & Data', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Workspace', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Cloud Server', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80' }
];

const CreatePost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState('React, Node, Express');
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0].url);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = calculateReadTime(content);

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

      const res = await postAPI.create(payload);
      if (res.data?.success) {
        navigate(`/blog/${res.data.postId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="editor-container">
      <button
        onClick={() => navigate('/')}
        className="back-link"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <ArrowLeft size={16} />
        <span>Back to Articles</span>
      </button>

      <div className="editor-header">
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Publish a New <span style={{ color: '#2563eb' }}>Article</span>
        </h1>
        <p style={{ color: '#64748b' }}>
          Share your knowledge, architectural insights, or technical tutorial with the community.
        </p>
      </div>

      {error && (
        <div className="alert-box alert-error" id="create-post-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }} id="create-post-form">
        <div className="auth-form-group">
          <label className="auth-label" htmlFor="post-title">Article Title *</label>
          <input
            id="post-title"
            type="text"
            placeholder="e.g. Modern Full-Stack Web Development Architecture"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ fontSize: '1.05rem', fontWeight: 600 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label className="auth-label" htmlFor="post-category">Category</label>
            <select
              id="post-category"
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
            <label className="auth-label" htmlFor="post-tags">Tags (comma separated)</label>
            <input
              id="post-tags"
              type="text"
              placeholder="React, Express, MySQL"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        <div className="auth-form-group">
          <label className="auth-label" htmlFor="post-cover-image">Cover Image URL</label>
          <input
            id="post-cover-image"
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          <div style={{ marginTop: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>Quick preset cover images:</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PRESET_IMAGES.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCoverImage(img.url)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    border: coverImage === img.url ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: coverImage === img.url ? '#eff6ff' : '#ffffff',
                    color: coverImage === img.url ? '#2563eb' : '#334155',
                    cursor: 'pointer'
                  }}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="auth-form-group">
          <label className="auth-label" htmlFor="post-summary">Short Summary</label>
          <textarea
            id="post-summary"
            placeholder="A brief 1-2 sentence overview shown in the article feed..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ minHeight: '72px' }}
          />
        </div>

        <div className="auth-form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="auth-label" htmlFor="post-content" style={{ margin: 0 }}>Full Article Content *</label>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              {wordCount} words • {readTime}
            </span>
          </div>
          <textarea
            id="post-content"
            placeholder="Write your article in detailed paragraphs..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ minHeight: '260px', fontSize: '1rem', lineHeight: '1.7' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            id="btn-publish-post"
          >
            <PenSquare size={16} />
            <span>{submitting ? 'Publishing...' : 'Publish Article'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
