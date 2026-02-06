import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { TopProduct } from '@/types';

const ITEMS_PER_PAGE = 5;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('q') || '';
    const page = Number(searchParams.get('page')) || 1;
    
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const searchTerm = `%${search}%`;

    const query = `
      SELECT * FROM vw_top_products_ranked 
      WHERE name ILIKE $1 
      ORDER BY ranking ASC
      LIMIT $2 OFFSET $3`;
    
    const result = await pool.query<TopProduct>(query, [
      searchTerm, 
      ITEMS_PER_PAGE, 
      offset
    ]);

    // También obtener el producto #1
    const numberOneRes = await pool.query<TopProduct>(
      `SELECT * FROM vw_top_products_ranked WHERE ranking = 1 LIMIT 1`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      numberOne: numberOneRes.rows[0] || null,
      pagination: {
        page,
        limit: ITEMS_PER_PAGE,
        hasMore: result.rows.length === ITEMS_PER_PAGE,
      }
    });
  } catch (error) {
    console.error('Error fetching top products:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}
