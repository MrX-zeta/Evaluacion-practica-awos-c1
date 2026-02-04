import pool from '@/lib/db';
import { SalesMetric } from '@/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getSalesData(from?: string, to?: string) {
  try {
    const startDate = from || '2020-01-01';
    const endDate = to || '2030-12-31';

    const result = await pool.query<SalesMetric>(
      `SELECT * FROM vw_sales_daily 
       WHERE sale_date BETWEEN $1 AND $2 
       ORDER BY sale_date DESC`,
      [startDate, endDate]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
}

export default async function SalesReportPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const sales = await getSalesData(params.from, params.to);

  const totalPeriodo = sales.reduce((acc, row) => acc + Number(row.total_ventas), 0);
  const totalTickets = sales.reduce((acc, row) => acc + Number(row.tickets), 0);

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Volver al Dashboard
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reporte de Ventas Diarias</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <form className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Desde:</label>
            <input 
              type="date" 
              name="from" 
              defaultValue={params.from}
              className="mt-1 block px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hasta:</label>
            <input 
              type="date" 
              name="to" 
              defaultValue={params.to}
              className="mt-1 block px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Filtrar
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-600 font-semibold uppercase">Venta Total del Periodo</p>
          <p className="text-2xl font-bold text-blue-900">${totalPeriodo.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <p className="text-sm text-purple-600 font-semibold uppercase">Total Clientes</p>
          <p className="text-2xl font-bold text-purple-900">{totalTickets}</p>
        </div>
      </div>
      
      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Tickets</th>
              <th className="px-6 py-3">Venta Total</th>
              <th className="px-6 py-3">Ticket Promedio</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {new Date(row.sale_date).toLocaleDateString()}
                  </td>
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
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No se encontraron ventas en el rango de fechas seleccionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}