import { NextResponse } from 'next/server';
import pool from '@/lib/db';

type RouterParams = { params: Promise<{ id: string }> };

export async function GET(
  request: Request,
  { params }: RouterParams
): Promise<NextResponse> {
  const id = (await params).id;
  console.log(`===GET /api/cocktails/${id} called ===`);

  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection acquired');

    // Get cocktail details
    const [cocktailRows] = await connection.execute(
      `SELECT 
        c.id,
        c.name,
        c.name_zh,
        c.description,
        c.description_zh,
        c.category,
        c.glass,
        c.instructions,
        c.instructions_zh,
        c.image_url,
        c.alcoholic,
        c.created_at,
        c.updated_at
      FROM cocktails c
      WHERE c.id = ?`,
      [id]
    );

    if (!Array.isArray(cocktailRows) || cocktailRows.length === 0) {
      connection.release();
      return NextResponse.json(
        { error: 'Cocktail not found' },
        { status: 404 }
      );
    }

    const cocktail = cocktailRows[0];

    // Get ingredients for this cocktail
    const [ingredientRows] = await connection.execute(
      `SELECT 
        i.id,
        i.name,
        i.name_zh,
        i.type,
        ci.amount,
        ci.unit,
        ci.order_index
      FROM cocktail_ingredients ci
      JOIN ingredients i ON ci.ingredient_id = i.id
      WHERE ci.cocktail_id = ?
      ORDER BY ci.order_index ASC`,
      [id]
    );

    connection.release();
    console.log('Database connection released');

    const result = {
      ...cocktail,
      ingredients: ingredientRows,
    };

    console.log(`✅ Cocktail ${id} retrieved successfully`);
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Database error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });
  }
}
