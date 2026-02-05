import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Encabezado del Dashboard */}
      <header className="mb-10 border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Cafetería Analytics
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Sistema de inteligencia de negocios y reportes operativos
        </p>
      </header>

      {/* Grid de Tarjetas de Navegación */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Reporte de Ventas */}
        <Link href="/reports/sales">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Ventas Diarias
              </h2>
              <p className="text-sm text-gray-500">
                Análisis de ingresos, volumen de tickets y ticket promedio por día.
              </p>
            </div>
          </div>
        </Link>

        {/* 2. Reporte de Productos Top */}
        <Link href="/reports/top-products">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Ranking Productos
              </h2>
              <p className="text-sm text-gray-500">
                Los productos más vendidos y rentables. Incluye buscador.
              </p>
            </div>
          </div>
        </Link>

        {/* 3. Reporte de Inventario */}
        <Link href="/reports/inventory">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Riesgo Inventario
              </h2>
              <p className="text-sm text-gray-500">
                Alertas de stock crítico y reabastecimiento por categoría.
              </p>
            </div>
          </div>
        </Link>

        {/* 4. Reporte de Clientes */}
        <Link href="/reports/customers">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Valor de Clientes
              </h2>
              <p className="text-sm text-gray-500">
                Métricas de lealtad, frecuencia de compra y valor de vida (LTV).
              </p>
            </div>
          </div>
        </Link>

        {/* 5. Reporte de Pagos */}
        <Link href="/reports/payments">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Métodos de Pago
              </h2>
              <p className="text-sm text-gray-500">
                Preferencias de pago y distribución de ingresos.
              </p>
            </div>
          </div>
        </Link>

      </div>

      {/* Footer simple */}
      <footer className="mt-16 text-center text-gray-400 text-sm">
        <p>Evaluación Práctica Unidad 1 — AWOS & BDA</p>
      </footer>
    </main>
  );
}