-- ========================================================
-- College Project: Full-Stack Blog Website Database Schema
-- Technologies: MySQL, Express, React, Node.js
-- Author: Dev-Nurul
-- ========================================================

CREATE DATABASE IF NOT EXISTS blog_app;
USE blog_app;

-- --------------------------------------------------------
-- 1. Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  bio TEXT DEFAULT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Table structure for table `posts`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Table structure for table `comments`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Table structure for table `likes`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Seed Initial Data (Demo User: password is 'password123')
-- --------------------------------------------------------
-- Password hash generated using bcrypt ($2a$10$wE1... for 'password123')
INSERT INTO users (id, name, email, password, bio, role)
VALUES 
(1, 'Nurul Shaikh', 'nurul@example.com', '$2a$10$Q7uB8mUe.1eWc9z6m54oaeJ4VskhPqmT/zGkKqB37fQ.F6vJgXW6W', 'Full Stack Developer & College Project Creator', 'admin'),
(2, 'Demo User', 'demo@example.com', '$2a$10$Q7uB8mUe.1eWc9z6m54oaeJ4VskhPqmT/zGkKqB37fQ.F6vJgXW6W', 'Passionate reader and tech enthusiast', 'user')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO posts (id, title, summary, content, category, tags, cover_image, read_time, author_id)
VALUES 
(1, 'Mastering Full-Stack Web Development with React and Node.js', 
 'An in-depth guide to modern web architecture, covering authentication, database modeling, and state management.', 
 'Building scalable web applications requires a solid understanding of both frontend client experiences and robust backend APIs. In this article, we explore how React and Node.js with Express work seamlessly together. From RESTful routing to secure JWT token verification and MySQL schema design, every layer contributes to an exceptional digital product.

### Core Concepts Covered:
1. **Frontend Architecture**: Component composition, hooks, context API for global state.
2. **Backend API**: Clean MVC routing, async controllers, middleware error handling.
3. **Database Relational Design**: Foreign keys, cascades, indexes, and parameterized queries to prevent SQL injection.

Whether you are preparing a college presentation or launching a production service, keeping your code modular and readable is the golden standard.', 
 'Technology', 'React, Node, FullStack', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80', '6 min read', 1),

(2, 'Why MySQL Remains the Gold Standard for Relational Data', 
 'Exploring ACID compliance, structured queries, and why MySQL powers millions of production web services.', 
 'Relational Database Management Systems (RDBMS) have stood the test of time. MySQL, with its battle-tested InnoDB engine, provides transactional safety, foreign key constraints, and lightning-fast index queries.

### Key Advantages:
- **ACID Compliance**: Guarantees data validity despite errors or crashes.
- **Relational Integrity**: Foreign key constraints ensure data consistency across users, posts, comments, and likes.
- **Widespread Community Support**: Millions of tutorials, tools like MySQL Workbench and phpMyAdmin make maintenance straightforward.

For students and engineers alike, mastering relational database principles forms the backbone of any software engineering career.', 
 'Database', 'MySQL, Backend, SQL', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1000&auto=format&fit=crop&q=80', '4 min read', 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);

INSERT INTO comments (id, post_id, user_id, content)
VALUES 
(1, 1, 2, 'Incredible guide! The folder structure and authentication flow is super clear and easy to follow.'),
(2, 2, 2, 'Great explanation of ACID compliance. This helped me prepare for my college project viva!')
ON DUPLICATE KEY UPDATE content=VALUES(content);

INSERT INTO likes (post_id, user_id)
VALUES (1, 1), (1, 2), (2, 1)
ON DUPLICATE KEY UPDATE post_id=VALUES(post_id);
