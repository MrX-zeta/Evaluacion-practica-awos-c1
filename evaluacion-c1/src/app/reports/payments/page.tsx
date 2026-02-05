import pool from '@/lib/db';
import { PaymentMetric } from '@/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getPayments() {
  try {
    const res = await pool.query<PaymentMetric>(
      `SELECT * FROM vw_payment_mix ORDER BY total_monto DESC`
    );
    return res.rows;
  } catch (error) {
    return [];
  }
}

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Volver al Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mezcla de Pagos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {payments.map((p) => (
          <div key={p.method} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold capitalize text-gray-800">{p.method}</h2>
              <span className="text-2xl font-bold text-blue-600">{p.porcentaje_uso}%</span>
            </div>
            
            {/* Barra de Progreso Visual */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${p.porcentaje_uso}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-4 border-t pt-4">
              <div>
                <p className="uppercase text-xs font-semibold">Transacciones</p>
                <p className="text-lg">{p.total_transacciones}</p>
              </div>
              <div className="text-right">
                <p className="uppercase text-xs font-semibold">Monto Total</p>
                <p className="text-lg font-bold text-green-700">${Number(p.total_monto).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}