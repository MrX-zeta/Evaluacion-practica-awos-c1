import pool from '@/lib/db';
import { CustomerValue } from '@/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const LIMIT = 5;

async function getCustomers(page: number) {
  const offset = (page - 1) * LIMIT;
  try {
    const res = await pool.query<CustomerValue>(
      `SELECT * FROM vw_customer_value 
       ORDER BY total_gastado DESC 
       LIMIT $1 OFFSET $2`,
      [LIMIT, offset]
    );
    return res.rows;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  
  const customers = await getCustomers(currentPage);

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Volver al Dashboard
      </Link>

      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-800">Valor de Clientes</h1>
        </div>
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-bold">
           Página {currentPage}
        </div>
      </div>

      {/* TABLA DE CLIENTES */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white mb-6 border border-gray-200">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 text-center">Órdenes</th>
              <th className="px-6 py-3 text-right">Total Gastado</th>
              <th className="px-6 py-3 text-right">Ticket Promedio</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4">{c.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {c.num_ordenes}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">
                    ${Number(c.total_gastado).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    ${Number(c.gasto_promedio).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No se encontraron clientes en esta página.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CONTROLES DE PAGINACIÓN (Requisito G) */}
      <div className="flex justify-center items-center gap-4">
        {currentPage > 1 ? (
          <Link 
            href={`?page=${currentPage - 1}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 shadow-sm"
          >
            &larr; Anterior
          </Link>
        ) : (
          <span className="px-4 py-2 border border-transparent text-gray-300 cursor-not-allowed">
            &larr; Anterior
          </span>
        )}

        {/* Solo mostramos "Siguiente" si trajimos la cantidad exacta del límite (significa que probablemente hay más) */}
        {customers.length === LIMIT ? (
          <Link 
            href={`?page=${currentPage + 1}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 shadow-sm"
          >
            Siguiente &rarr;
          </Link>
        ) : (
          <span className="px-4 py-2 border border-transparent text-gray-300 cursor-not-allowed">
            Siguiente &rarr;
          </span>
        )}
      </div>
    </div>
  );
}