import { Router, Request, Response, NextFunction } from 'express';
import { getDailyStockPrices } from '../services/stocks.service';

const router = Router();

/**
 * GET /api/stocks/:symbol
 * Obtiene precios diarios de una acción bursátil.
 * Ejemplo: GET /api/stocks/AAPL
 */
router.get('/:symbol', async (req: Request, res: Response, next: NextFunction) => {
  const { symbol } = req.params;

  if (!symbol) {
    return res.status(400).json({ error: 'El símbolo de la acción es requerido (ej: AAPL, MSFT, TSLA)' });
  }

  try {
    const result = await getDailyStockPrices(symbol as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
