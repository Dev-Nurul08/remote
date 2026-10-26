const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let dbType = 'mysql'; // 'mysql' or 'sqlite'
let mysqlPool = null;
let sqliteDb = null;

// Initialize Database connection
async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = parseInt(process.env.DB_PORT, 10) || 3306;
  const database = process.env.DB_NAME || 'blog_app';

  try {
    console.log(`[DB] Attempting MySQL connection to ${host}:${port} as user '${user}'...`);
    
    // First connect without specifying database to create database if needed
    const rootConn = await mysql.createConnection({
      host,
      user,
      password,
      port,
      connectTimeout: 4000
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await rootConn.end();

    // Now create pool connected directly to the database
    mysqlPool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test pool connection
    const testConn = await mysqlPool.getConnection();
    console.log(`[DB] Successfully connected to MySQL database: '${database}'`);
    testConn.release();

    dbType = 'mysql';
    await createMySQLTables();
    await seedInitialData();
  } catch (err) {
    console.warn(`\n[DB Notice] MySQL connection could not be established: ${err.message}`);
    console.warn(`[DB Notice] Activating SQLite automatic engine so the app works seamlessly out of the box!`);
    console.warn(`[DB Notice] To use MySQL, verify MySQL is running on port 3306 and check credentials in backend/.env\n`);
    
    dbType = 'sqlite';
    await initSQLite();
  }
}

// -------------------------------------------------------------
// MySQL Table Initialization
// -------------------------------------------------------------
async function createMySQLTables() {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      bio TEXT DEFAULT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      avatar VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const postsTable = `
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const commentsTable = `
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const likesTable = `
    CREATE TABLE IF NOT EXISTS likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_like (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  await mysqlPool.query(usersTable);
  await mysqlPool.query(postsTable);
  await mysqlPool.query(commentsTable);
  await mysqlPool.query(likesTable);
  console.log('[DB] MySQL tables verified successfully.');
}

// -------------------------------------------------------------
// SQLite Fallback Initialization
// -------------------------------------------------------------
function initSQLite() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '..', 'blog_dev.sqlite');
    sqliteDb = new sqlite3.Database(dbPath, async (err) => {
      if (err) return reject(err);
      console.log(`[DB] Connected to SQLite database at: ${dbPath}`);

      sqliteDb.serialize(async () => {
        sqliteDb.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            bio TEXT,
            role TEXT DEFAULT 'user',
            avatar TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        sqliteDb.run(`
          CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            summary TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT DEFAULT 'Technology',
            tags TEXT DEFAULT 'React, Node, WebDev',
            cover_image TEXT,
            read_time TEXT DEFAULT '5 min read',
            author_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);

        sqliteDb.run(`
          CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);

        sqliteDb.run(`
          CREATE TABLE IF NOT EXISTS likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(post_id, user_id),
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `, async () => {
          await seedInitialData();
          resolve();
        });
      });
    });
  });
}

// -------------------------------------------------------------
// Seed Initial Demo Data if Users Table is Empty
// -------------------------------------------------------------
async function seedInitialData() {
  try {
    const [users] = await executeQuery('SELECT COUNT(*) as count FROM users');
    const userCount = users[0].count;

    if (userCount === 0) {
      console.log('[DB] Seeding demo blog users and articles...');
      const hashedPassword = await bcrypt.hash('password123', 10);

      // Seed Users
      const insertUserSql = `INSERT INTO users (name, email, password, bio, role) VALUES (?, ?, ?, ?, ?)`;
      const resUser1 = await executeQuery(insertUserSql, [
        'Nurul Shaikh',
        'nurul@example.com',
        hashedPassword,
        'Full Stack Developer & College Project Creator',
        'admin'
      ]);
      const resUser2 = await executeQuery(insertUserSql, [
        'Demo Reader',
        'demo@example.com',
        hashedPassword,
        'Tech enthusiast, student and passionate learner',
        'user'
      ]);

      const authorId = resUser1.insertId || 1;
      const readerId = resUser2.insertId || 2;

      // Seed Posts
      const insertPostSql = `
        INSERT INTO posts (title, summary, content, category, tags, cover_image, read_time, author_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const post1 = await executeQuery(insertPostSql, [
        'Mastering Modern Web Architecture with React, Node.js & MySQL',
        'A comprehensive guide to building resilient, production-ready full-stack applications with clean MVC architecture.',
        `Modern full-stack web engineering requires a harmonious blend of dynamic user interfaces and scalable server-side systems. In this article, we dive into building a robust blog architecture using React, Express, and MySQL.

### 1. The Power of Separation of Concerns
When designing college or enterprise projects, separating routing, business controllers, and database access makes maintenance effortless.
- **Frontend**: Handles state, user experience, and token management.
- **Backend API**: Enforces authentication, payload validation, and CORS rules.
- **Relational Storage**: Preserves data consistency, relations between authors, posts, comments, and likes.

### 2. Securing Authentication
Always hash passwords using algorithms like bcrypt with salt rounds. Tokens (JWT) allow stateless sessions where every API request carries cryptographic verification of user identity.

### 3. Conclusion
With clean folder structures and intuitive REST endpoints, your projects stand out in college evaluations and real-world interviews alike.`,
        'Technology',
        'React, Node.js, Express, MySQL',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80',
        '5 min read',
        authorId
      ]);

      const post2 = await executeQuery(insertPostSql, [
        'Why Relational Databases (MySQL) Excel for College & Production Systems',
        'Understanding ACID guarantees, foreign keys, and indexes for reliable data storage.',
        `Relational Database Management Systems remain the backbone of the tech world. MySQL offers exceptional speed, ACID transactions, and intuitive relational querying.

### Key Highlights:
1. **Foreign Key Cascades**: When a post is deleted, its associated comments and likes are automatically cleaned up.
2. **ACID Guarantees**: Atomicity, Consistency, Isolation, and Durability ensure your blog never leaves orphan records.
3. **Universality**: Supported by all hosting providers, Docker, and developer clouds.

Mastering SQL prepares software engineers for real industry challenges.`,
        'Database',
        'MySQL, Database, Backend, SQL',
        'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1000&auto=format&fit=crop&q=80',
        '4 min read',
        authorId
      ]);

      const postId1 = post1.insertId || 1;
      const postId2 = post2.insertId || 2;

      // Seed Comments
      const insertCommentSql = `INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)`;
      await executeQuery(insertCommentSql, [postId1, readerId, 'Fantastic explanation! The folder structure and architecture are crystal clear.']);
      await executeQuery(insertCommentSql, [postId2, readerId, 'ACID properties were explained so simply. Great for exam preparation!']);

      // Seed Likes
      const insertLikeSql = `INSERT INTO likes (post_id, user_id) VALUES (?, ?)`;
      await executeQuery(insertLikeSql, [postId1, authorId]);
      await executeQuery(insertLikeSql, [postId1, readerId]);
      await executeQuery(insertLikeSql, [postId2, readerId]);

      console.log('[DB] Demo data seeded successfully.');
    }
  } catch (err) {
    console.error('[DB] Seeding notice:', err.message);
  }
}

// -------------------------------------------------------------
// Unified Query Executor (Works with both MySQL and SQLite)
// -------------------------------------------------------------
async function executeQuery(sql, params = []) {
  if (dbType === 'mysql') {
    const [rows, fields] = await mysqlPool.execute(sql, params);
    // Standardize insert result for consistency
    return [rows, fields];
  } else {
    return new Promise((resolve, reject) => {
      const trimmed = sql.trim().toUpperCase();
      const isSelect = trimmed.startsWith('SELECT');

      if (isSelect) {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) return reject(err);
          resolve([rows, []]);
        });
      } else {
        sqliteDb.run(sql, params, function (err) {
          if (err) return reject(err);
          const result = {
            insertId: this.lastID,
            affectedRows: this.changes
          };
          resolve([result, []]);
        });
      }
    });
  }
}

module.exports = {
  initDatabase,
  query: executeQuery,
  getDbType: () => dbType
};
