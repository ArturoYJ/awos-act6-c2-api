// Tipos para el servicio de NASA NeoWs (Asteroides)

export interface Asteroid {
  id: string;
  name: string;
  estimated_diameter_km: {
    min: number;
    max: number;
  };
  is_potentially_hazardous: boolean;
  close_approach_date: string;
  velocity_km_h: string;
  miss_distance_km: string;
}

export interface AsteroidData {
  total_count: number;
  date_range: { start: string; end: string };
  asteroids: Asteroid[];
}
