// Tipos para el servicio de Alpha Vantage (Mercado de Valores)

export interface StockDay {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface StockStats {
  high: number;
  low: number;
  latest: number;
  periodChange: number;
}

export interface ChartPoint {
  date: string;
  close: number;
}

export interface StockData {
  symbol: string;
  last_refreshed: string;
  time_zone: string;
  daily_prices: StockDay[];
  stats: StockStats;
  chart_data: ChartPoint[];
}
