import { Router } from 'express';
import imagesRouter from './images.routes';
import asteroidsRouter from './asteroids.routes';
import stocksRouter from './stocks.routes';

const router = Router();

// Montar sub-rutas
router.use('/images', imagesRouter);       // POST /api/images/generate
router.use('/asteroids', asteroidsRouter); // GET  /api/asteroids
router.use('/stocks', stocksRouter);       // GET  /api/stocks/:symbol

export default router;
