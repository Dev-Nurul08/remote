import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Clock, Calendar } from 'lucide-react';

const BlogCard = ({ post }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <article className="glass-card blog-card" id={`blog-card-${post.id}`}>
      {/* Cover Image & Category Pill */}
      <div className="blog-card-image-wrap">
        <Link to={`/blog/${post.id}`}>
          <img
            src={post.cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80'}
            alt={post.title}
            className="blog-card-image"
            loading="lazy"
          />
        </Link>
        <div className="blog-card-badge">
          <span className="category-badge">{post.category || 'Technology'}</span>
        </div>
        <div className="blog-card-readtime">
          <Clock size={12} />
          <span>{post.read_time || '5 min read'}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="blog-card-body">
        <Link to={`/blog/${post.id}`}>
          <h2 className="blog-card-title">{post.title}</h2>
        </Link>
        <p className="blog-card-summary">{post.summary}</p>

        {/* Card Footer */}
        <div className="blog-card-footer">
          <div className="blog-card-author">
            <div className="author-mini-avatar">
              {getInitials(post.author_name)}
            </div>
            <div>
              <div className="author-mini-name">{post.author_name || 'Anonymous Author'}</div>
              <div className="author-mini-date">{formatDate(post.created_at)}</div>
            </div>
          </div>

          <div className="blog-card-metrics">
            <span className="metric-item" title={`${post.likes_count || 0} Likes`}>
              <Heart size={15} color={post.likes_count > 0 ? '#f43f5e' : 'currentColor'} fill={post.likes_count > 0 ? '#f43f5e' : 'none'} />
              <span>{post.likes_count || 0}</span>
            </span>
            <span className="metric-item" title={`${post.comments_count || 0} Comments`}>
              <MessageSquare size={15} />
              <span>{post.comments_count || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
