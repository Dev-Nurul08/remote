import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, BookOpen, Heart, Edit3, Trash2, Shield, Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI, postAPI } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalLikesGiven: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch current user details & stats
        const profileRes = await authAPI.getMe();
        if (profileRes.data && profileRes.data.user) {
          const u = profileRes.data.user;
          updateUser(u);
          setEditName(u.name);
          setEditBio(u.bio || '');
          if (u.stats) {
            setStats(u.stats);
          }
        }

        // Fetch posts created by this user
        if (user?.id) {
          const postsRes = await postAPI.getAll({ authorId: user.id });
          if (postsRes.data && postsRes.data.success) {
            setUserPosts(postsRes.data.posts);
          }
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.updateProfile({ name: editName, bio: editBio });
      if (res.data && res.data.success) {
        updateUser({ name: editName, bio: editBio });
        setIsEditingBio(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile.');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await postAPI.delete(postId);
      if (res.data && res.data.success) {
        setUserPosts(userPosts.filter((p) => p.id !== postId));
        setStats((prev) => ({ ...prev, totalPosts: Math.max(0, prev.totalPosts - 1) }));
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete article.');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Profile Overview Card */}
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
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
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
            onClick={() => setIsEditingBio(!isEditingBio)}
            className="btn-secondary"
            id="btn-toggle-edit-profile"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Edit3 size={15} /> {isEditingBio ? 'Close' : 'Edit Profile'}
          </button>
        </div>

        {/* Inline Profile Edit Form */}
        {isEditingBio && (
          <form onSubmit={handleUpdateProfile} style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="auth-label">Bio</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share your interests or department..."
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                <Save size={15} /> Save Profile
              </button>
            </div>
          </form>
        )}

        {saveSuccess && (
          <div className="alert-box alert-success" style={{ marginTop: '16px' }}>
            <Check size={18} />
            <span>Profile details saved successfully!</span>
          </div>
        )}
      </div>

      {/* User Stats Grid */}
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

      {/* Published Articles List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>My Published Articles ({userPosts.length})</h2>
          <Link to="/create" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            + Write New
          </Link>
        </div>

        {userPosts.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ marginBottom: '16px' }}>You haven't published any articles yet.</p>
            <Link to="/create" className="btn-primary">
              Write your first article
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {userPosts.map((post) => (
              <div key={post.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <Link to={`/blog/${post.id}`}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '6px', color: '#f8fafc' }}>{post.title}</h3>
                  </Link>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: '#94a3b8' }}>
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.likes_count || 0} Likes</span>
                    <span>•</span>
                    <span>{post.comments_count || 0} Comments</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/blog/${post.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                    View
                  </Link>
                  <Link to={`/edit/${post.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
                    <Edit3 size={13} /> Edit
                  </Link>
                  <button onClick={() => handleDeletePost(post.id)} className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
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
