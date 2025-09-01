// This API route uses Node.js modules (sqlite3, path) which are supported in Next.js API routes (app/api/*)
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request): Promise<NextResponse> {
  console.log('===GET /api/cocktails called ===', request);

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const category = searchParams.get('category');
  const id = searchParams.get('id');

  console.log('Request parameters:', { name, category, id });

  if (!name && !category && !id) {
    console.log('ttt');
    return NextResponse.json(
      {
        error: 'arguments error',
        details: 'please input cocktail name',
      },
      { status: 500 }
    );
  }

  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection acquired');

    let query = `
      SELECT
        name,
        dateModified,
        id,
        alcoholic,
        category,
        thumb,
        glass,
        ingredients,
        instructions,
        IBA
      FROM all_drinks
    `;

    let queryParams;

    if (name) {
      queryParams = `name LIKE ${JSON.stringify(name + '%')}`;
    }

    if (id) {
      queryParams = `id LIKE ${JSON.stringify(id + '%')}`;
    }

    if (category) {
      queryParams = `category LIKE ${JSON.stringify(category + '%')}`;
    }

    query += `WHERE ${queryParams} ORDER BY name ASC`;

    console.log('Final query:', query);

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
