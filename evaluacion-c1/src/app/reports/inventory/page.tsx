import pool from '@/lib/db';
import { InventoryRisk } from '@/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getInventory(category?: string) {
  try {
    let query = `SELECT * FROM vw_inventory_risk`;
    const params: string[] = [];

    if (category && category !== 'Todas') {
      query += ` WHERE category = $1`;
      params.push(category);
    }
    
    query += ` ORDER BY stock ASC`;

    const result = await pool.query<InventoryRisk>(query, params);
    return result.rows;
  } catch (error) {
    return [];
  }
}

const getRiskBadge = (level: string) => {
  switch (level) {
    case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
    case 'HIGH_RISK': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-green-100 text-green-800 border-green-200';
  }
};

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category || 'Todas';
  const products = await getInventory(selectedCategory);

  const totalProducts = products.length;
  const riskyProducts = products.filter(p => p.risk_level !== 'NORMAL').length;
  const riskPercentage = totalProducts > 0 
    ? ((riskyProducts / totalProducts) * 100).toFixed(1) 
    : '0';

  const categories = ['Todas', 'Café', 'Postres', 'Bebidas Frías'];

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Volver al Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventario y Riesgo</h1>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-red-700 font-bold uppercase">Nivel de Riesgo Global</p>
            <p className="text-2xl font-bold text-gray-900">{riskPercentage}% del catálogo</p>
            <p className="text-sm text-gray-600">Requiere reabastecimiento inmediato</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <span className="mr-3 text-sm font-medium text-gray-700">Filtrar por Categoría:</span>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`?category=${cat}`}
              className={`px-4 py-2 text-sm font-medium border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } first:rounded-l-lg last:rounded-r-lg`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Categoría</th>
              <th className="px-6 py-3">Stock Actual</th>
              <th className="px-6 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                <td className="px-6 py-4">{row.category}</td>
                <td className="px-6 py-4 font-bold">{row.stock}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${getRiskBadge(row.risk_level)}`}>
                    {row.risk_level.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}