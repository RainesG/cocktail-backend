import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  user: 'root',
  host: process.env.DB_HOST || `localhost`,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cocktail_db',
  charset: 'utf8mb4', // Support Chinese characters
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully)');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL database connection failed:', error);
    return false;
  }
}

export default pool;
