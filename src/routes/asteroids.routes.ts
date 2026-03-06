import { Router, Request, Response, NextFunction } from 'express';
import { getNearEarthObjects } from '../services/nasa.service';

const router = Router();

/**
 * GET /api/asteroids
 * Obtiene asteroides cercanos a la Tierra en un rango de fechas.
 * Query params: start_date (YYYY-MM-DD), end_date (YYYY-MM-DD)
 * Si no se proveen, usa los próximos 7 días.
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const startDate = (req.query.start_date as string) || today.toISOString().split('T')[0];
    const endDate = (req.query.end_date as string) || nextWeek.toISOString().split('T')[0];

    // Validar formato de fecha YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return res.status(400).json({ error: 'Formato de fecha inválido. Usa YYYY-MM-DD (ej: 2026-03-05)' });
    }

    const result = await getNearEarthObjects(startDate, endDate);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
