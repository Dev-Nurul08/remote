import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Mail, BookOpen, Heart, Edit3, Trash2, Shield, Save, Check, 
  MessageSquare, PlusCircle, ExternalLink, Calendar 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI, postAPI, commentAPI } from '../services/api';
import { getInitials, formatDate } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'comments' ? 'comments' : 'articles';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalLikesGiven: 0, totalComments: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const profileRes = await authAPI.getMe();
        if (profileRes.data?.user) {
          const u = profileRes.data.user;
          updateUser(u);
          setName(u.name);
          setBio(u.bio || '');
          if (u.stats) {
            setStats(u.stats);
          }
        }

        if (user?.id) {
          const postsRes = await postAPI.getAll({ authorId: user.id });
          if (postsRes.data?.success) {
            setUserPosts(postsRes.data.posts);
          }

          const commentsRes = await commentAPI.getMyComments();
          if (commentsRes.data?.success) {
            setUserComments(commentsRes.data.comments);
          }
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.updateProfile({ name, bio });
      if (res.data?.success) {
        updateUser({ name, bio });
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await postAPI.delete(postId);
      if (res.data?.success) {
        setUserPosts(userPosts.filter((p) => p.id !== postId));
        setStats((prev) => ({ ...prev, totalPosts: Math.max(0, prev.totalPosts - 1) }));
      }
    } catch (err) {
      alert('Failed to delete article');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await commentAPI.delete(commentId);
      if (res.data?.success) {
        setUserComments(userComments.filter((c) => c.id !== commentId));
        setStats((prev) => ({ ...prev, totalComments: Math.max(0, prev.totalComments - 1) }));
      }
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div className="glass-card" style={{ padding: '32px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
          }}>
            {getInitials(user?.name)}
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{user?.name}</h1>
              <span className="category-badge" style={{ fontSize: '0.78rem' }}>
                <Shield size={13} color="#2563eb" /> {user?.role || 'Member'}
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Mail size={16} color="#2563eb" /> {user?.email}
            </p>
            <p style={{ color: '#334155', fontSize: '0.95rem' }}>
              {user?.bio || 'Active author & developer on DevPulse.'}
            </p>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="btn-secondary"
            id="btn-toggle-edit-profile"
            style={{ padding: '8px 16px', fontSize: '0.88rem' }}
          >
            <Edit3 size={15} color="#d97706" /> {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editing && (
          <form onSubmit={handleUpdate} style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="auth-label">Bio Description</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                <Save size={15} /> Save Changes
              </button>
            </div>
          </form>
        )}

        {saved && (
          <div className="alert-box alert-success" style={{ marginTop: '16px' }}>
            <Check size={18} />
            <span>Profile information updated successfully</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            border: '1px solid #dbeafe'
          }}>
            <BookOpen size={22} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{userPosts.length}</div>
          <div style={{ color: '#64748b', fontSize: '0.86rem' }}>Articles Published</div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#fff1f2',
            color: '#e11d48',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            border: '1px solid #fecdd3'
          }}>
            <Heart size={22} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalLikesGiven}</div>
          <div style={{ color: '#64748b', fontSize: '0.86rem' }}>Likes Given</div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#fffbeb',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            border: '1px solid #fde68a'
          }}>
            <MessageSquare size={22} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{userComments.length}</div>
          <div style={{ color: '#64748b', fontSize: '0.86rem' }}>Comments Posted</div>
        </div>
      </div>

      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('articles');
            setSearchParams({});
          }}
          id="tab-my-articles"
        >
          <BookOpen size={18} color="#2563eb" />
          <span>My Articles ({userPosts.length})</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('comments');
            setSearchParams({ tab: 'comments' });
          }}
          id="tab-my-comments"
        >
          <MessageSquare size={18} color="#d97706" />
          <span>My Comments ({userComments.length})</span>
        </button>
      </div>

      {activeTab === 'articles' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
              Published Articles
            </h2>
            <Link to="/create" className="btn-success" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
              <PlusCircle size={16} /> Write New Article
            </Link>
          </div>

          {userPosts.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <BookOpen size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '1rem' }}>
                You have not published any articles yet.
              </p>
              <Link to="/create" className="btn-primary">
                Write your first article
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {userPosts.map((p) => (
                <div 
                  key={p.id} 
                  className="glass-card" 
                  style={{ 
                    padding: '20px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    flexWrap: 'wrap', 
                    gap: '16px' 
                  }}
                  id={`user-post-row-${p.id}`}
                >
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="category-badge" style={{ fontSize: '0.74rem' }}>
                        {p.category}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {formatDate(p.created_at)}
                      </span>
                    </div>

                    <Link to={`/blog/${p.id}`}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        {p.title}
                      </h3>
                    </Link>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.84rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Heart size={14} color="#e11d48" fill="#e11d48" /> {p.likes_count || 0} Likes
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageSquare size={14} color="#d97706" /> {p.comments_count || 0} Comments
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/blog/${p.id}`} className="btn-secondary" style={{ padding: '7px 12px', fontSize: '0.84rem' }}>
                      <ExternalLink size={14} color="#2563eb" /> View
                    </Link>
                    <Link to={`/edit/${p.id}`} className="btn-secondary" style={{ padding: '7px 12px', fontSize: '0.84rem' }}>
                      <Edit3 size={14} color="#d97706" /> Edit
                    </Link>
                    <button 
                      onClick={() => handleDeletePost(p.id)} 
                      className="btn-danger" 
                      style={{ padding: '7px 12px', fontSize: '0.84rem' }}
                      id={`btn-delete-post-${p.id}`}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
              My Comments Discussion History
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
              All comments and discussions you have contributed across articles.
            </p>
          </div>

          {userComments.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <MessageSquare size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '1rem' }}>
                You haven't left any comments yet.
              </p>
              <Link to="/" className="btn-primary">
                Browse articles and join discussion
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {userComments.map((c) => (
                <div 
                  key={c.id} 
                  className="glass-card" 
                  style={{ padding: '18px 20px' }}
                  id={`user-comment-row-${c.id}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '2px' }}>
                        Commented on:
                      </div>
                      <Link 
                        to={`/blog/${c.post_id}`} 
                        style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        {c.post_title || `Article #${c.post_id}`}
                        <ExternalLink size={13} />
                      </Link>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> {formatDate(c.created_at)}
                      </span>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="btn-danger"
                        style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                        title="Delete comment"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '0.94rem',
                    color: '#334155',
                    border: '1px solid #e2e8f0',
                    lineHeight: 1.55
                  }}>
                    {c.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
