import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles, AlertCircle, TrendingUp, BookOpen, Layers } from 'lucide-react';
import { postAPI } from '../services/api';
import BlogCard from '../components/BlogCard';

const CATEGORIES = ['All', 'Technology', 'Database', 'WebDev', 'Programming', 'Cloud'];

const Home = () => {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

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
        let fetchedPosts = res.data.posts;
        if (filterParam === 'trending') {
          fetchedPosts = [...fetchedPosts].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
        }
        setPosts(fetchedPosts);
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
  }, [search, category, filterParam]);

  return (
    <div>
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={14} color="#2563eb" />
          <span>Full Stack Blog • React &bull; Node &bull; Express &bull; MySQL</span>
        </div>

        <h1 className="hero-title">
          Explore Ideas, Architecture & <span style={{ color: '#2563eb' }}>Modern Tech</span>
        </h1>

        <p className="hero-subtitle">
          A high-performance relational blogging platform engineered with complete authentication, Google OAuth sign-in, real-time likes, and threaded discussions.
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

      {filterParam === 'trending' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '16px 0 24px',
          padding: '12px 18px',
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '10px',
          color: '#b45309',
          fontWeight: 600
        }}>
          <TrendingUp size={20} color="#d97706" />
          <span>Showing Trending Articles (Sorted by Community Likes)</span>
        </div>
      )}

      <section>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#64748b' }}>Loading articles...</p>
          </div>
        ) : error ? (
          <div className="glass-card" style={{ padding: '36px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <AlertCircle size={36} color="#e11d48" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#64748b', marginBottom: '16px' }}>{error}</p>
            <button onClick={fetchPosts} className="btn-primary">
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-card" style={{ padding: '50px 20px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <h3 style={{ marginBottom: '8px', color: '#0f172a' }}>No Articles Found</h3>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
              No articles match your query. Try clearing your search or category filter.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
