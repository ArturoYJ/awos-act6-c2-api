import axios from 'axios';
import { ApiResponse } from '../types/common';
import { AsteroidData, Asteroid } from '../types/asteroids.types';

/**
 * Servicio de conexión con NASA NeoWs (Near Earth Object Web Service).
 * Obtiene la lista de asteroides cercanos a la Tierra en un rango de fechas.
 */
export async function getNearEarthObjects(startDate: string, endDate: string): Promise<ApiResponse<AsteroidData>> {
  console.log(`Consultando asteroides de ${startDate} a ${endDate}`);

  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const response = await axios.get(
    `https://api.nasa.gov/neo/rest/v1/feed`,
    {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: apiKey
      }
    }
  );

  const rawData = response.data;

  // Transformación: estructura anidada de la NASA → lista plana y limpia
  const asteroids: Asteroid[] = [];
  const dates = Object.keys(rawData.near_earth_objects);

  for (const date of dates) {
    for (const neo of rawData.near_earth_objects[date]) {
      const approach = neo.close_approach_data[0]; // Primer acercamiento
      asteroids.push({
        id: neo.id,
        name: neo.name,
        estimated_diameter_km: {
          min: neo.estimated_diameter.kilometers.estimated_diameter_min,
          max: neo.estimated_diameter.kilometers.estimated_diameter_max
        },
        is_potentially_hazardous: neo.is_potentially_hazardous_asteroid,
        close_approach_date: approach?.close_approach_date || date,
        velocity_km_h: approach?.relative_velocity?.kilometers_per_hour || 'N/A',
        miss_distance_km: approach?.miss_distance?.kilometers || 'N/A'
      });
    }
  }

  // Ordenar: los más peligrosos primero
  asteroids.sort((a, b) => Number(b.is_potentially_hazardous) - Number(a.is_potentially_hazardous));

  return {
    success: true,
    message: `${asteroids.length} asteroides encontrados cerca de la Tierra`,
    data: {
      total_count: rawData.element_count,
      date_range: { start: startDate, end: endDate },
      asteroids
    }
  };
}
