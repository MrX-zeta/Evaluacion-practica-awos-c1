import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { InventoryRisk } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let query = `SELECT * FROM vw_inventory_risk`;
    const params: string[] = [];

    if (category && category !== 'Todas') {
      query += ` WHERE category = $1`;
      params.push(category);
    }
    
    query += ` ORDER BY stock ASC`;

    const result = await pool.query<InventoryRisk>(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener inventario' },
      { status: 500 }
    );
  }
}
