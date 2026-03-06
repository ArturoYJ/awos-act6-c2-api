import axios from 'axios';
import { ApiResponse } from '../types/common';
import { StockData, StockDay, StockStats, ChartPoint } from '../types/stocks.types';

/**
 * Servicio de conexión con Alpha Vantage.
 * Obtiene precios diarios (OHLCV) de una acción bursátil.
 */
export async function getDailyStockPrices(symbol: string): Promise<ApiResponse<StockData>> {
  console.log(`Consultando precios de ${symbol.toUpperCase()} en Alpha Vantage`);

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
  const response = await axios.get(
    'https://www.alphavantage.co/query',
    {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol.toUpperCase(),
        outputsize: 'compact', // Últimos 100 días
        datatype: 'json',
        apikey: apiKey
      }
    }
  );

  const rawData = response.data;

  // Verificar si la API devolvió un error (API key inválida, límite alcanzado, etc.)
  if (rawData['Error Message']) {
    throw new Error(`Símbolo "${symbol}" no encontrado en Alpha Vantage`);
  }
  if (rawData['Note'] || rawData['Information']) {
    throw new Error('Se alcanzó el límite de peticiones de Alpha Vantage (5/min). Intenta de nuevo en un momento.');
  }

  const metaData = rawData['Meta Data'];
  const timeSeries = rawData['Time Series (Daily)'];

  if (!timeSeries) {
    throw new Error('No se encontraron datos para este símbolo');
  }

  // Transformación: objeto con claves de fecha → array ordenado
  const dailyPrices: StockDay[] = Object.entries(timeSeries)
    .slice(0, 30) // Últimos 30 días
    .map(([date, values]: [string, any]) => ({
      date,
      open: values['1. open'],
      high: values['2. high'],
      low: values['3. low'],
      close: values['4. close'],
      volume: values['5. volume']
    }));

  // Calcular estadísticas del periodo
  const closes = dailyPrices.map(d => parseFloat(d.close));
  const high = Math.max(...closes);
  const low = Math.min(...closes);
  const latest = closes[0];
  const oldest = closes[closes.length - 1];
  const periodChange = ((latest - oldest) / oldest) * 100;

  const stats: StockStats = { high, low, latest, periodChange };

  // Preparar datos para gráfico (orden cronológico)
  const chartData: ChartPoint[] = [...dailyPrices].reverse().map(day => ({
    date: day.date.slice(5), // "03-05" en vez de "2026-03-05"
    close: parseFloat(day.close),
  }));

  return {
    success: true,
    message: `Precios diarios de ${symbol.toUpperCase()} obtenidos con éxito`,
    data: {
      symbol: metaData['2. Symbol'],
      last_refreshed: metaData['3. Last Refreshed'],
      time_zone: metaData['5. Time Zone'],
      daily_prices: dailyPrices,
      stats,
      chart_data: chartData
    }
  };
}
