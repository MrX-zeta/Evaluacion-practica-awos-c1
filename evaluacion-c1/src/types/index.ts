export interface SalesMetric {
  sale_date: string;
  tickets: number;
  total_ventas: number;
  ticket_promedio: number;
}

export interface InventoryRisk {
  id: number;
  name: string;
  stock: number;
  category: string;
  risk_level: 'CRITICAL' | 'HIGH_RISK' | 'NORMAL';
}

export interface TopProduct {
  id: number;
  name: string;
  category: string;
  total_units: number;
  revenue: number;
  ranking: number;
}