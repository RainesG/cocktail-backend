// This API route uses Node.js modules (sqlite3, path) which are supported in Next.js API routes (app/api/*)
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request): Promise<NextResponse> {
  console.log('===GET /api/cocktails called ===',request);

  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection acquired');

    const query = `SELECT * FROM all_drinks ORDER BY RAND() LIMIT 6`;

    const [rows] = await connection.execute(query);
    console.log(
      `✅ Query successful. Found ${Array.isArray(rows) ? rows.length : 0} rows`
    );

    if (Array.isArray(rows) && rows.length > 0) {
      console.log('First row sample:', rows[0]);
    }

    connection.release();
    console.log('Database connection released');

    return NextResponse.json(rows);
  } catch (error) {
    console.error('❌ route Database error:', error);
    return NextResponse.json(
      {
        error: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}