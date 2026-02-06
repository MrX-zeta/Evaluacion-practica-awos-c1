import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { CustomerValue } from '@/types';

const LIMIT = 5;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'total_gastado';
    const order = searchParams.get('order') || 'DESC';
    const page = Number(searchParams.get('page')) || 1;
    
    const offset = (page - 1) * LIMIT;

    // Validar columnas permitidas para evitar SQL injection
    const allowedSorts = ['total_gastado', 'num_ordenes', 'gasto_promedio', 'name'];
    const allowedOrders = ['ASC', 'DESC'];
    
    const safeSort = allowedSorts.includes(sort) ? sort : 'total_gastado';
    const safeOrder = allowedOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    const result = await pool.query<CustomerValue>(
      `SELECT * FROM vw_customer_value ORDER BY ${safeSort} ${safeOrder} LIMIT $1 OFFSET $2`,
      [LIMIT, offset]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit: LIMIT,
        hasMore: result.rows.length === LIMIT,
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener clientes' },
      { status: 500 }
    );
  }
}
