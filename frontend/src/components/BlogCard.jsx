import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Clock } from 'lucide-react';
import { formatDate, getInitials } from '../utils/helpers';

const BlogCard = ({ post }) => {
  return (
    <article className="glass-card blog-card" id={`blog-card-${post.id}`}>
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

      <div className="blog-card-body">
        <Link to={`/blog/${post.id}`}>
          <h2 className="blog-card-title">{post.title}</h2>
        </Link>
        <p className="blog-card-summary">{post.summary}</p>

        <div className="blog-card-footer">
          <div className="blog-card-author">
            <div className="author-mini-avatar">
              {getInitials(post.author_name)}
            </div>
            <div>
              <div className="author-mini-name">{post.author_name || 'Author'}</div>
              <div className="author-mini-date">{formatDate(post.created_at)}</div>
            </div>
          </div>

          <div className="blog-card-metrics">
            <span className="metric-item">
              <Heart size={15} color={post.likes_count > 0 ? '#f43f5e' : 'currentColor'} fill={post.likes_count > 0 ? '#f43f5e' : 'none'} />
              <span>{post.likes_count || 0}</span>
            </span>
            <span className="metric-item">
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
