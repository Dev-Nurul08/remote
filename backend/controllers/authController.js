const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'college_blog_project_super_secret_jwt_key_2026';

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if user already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const insertSql = `
      INSERT INTO users (name, email, password, bio, role)
      VALUES (?, ?, ?, ?, 'user')
    `;
    const [result] = await db.query(insertSql, [
      name.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      bio ? bio.trim() : 'Avid blog reader and technology enthusiast.'
    ]);

    const newUserId = result.insertId;

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUserId, email: email.toLowerCase().trim(), name: name.trim(), role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to the Blog platform.',
      token,
      user: {
        id: newUserId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        bio: bio ? bio.trim() : 'Avid blog reader and technology enthusiast.',
        role: 'user'
      }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.'
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.'
      });
    }

    // Find user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.'
      });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again later.'
    });
  }
};

// Get Current User Profile (/api/auth/me)
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, bio, role, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    const user = users[0];

    // Fetch user statistics
    const [postCountRes] = await db.query('SELECT COUNT(*) as totalPosts FROM posts WHERE author_id = ?', [user.id]);
    const [likeCountRes] = await db.query('SELECT COUNT(*) as totalLikes FROM likes WHERE user_id = ?', [user.id]);

    return res.status(200).json({
      success: true,
      user: {
        ...user,
        stats: {
          totalPosts: postCountRes[0].totalPosts || 0,
          totalLikesGiven: likeCountRes[0].totalLikes || 0
        }
      }
    });
  } catch (err) {
    console.error('Profile Fetch Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile.'
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty.'
      });
    }

    await db.query('UPDATE users SET name = ?, bio = ? WHERE id = ?', [name.trim(), bio ? bio.trim() : '', req.user.id]);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: req.user.id,
        name: name.trim(),
        bio: bio ? bio.trim() : ''
      }
    });
  } catch (err) {
    console.error('Profile Update Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile.'
    });
  }
};
