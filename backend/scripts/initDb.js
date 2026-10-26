const { connectDB } = require('../config/db');

const run = async () => {
  console.log('Initializing database tables and seed data...');
  await connectDB();
  console.log('Database initialization complete.');
  process.exit(0);
};

run();
