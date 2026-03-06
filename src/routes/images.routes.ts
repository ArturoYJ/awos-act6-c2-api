import { Router, Request, Response, NextFunction } from 'express';
import { generateImage } from '../services/huggingface.service';
import axios from 'axios';

const router = Router();

/**
 * POST /api/images/generate
 * Genera una imagen a partir de un prompt usando Hugging Face FLUX.1-schnell.
 */
router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es requerido' });
  }

  // Tolerancia a Fallos: Guardar historial de forma asíncrona
  if (process.env.HISTORY_SERVICE_URL) {
    axios.post(process.env.HISTORY_SERVICE_URL, { prompt })
      .then(() => console.log('Historial guardado en Repo 3 (PostgreSQL)'))
      .catch(() => console.error('Advertencia: Repo 3 no disponible. Continuando...'));
  }

  try {
    const result = await generateImage(prompt);
    res.status(200).json(result);
  } catch (error: any) {
    // Hugging Face devuelve 503 si el modelo se está cargando
    if (error.response?.status === 503) {
      return res.status(503).json({
        error: 'El modelo de IA se está cargando. Intenta de nuevo en 20 segundos.'
      });
    }
    next(error);
  }
});

export default router;
