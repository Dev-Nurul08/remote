import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenSquare, Image, Tag, Layers, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { postAPI } from '../services/api';

const PRESET_IMAGES = [
  { label: 'Coding', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Database', url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1000&auto=format&fit=crop&q=80' },
  { label: 'AI & Data', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Workspace', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Cloud Server', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80' },
];

const CreatePost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState('React, Node, Express');
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0].url);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const estimatedReadTime = `${Math.ceil(wordCount / 200) || 1} min read`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setErrorMessage('Title and content are required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        title: title.trim(),
        category,
        tags: tags.trim(),
        cover_image: coverImage.trim(),
        summary: summary.trim() || content.substring(0, 160) + '...',
        content: content.trim(),
      };

      const res = await postAPI.create(payload);
      if (res.data && res.data.success) {
        navigate(`/blog/${res.data.postId}`);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to publish post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
          Publish a New <span className="gradient-text">Article</span>
        </h1>
        <p style={{ color: '#94a3b8' }}>
          Share your knowledge, architectural insights, or technical tutorial with the community.
        </p>
      </div>

      {errorMessage && (
        <div className="alert-box alert-error" id="create-post-error">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '32px' }} id="create-post-form">
        {/* Title */}
        <div className="auth-form-group">
          <label className="auth-label" htmlFor="post-title">Article Title *</label>
          <input
            id="post-title"
            type="text"
            placeholder="e.g. Building Scalable APIs with Node.js and MySQL"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ fontSize: '1.1rem', fontWeight: 600 }}
          />
        </div>

        {/* Category & Tags Row */}
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

        {/* Cover Image URL & Presets */}
        <div className="auth-form-group">
          <label className="auth-label" htmlFor="post-cover-image">Cover Image URL</label>
          <input
            id="post-cover-image"
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          <div style={{ marginTop: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Or choose a preset cover image:</span>
            <div className="preset-images-list">
              {PRESET_IMAGES.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.label}
                  className={`preset-thumb ${coverImage === img.url ? 'selected' : ''}`}
                  onClick={() => setCoverImage(img.url)}
                  title={img.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Short Summary */}
        <div className="auth-form-group">
          <label className="auth-label" htmlFor="post-summary">Short Summary / Hook</label>
          <textarea
            id="post-summary"
            placeholder="A brief 1-2 sentence overview shown in the article feed..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            style={{ minHeight: '75px' }}
          />
        </div>

        {/* Full Content */}
        <div className="auth-form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="auth-label" htmlFor="post-content" style={{ margin: 0 }}>Full Article Content *</label>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {wordCount} words • {estimatedReadTime}
            </span>
          </div>
          <textarea
            id="post-content"
            placeholder="Write your detailed article here. Supports paragraphs, section headings, and code snippets..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ minHeight: '300px', fontSize: '1rem', lineHeight: '1.7' }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
            id="btn-cancel-create"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            id="btn-publish-post"
          >
            <PenSquare size={16} />
            <span>{isSubmitting ? 'Publishing...' : 'Publish Article'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
