import React, { useState, useEffect } from 'react';
import { Search, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { postAPI } from '../services/api';
import BlogCard from '../components/BlogCard';

const CATEGORIES = ['All', 'Technology', 'Database', 'WebDev', 'Programming', 'Cloud'];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await postAPI.getAll(params);
      if (res.data && res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Unable to load articles. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  return (
    <div>
      {/* Hero Header */}
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={14} />
          <span>College Full-Stack Project • React • Express • MySQL</span>
        </div>
        <h1 className="hero-title">
          Explore Ideas, Architecture & <span className="gradient-text">Modern Tech</span>
        </h1>
        <p className="hero-subtitle">
          A fully connected relational blogging system engineered with complete user authentication, interactive engagement, and clean RESTful design.
        </p>

        {/* Search & Category Filter */}
        <div className="search-filter-container">
          <div className="search-bar-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search articles by title, keywords, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="search-input-field"
            />
          </div>

          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                id={`category-btn-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Posts Area */}
      <section>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: '44px',
              height: '44px',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTop: '3px solid #6366f1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ color: '#94a3b8' }}>Loading published articles...</p>
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
          </div>
        ) : error ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <AlertCircle size={40} color="#f43f5e" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ marginBottom: '10px' }}>Connection Issue</h3>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>{error}</p>
            <button onClick={fetchPosts} className="btn-primary" id="btn-retry-posts">
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ marginBottom: '10px' }}>No Articles Found</h3>
            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
              {searchTerm || selectedCategory !== 'All'
                ? 'No matching articles match your query. Try clearing your filters.'
                : 'No articles have been published yet. Be the first to share an article!'}
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="btn-secondary"
                id="btn-reset-filters"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>
                Showing {posts.length} {posts.length === 1 ? 'article' : 'articles'}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </span>
            </div>
            <div className="blog-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
