import { Request, Response, NextFunction } from 'express';

/**
 * Middleware global de manejo de errores.
 * Captura cualquier error no manejado en las rutas y devuelve un JSON limpio.
 */
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Error no manejado:', err.message);

  // Errores con respuesta de la API externa
  if (err.response) {
    const status = err.response.status;
    let body = err.response.data;

    // Si la respuesta es un arraybuffer, convertirlo a texto
    if (body instanceof Buffer || body instanceof ArrayBuffer) {
      body = Buffer.from(new Uint8Array(body)).toString('utf-8');
    }

    console.error('   Status:', status);
    console.error('   Body:', typeof body === 'string' ? body : JSON.stringify(body));

    res.status(status >= 400 && status < 600 ? status : 500).json({
      error: err.message || 'Error en la API externa'
    });
    return;
  }

  // Errores genéricos
  res.status(500).json({
    error: err.message || 'Error interno del servidor'
  });
}
