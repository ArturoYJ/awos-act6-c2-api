import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3001;

// Middlewares globales
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Montar todas las rutas bajo /api
app.use('/api', routes);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Levantar el servidor
app.listen(port, () => {
  console.log(`API Gateway corriendo en http://localhost:${port}`);
  console.log(`   Endpoints disponibles:`);
  console.log(`      POST /api/images/generate`);
  console.log(`      GET  /api/asteroids`);
  console.log(`      GET  /api/stocks/:symbol`);
});
