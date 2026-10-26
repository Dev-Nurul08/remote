# DevPulse — Full-Stack Blog Web Application

[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL_8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/Authentication-JWT_+_Bcrypt-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

A complete, production-grade, college-standard Full-Stack Blog Web Application built with **React (Vite)**, **Node.js**, **Express**, and **MySQL**. Featuring full relational database modeling, stateless JWT authentication with bcrypt password hashing, interactive likes, threaded comments, search and category filtering, and rich detailed article views.

---

## 📑 Table of Contents

- [Project Architecture](#-project-architecture)
- [Folder Structure](#-folder-structure)
- [Key Features](#-key-features)
- [Database Schema (MySQL)](#-database-schema-mysql)
- [RESTful API Endpoints](#-restful-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables (.env)](#-environment-variables-env)
- [MySQL Database Setup](#-mysql-database-setup)
- [Evaluation & Demo Credentials](#-evaluation--demo-credentials)

---

## 🏛 Project Architecture

This application strictly adheres to the **Model-View-Controller (MVC)** architectural design:

```
[ Client: React (Vite) + Context API ]
                  │
                  ▼  (HTTP REST Requests with JWT Bearer Token)
[ Express API Server (Node.js) ]
         ├── Auth Middleware (JWT Verification)
         ├── Controllers (Business Logic & Validation)
         └── Relational Data Layer (mysql2 pool with prepared statements)
                  │
                  ▼  (SQL Queries with Foreign Keys & Cascades)
[ MySQL Database (blog_app) ]
         ├── users
         ├── posts
         ├── comments
         └── likes
```

---

## 📁 Folder Structure

A clean, proper, and intuitive folder structure designed for college evaluation and enterprise maintainability:

```
remote/
├── backend/
│   ├── config/
│   │   └── db.js            # MySQL connection pool, auto DB/table creation & fallback
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile, bcrypt hashing, JWT issuance
│   │   ├── postController.js    # CRUD, search, category filter, detailed view
│   │   ├── commentController.js # Comment thread, creation, user deletion
│   │   └── likeController.js    # Like/unlike toggle, live counter
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification (mandatory and optional)
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth routes
│   │   ├── postRoutes.js        # /api/posts routes
│   │   ├── commentRoutes.js     # /api/comments routes
│   │   └── likeRoutes.js        # /api/likes routes
│   ├── .env                 # Server, DB, and JWT configuration (committed as requested)
│   ├── schema.sql           # Complete MySQL database & seed script
│   ├── package.json         # Backend dependencies & scripts
│   └── server.js            # Express application entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Global header with auth state & user badge
│   │   │   ├── Footer.jsx           # Modern footer with system metadata
│   │   │   ├── BlogCard.jsx         # Card item with cover image, author, metrics
│   │   │   ├── CommentSection.jsx   # Interactive comment thread & submit form
│   │   │   ├── LikeButton.jsx       # Real-time animated heartbeat like button
│   │   │   └── ProtectedRoute.jsx   # Route guard for authenticated actions
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global React Authentication state module
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Hero section, category pills, search, blog grid
│   │   │   ├── BlogDetails.jsx      # In-depth article view, author bio, likes, comments
│   │   │   ├── CreatePost.jsx       # Publishing form with preset cover images & live stats
│   │   │   ├── EditPost.jsx         # Post updater with author authorization
│   │   │   ├── Login.jsx            # Sign-in portal with 1-click Demo Credentials
│   │   │   ├── Register.jsx         # Multi-field registration with password validation
│   │   │   ├── Profile.jsx          # User dashboard, author stats, "My Articles"
│   │   │   └── About.jsx            # College project architecture & ER diagrams
│   │   ├── services/
│   │   │   └── api.js               # Axios instance with auto JWT header injection
│   │   ├── App.jsx                  # Main router setup
│   │   ├── main.jsx                 # React root renderer
│   │   └── index.css                # Obsidian glassmorphism design system
│   ├── index.html                   # HTML5 template with Google Fonts
│   ├── package.json                 # Frontend dependencies & scripts
│   └── vite.config.js               # Vite config with backend proxy
│
├── package.json             # Root orchestrator (run both frontend & backend concurrently)
├── README.md                # Project documentation
└── .gitignore               # Excludes node_modules/dist, includes .env
```

---

## ✨ Key Features

### 1. 🔐 College Project Authentication Module (`AuthContext.jsx`)
- **Secure Registration**: Full name, email format validation, minimum 6-character password, password confirmation matching.
- **Bcrypt Hashing**: Passwords stored as irreversible salted hashes (`$2a$10$...`).
- **Stateless JWT Tokens**: Issues signed JSON Web Tokens (7-day validity).
- **Persistent Session**: Auto-reconnects user on reload using `localStorage`.
- **Protected Routes**: Restricts article creation, editing, deleting, commenting, and liking to authenticated users.
- **1-Click Demo Evaluation**: Login page includes instant demo credential buttons for examiners.

### 2. 📝 Blog Article Management
- **Detailed Article View**: Full formatted content, read-time calculator, author bio, publish date, category badges, and tag chips.
- **Publish & Edit**: Rich form with instant cover image preview and 5 curated presets.
- **Author Guard**: Users can only edit or delete their own posts; administrators can moderate all content.

### 3. ❤️ Interactive Like System
- **Real-Time Toggle**: Liking/unliking dynamically updates the database and frontend state without page reload.
- **Heartbeat Animation**: Visual micro-animation on toggle.
- **Persistence**: Likes are tracked per `(post_id, user_id)` unique pair in MySQL.

### 4. 💬 Threaded Comments System
- **Discussion Stream**: Readers post comments with author name, avatar, and relative timestamps.
- **Author Deletion**: Comment authors can delete their own remarks.
- **Instant Count Sync**: Total comment counters update in real time.

---

## 🗄 Database Schema (MySQL)

Complete schema file available at `backend/schema.sql`.

```sql
-- 1. Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  bio TEXT DEFAULT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Posts Table
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'Technology',
  tags VARCHAR(255) DEFAULT 'React, Node, WebDev',
  cover_image VARCHAR(500) DEFAULT NULL,
  read_time VARCHAR(20) DEFAULT '5 min read',
  author_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Comments Table
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Likes Table (Unique Per User-Post Pair)
CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

> **Smart Dual-Engine Feature**: The backend's `config/db.js` automatically initializes MySQL tables and seeds sample data. If MySQL service credentials differ, it seamlessly activates the embedded database fallback so the app **never crashes** during live presentations.

---

## 🌐 RESTful API Endpoints

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Bearer Token | Fetch authenticated user profile & stats |
| `PUT` | `/api/auth/profile` | Bearer Token | Update user name and bio |
| `GET` | `/api/posts` | Public | List posts (supports `search`, `category`, `tag`) |
| `GET` | `/api/posts/:id` | Optional Auth | Detailed post view with comments & like status |
| `POST` | `/api/posts` | Bearer Token | Publish a new blog post |
| `PUT` | `/api/posts/:id` | Bearer (Author) | Update an existing blog post |
| `DELETE` | `/api/posts/:id` | Bearer (Author) | Delete post (cascades to comments & likes) |
| `GET` | `/api/comments/post/:postId` | Public | Retrieve comments for a post |
| `POST` | `/api/comments/post/:postId` | Bearer Token | Add comment to a post |
| `DELETE` | `/api/comments/:id` | Bearer (Author) | Delete user's comment |
| `POST` | `/api/likes/post/:postId` | Bearer Token | Toggle like / unlike on a post |
| `GET` | `/api/likes/post/:postId` | Optional Auth | Get like count & liked state |
| `GET` | `/api/health` | Public | Server & Database health status |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MySQL Server** (optional; built-in auto-engine will run if MySQL is not active)

### 1. Clone the Repository
```bash
git clone https://github.com/Dev-Nurul08/remote.git
cd remote
```

### 2. Install All Dependencies
Run from the root directory:
```bash
npm run install:all
```
*(Or install separately with `npm install` in both `backend` and `frontend` folders)*

### 3. Run Both Frontend and Backend Concurrently
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5001](http://localhost:5001)

---

## 🔒 Environment Variables (.env)

The `backend/.env` file is included directly in this repository as requested:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=blog_app
DB_PORT=3306

# Authentication JWT Secret
JWT_SECRET=college_blog_project_super_secret_jwt_key_2026

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## 🐬 MySQL Database Setup

If you wish to manage data directly in **MySQL Workbench**, **phpMyAdmin**, or the **MySQL CLI**:

1. Open your MySQL client.
2. Execute the `backend/schema.sql` file:
```bash
mysql -u root -p < backend/schema.sql
```
3. Update `DB_PASSWORD` in `backend/.env` if your root user requires a password.
4. Restart the backend server. The app connects to your live MySQL database!

---

## 🎓 Evaluation & Demo Credentials

Pre-seeded accounts are provided for instant evaluation:

| Account Type | Email | Password | Role |
|---|---|---|---|
| **Author / Admin** | `nurul@example.com` | `password123` | admin |
| **Demo Reader** | `demo@example.com` | `password123` | user |

*(You can also register any new account on the `/register` page)*
