import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, BookOpen, Heart, Edit3, Trash2, Shield, Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI, postAPI } from '../services/api';
import { getInitials } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalLikesGiven: 0 });
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

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this article?')) return;

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

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-card" style={{ padding: '36px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#ffffff'
          }}>
            {getInitials(user?.name)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user?.name}</h1>
              <span className="category-badge" style={{ fontSize: '0.75rem' }}>
                <Shield size={12} /> {user?.role || 'Member'}
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Mail size={16} /> {user?.email}
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
              {user?.bio || 'College student & tech blogger.'}
            </p>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="btn-secondary"
            id="btn-toggle-edit-profile"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Edit3 size={15} /> {editing ? 'Close' : 'Edit Profile'}
          </button>
        </div>

        {editing && (
          <form onSubmit={handleUpdate} style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
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
                <label className="auth-label">Bio</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                <Save size={15} /> Save
              </button>
            </div>
          </form>
        )}

        {saved && (
          <div className="alert-box alert-success" style={{ marginTop: '16px' }}>
            <Check size={18} />
            <span>Profile updated successfully</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <BookOpen size={28} color="#6366f1" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{userPosts.length}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Articles Published</div>
        </div>
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <Heart size={28} color="#f43f5e" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.totalLikesGiven}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Likes Given</div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>My Articles ({userPosts.length})</h2>
          <Link to="/create" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            + Write New
          </Link>
        </div>

        {userPosts.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ marginBottom: '16px' }}>You have not published any articles yet.</p>
            <Link to="/create" className="btn-primary">
              Write first article
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {userPosts.map((p) => (
              <div key={p.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <Link to={`/blog/${p.id}`}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: '#f8fafc' }}>{p.title}</h3>
                  </Link>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: '#94a3b8' }}>
                    <span>{p.category}</span>
                    <span>•</span>
                    <span>{p.likes_count || 0} Likes</span>
                    <span>•</span>
                    <span>{p.comments_count || 0} Comments</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/blog/${p.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                    View
                  </Link>
                  <Link to={`/edit/${p.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                    <Edit3 size={13} /> Edit
                  </Link>
                  <button onClick={() => handleDelete(p.id)} className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
