import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  console.log('🚀 Setting up MySQL database...');

  // Database configuration
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '19991101',
    charset: 'utf8mb4',
  };

  try {
    // Connect to MySQL server (without specifying database)
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server');
    console.log(__dirname);
    // Read and execute schema file
    const schemaPath = path.join(__dirname, '../src', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('📊 Database: cocktail_db');
    console.log('🍸 Tables: cocktails, ingredients, cocktail_ingredients');
    console.log('🌏Character set: utf8mb4 (supports Chinese)');

    await connection.end();
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('\n💡 Make sure:');
    console.log('   1 server is running');
    console.log('   2ser has CREATE DATABASE permissions');
    console.log('   3. Environment variables are set correctly');
    process.exit(1);
  }
}

setupDatabase();
