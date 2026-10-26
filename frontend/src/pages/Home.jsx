import React, { useState, useEffect } from 'react';
import { Search, Sparkles, AlertCircle } from 'lucide-react';
import { postAPI } from '../services/api';
import BlogCard from '../components/BlogCard';

const CATEGORIES = ['All', 'Technology', 'Database', 'WebDev', 'Programming', 'Cloud'];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;

      const res = await postAPI.getAll(params);
      if (res.data?.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      setError('Could not load posts. Please verify server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPosts();
    }, 200);
    return () => clearTimeout(delay);
  }, [search, category]);

  return (
    <div>
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={14} />
          <span>Full Stack Project • React • Express • MySQL</span>
        </div>
        <h1 className="hero-title">
          Explore Ideas, Architecture & <span className="gradient-text">Modern Tech</span>
        </h1>
        <p className="hero-subtitle">
          A fully connected relational blogging system engineered with complete user authentication, interactive engagement, and clean RESTful design.
        </p>

        <div className="search-filter-container">
          <div className="search-bar-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search articles by title or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-input-field"
            />
          </div>

          <div className="category-pills">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`category-pill-btn ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
                id={`category-btn-${c.toLowerCase()}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#94a3b8' }}>Loading articles...</p>
          </div>
        ) : error ? (
          <div className="glass-card" style={{ padding: '36px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <AlertCircle size={36} color="#f43f5e" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#94a3b8', marginBottom: '16px' }}>{error}</p>
            <button onClick={fetchPosts} className="btn-primary">
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-card" style={{ padding: '50px 20px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <h3 style={{ marginBottom: '8px' }}>No Articles Found</h3>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
              No articles match your query. Try clearing your search.
            </p>
            {(search || category !== 'All') && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '16px', color: '#94a3b8', fontSize: '0.9rem' }}>
              Showing {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </div>
            <div className="blog-grid">
              {posts.map((item) => (
                <BlogCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
