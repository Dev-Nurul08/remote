const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

let dbMode = 'mysql';
let pool = null;
let sqlite = null;

const connectDB = async () => {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = Number(process.env.DB_PORT) || 3306;
  const database = process.env.DB_NAME || 'blog_app';

  try {
    const rawConn = await mysql.createConnection({ host, user, password, port });
    await rawConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await rawConn.end();

    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10
    });

    const testConn = await pool.getConnection();
    testConn.release();

    dbMode = 'mysql';
    await syncMySQL();
    await seedDemo();
    console.log(`Database connected: MySQL (${database})`);
  } catch (err) {
    dbMode = 'sqlite';
    await initLocalDB();
    console.log(`Database connected: Local Engine`);
  }
};

const syncMySQL = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      bio TEXT,
      role VARCHAR(20) DEFAULT 'user',
      avatar VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      summary VARCHAR(500),
      content LONGTEXT NOT NULL,
      category VARCHAR(50) DEFAULT 'Technology',
      tags VARCHAR(255) DEFAULT 'React, Node',
      cover_image VARCHAR(500),
      read_time VARCHAR(20) DEFAULT '5 min read',
      author_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_like (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};

const initLocalDB = () => {
  return new Promise((resolve, reject) => {
    const file = path.join(__dirname, '..', 'blog_dev.sqlite');
    sqlite = new sqlite3.Database(file, (err) => {
      if (err) return reject(err);

      sqlite.serialize(() => {
        sqlite.run(`
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

        sqlite.run(`
          CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            summary TEXT,
            content TEXT NOT NULL,
            category TEXT DEFAULT 'Technology',
            tags TEXT DEFAULT 'React, Node',
            cover_image TEXT,
            read_time TEXT DEFAULT '5 min read',
            author_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);

        sqlite.run(`
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

        sqlite.run(`
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
          await seedDemo();
          resolve();
        });
      });
    });
  });
};

const seedDemo = async () => {
  try {
    const [rows] = await runQuery('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      const pass = await bcrypt.hash('password123', 10);

      const [res1] = await runQuery(
        'INSERT INTO users (name, email, password, bio, role) VALUES (?, ?, ?, ?, ?)',
        ['Nurul Shaikh', 'nurul@example.com', pass, 'Full Stack Developer', 'admin']
      );

      const [res2] = await runQuery(
        'INSERT INTO users (name, email, password, bio, role) VALUES (?, ?, ?, ?, ?)',
        ['Demo User', 'demo@example.com', pass, 'Student & Web Learner', 'user']
      );

      const uid1 = res1.insertId || 1;
      const uid2 = res2.insertId || 2;

      const p1 = await runQuery(
        'INSERT INTO posts (title, summary, content, category, tags, cover_image, read_time, author_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          'Building Clean Full Stack Apps with React and Node',
          'A simple approach to structuring projects with proper controllers, models, and routes.',
          'Full-stack development becomes very manageable when you organize files logically into controllers, models, and routes.\n\nKey aspects:\n- Keep controllers focused on request logic.\n- Put database interactions in dedicated queries or models.\n- Use React context for clean token state management.',
          'Technology',
          'React, Node, Express',
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80',
          '4 min read',
          uid1
        ]
      );

      const p2 = await runQuery(
        'INSERT INTO posts (title, summary, content, category, tags, cover_image, read_time, author_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          'Why MySQL is Great for Relational Web Apps',
          'How foreign keys and cascade rules keep comments and likes consistent.',
          'Relational databases give you foreign key integrity. When you delete a post, related comments and likes get cleaned up automatically without leaving broken references.',
          'Database',
          'MySQL, SQL, Backend',
          'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1000&auto=format&fit=crop&q=80',
          '3 min read',
          uid1
        ]
      );

      const pid1 = p1[0]?.insertId || 1;
      const pid2 = p2[0]?.insertId || 2;

      await runQuery('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)', [pid1, uid2, 'Super clean setup! The code is very easy to read.']);
      await runQuery('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [pid1, uid1]);
      await runQuery('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [pid1, uid2]);
      await runQuery('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [pid2, uid2]);
    }
  } catch (err) {}
};

const runQuery = async (sql, params = []) => {
  if (dbMode === 'mysql') {
    return await pool.execute(sql, params);
  }

  return new Promise((resolve, reject) => {
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT');

    if (isSelect) {
      sqlite.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve([rows, []]);
      });
    } else {
      sqlite.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve([{ insertId: this.lastID, affectedRows: this.changes }, []]);
      });
    }
  });
};

module.exports = {
  connectDB,
  query: runQuery,
  getMode: () => dbMode
};
