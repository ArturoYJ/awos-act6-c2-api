// Tipos para el servicio de Alpha Vantage (Mercado de Valores)

export interface StockDay {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface StockData {
  symbol: string;
  last_refreshed: string;
  time_zone: string;
  daily_prices: StockDay[];
}
