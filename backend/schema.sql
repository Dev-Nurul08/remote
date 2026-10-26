CREATE DATABASE IF NOT EXISTS blog_app;
USE blog_app;

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

CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (id, name, email, password, bio, role)
VALUES 
(1, 'Nurul Shaikh', 'nurul@example.com', '$2a$10$Q7uB8mUe.1eWc9z6m54oaeJ4VskhPqmT/zGkKqB37fQ.F6vJgXW6W', 'Full Stack Developer', 'admin'),
(2, 'Demo User', 'demo@example.com', '$2a$10$Q7uB8mUe.1eWc9z6m54oaeJ4VskhPqmT/zGkKqB37fQ.F6vJgXW6W', 'Student & Web Learner', 'user')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO posts (id, title, summary, content, category, tags, cover_image, read_time, author_id)
VALUES 
(1, 'Building Clean Full Stack Apps with React and Node', 
 'A simple approach to structuring projects with proper controllers, models, and routes.', 
 'Full-stack development becomes very manageable when you organize files logically into controllers, models, and routes.\n\nKey aspects:\n- Keep controllers focused on request logic.\n- Put database interactions in dedicated queries or models.\n- Use React context for clean token state management.', 
 'Technology', 'React, Node, Express', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80', '4 min read', 1),
(2, 'Why MySQL is Great for Relational Web Apps', 
 'How foreign keys and cascade rules keep comments and likes consistent.', 
 'Relational databases give you foreign key integrity. When you delete a post, related comments and likes get cleaned up automatically without leaving broken references.', 
 'Database', 'MySQL, SQL, Backend', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1000&auto=format&fit=crop&q=80', '3 min read', 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);

INSERT INTO comments (id, post_id, user_id, content)
VALUES 
(1, 1, 2, 'Super clean setup! The code is very easy to read.')
ON DUPLICATE KEY UPDATE content=VALUES(content);

INSERT INTO likes (post_id, user_id)
VALUES (1, 1), (1, 2), (2, 2)
ON DUPLICATE KEY UPDATE post_id=VALUES(post_id);
