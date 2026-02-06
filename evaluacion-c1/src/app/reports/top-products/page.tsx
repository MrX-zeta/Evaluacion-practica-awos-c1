import { TopProduct } from '@/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 5;

interface TopProductsResponse {
  success: boolean;
  data: TopProduct[];
  numberOne: TopProduct | null;
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

async function getTopProductsData(search: string, page: number): Promise<TopProductsResponse> {
  try {
    const params = new URLSearchParams();
    params.set('q', search);
    params.set('page', String(page));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/top-products?${params}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) throw new Error('Error fetching top products');
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching top products:', error);
    return { success: false, data: [], numberOne: null, pagination: { page: 1, limit: ITEMS_PER_PAGE, hasMore: false } };
  }
}

export default async function TopProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  
  const query = params.q || '';
  const currentPage = Number(params.page) || 1;

  const response = await getTopProductsData(query, currentPage);
  const products = response.data;
  const numberOne = response.numberOne;

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Volver al Dashboard
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ranking de Productos</h1>

      {numberOne && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8 flex items-center gap-4">
          <div>
            <p className="text-sm text-yellow-800 font-bold uppercase">Producto Estrella</p>
            <p className="text-xl font-bold text-gray-900">{numberOne.name}</p>
            <p className="text-sm text-gray-600">
              Ingresos: <span className="font-semibold text-green-700">${Number(numberOne.revenue).toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <form className="flex gap-2">
          <input 
            type="text" 
            name="q" 
            placeholder="Buscar producto..." 
            defaultValue={query}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <input type="hidden" name="page" value="1" />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Buscar
          </button>
        </form>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg bg-white mb-6">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="px-6 py-3"># Ranking</th>
              <th className="px-6 py-3">Producto</th>
              <th className="px-6 py-3">Categoría</th>
              <th className="px-6 py-3">Unidades</th>
              <th className="px-6 py-3">Ingresos Totales</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">#{row.ranking}</td>
                  <td className="px-6 py-4 font-medium">{row.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{row.total_units}</td>
                  <td className="px-6 py-4 text-green-600 font-bold">
                    ${Number(row.revenue).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4">
        {currentPage > 1 && (
          <Link 
            href={`?q=${query}&page=${currentPage - 1}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
          >
            &larr; Anterior
          </Link>
        )}
        
        {products.length === ITEMS_PER_PAGE && (
          <Link
            href={`?q=${query}&page=${currentPage + 1}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
          >
            Siguiente &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}