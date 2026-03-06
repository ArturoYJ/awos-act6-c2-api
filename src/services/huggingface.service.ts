import axios from 'axios';
import { ApiResponse } from '../types/common';
import { ImageData } from '../types/images.types';

/**
 * Servicio de conexión con Hugging Face Inference API.
 * Genera imágenes a partir de un prompt de texto usando FLUX.1-schnell.
 */
export async function generateImage(prompt: string): Promise<ApiResponse<ImageData>> {
  console.log(`Pidiendo imagen a Hugging Face para: "${prompt}"`);

  const response = await axios.post(
    'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
    { inputs: prompt },
    {
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'image/jpeg'
      },
      responseType: 'arraybuffer'
    }
  );

  // Transformación: bytes binarios → Base64 → Data URI
  const base64Image = Buffer.from(response.data, 'binary').toString('base64');
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;

  return {
    success: true,
    message: 'Imagen generada con éxito',
    data: {
      prompt_used: prompt,
      image_url: imageUrl
    }
  };
}
