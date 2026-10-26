const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const register = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required', 400);
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await userModel.findByEmail(cleanEmail);

    if (existing) {
      return sendError(res, 'An account with this email already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(name.trim(), cleanEmail, hashedPassword, bio);

    const newUser = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      bio: bio || '',
      role: 'user'
    };

    const token = generateToken(newUser);

    return sendSuccess(res, 'Registration successful', { token, user: newUser }, 201);
  } catch (err) {
    return sendError(res, 'Server error during registration', 500);
  }
};

const googleAuth = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!email) {
      return sendError(res, 'Gmail address is required', 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await userModel.findByEmail(cleanEmail);

    if (!user) {
      const pass = password || 'OAuth_' + Math.random().toString(36).substring(2, 10);
      const hashedPassword = await bcrypt.hash(pass, 10);
      const userName = name || cleanEmail.split('@')[0];

      const userId = await userModel.createUser(userName, cleanEmail, hashedPassword, 'Registered via Google OAuth');
      user = {
        id: userId,
        name: userName,
        email: cleanEmail,
        bio: 'Registered via Google OAuth',
        role: 'user',
        avatar: avatar || null
      };
    }

    const token = generateToken(user);

    return sendSuccess(res, 'Google authentication successful', {
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
    return sendError(res, 'Google authentication error', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide both email and password', 400);
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await userModel.findByEmail(cleanEmail);

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user);

    return sendSuccess(res, 'Login successful', {
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
    return sendError(res, 'Server error during login', 500);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const stats = await userModel.getUserStats(user.id);

    return sendSuccess(res, 'Profile fetched', {
      user: {
        ...user,
        stats
      }
    });
  } catch (err) {
    return sendError(res, 'Failed to retrieve profile', 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    if (!name) {
      return sendError(res, 'Name cannot be empty', 400);
    }

    await userModel.updateProfile(req.user.id, name.trim(), bio ? bio.trim() : '');

    return sendSuccess(res, 'Profile updated successfully', {
      user: {
        id: req.user.id,
        name: name.trim(),
        bio: bio ? bio.trim() : ''
      }
    });
  } catch (err) {
    return sendError(res, 'Failed to update profile', 500);
  }
};

module.exports = {
  register,
  googleAuth,
  login,
  getMe,
  updateProfile
};
