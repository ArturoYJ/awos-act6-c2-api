// Tipo genérico compartido para todas las respuestas de la API

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
