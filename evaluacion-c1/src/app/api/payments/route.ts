import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { PaymentMetric } from '@/types';

export async function GET() {
  try {
    const result = await pool.query<PaymentMetric>(
      `SELECT * FROM vw_payment_mix ORDER BY total_monto DESC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener métodos de pago' },
      { status: 500 }
    );
  }
}
