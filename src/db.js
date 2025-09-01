const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const useSSL = String(process.env.DB_SSL).toLowerCase() === 'true';

const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : false
});

module.exports = { pool };
