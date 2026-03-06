# 🔌 API Gateway — SOA

API Gateway construido con **Express.js + TypeScript** que centraliza el acceso a 3 servicios externos mediante Arquitectura Orientada a Servicios.

## Endpoints

| Método | Ruta                   | Descripción                     | API externa           |
| ------ | ---------------------- | ------------------------------- | --------------------- |
| `POST` | `/api/images/generate` | Genera imágenes con IA          | Hugging Face (FLUX.1) |
| `GET`  | `/api/asteroids`       | Asteroides cercanos a la Tierra | NASA NeoWs            |
| `GET`  | `/api/stocks/:symbol`  | Precios diarios de acciones     | Alpha Vantage         |
| `GET`  | `/api/health`          | Health check del servicio       | —                     |

## Requisitos

- Node.js 20+
- Claves de API: [Hugging Face](https://huggingface.co/settings/tokens), [NASA](https://api.nasa.gov/), [Alpha Vantage](https://www.alphavantage.co/support/#api-key)

## Configuración

Crear archivo `.ENV` en la raíz:

```env
PORT=3001
HUGGINGFACE_API_KEY=tu_clave_de_API_de_huggingface
HISTORY_SERVICE_URL=http://localhost:3000/api/history
NASA_API_KEY=tu_clave_de_API_de_nasa
ALPHA_VANTAGE_API_KEY=tu_clave_de_API_de_alpha_vantage
```

## Ejecución local

```bash
npm install
npm run dev      # Desarrollo con hot-reload (nodemon)
```

## Ejecución con Docker

Este servicio se levanta junto con los demás desde el `docker-compose.yml` del repo **infra**. Ver instrucciones en ese repositorio.

## Estructura

```
src/
├── index.ts              # Entry point Express
├── middleware/            # Error handler centralizado
├── routes/               # Definición de endpoints
├── services/             # Conexiones a APIs externas
└── types/                # Interfaces TypeScript
```

## Tecnologías

Express 5 · TypeScript · Axios · Nodemon · Node 20

## Repositorios relacionados

| Repo                                                                 | Descripción                      |
| -------------------------------------------------------------------- | -------------------------------- |
| [awos-act6-c2-web](https://github.com/ArturoYJ/awos-act6-c2-web)     | Frontend Next.js                 |
| [awos-act6-c2-infra](https://github.com/ArturoYJ/awos-act6-c2-infra) | Infraestructura + Docker Compose |
