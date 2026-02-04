import pool from '@/lib/db';
import { SalesMetric } from '@/types';

export const dynamic = 'force-dynamic';

async function getSalesData() {
  try {
    const result = await pool.query<SalesMetric>(
      `SELECT * FROM vw_sales_daily ORDER BY sale_date DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
}

export default async function SalesReportPage() {
  const sales = await getSalesData();

  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">Reporte de Ventas Diarias</h1>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Tickets (Clientes)</th>
              <th className="px-6 py-3">Venta Total</th>
              <th className="px-6 py-3">Ticket Promedio</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((row, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(row.sale_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{row.tickets}</td>
                  <td className="px-6 py-4 text-green-600 font-bold">
                    ${Number(row.total_ventas).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    ${Number(row.ticket_promedio).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  No hay datos disponibles o la Vista no existe.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}