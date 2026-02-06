import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { SalesMetric } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from') || '2020-01-01';
    const to = searchParams.get('to') || '2030-12-31';

    const result = await pool.query<SalesMetric>(
      `SELECT * FROM vw_sales_daily 
       WHERE sale_date BETWEEN $1 AND $2 
       ORDER BY sale_date DESC`,
      [from, to]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener ventas' },
      { status: 500 }
    );
  }
}
