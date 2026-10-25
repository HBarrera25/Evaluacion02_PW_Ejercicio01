# Evaluacion02_PW_Ejercicio01

API de un juego de adivinanza, desarrollada con Express y PostgreSQL.

## Requisitos

- Node.js 22.12 o superior
- PostgreSQL

## Configuración

Ejecuta estos pasos desde la raíz del repositorio:

1. Instala las dependencias del servidor con `npm --prefix backend ci`.
2. Copia `backend/.env.example` como `backend/.env` y configura `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` y `PGPASSWORD` para tu PostgreSQL local.
3. Ejecuta `npm run db:init` para crear la base de datos y sus tablas. El usuario de PostgreSQL necesita permiso para crear bases si la base indicada aún no existe. Si ya existe, se conservan sus datos.
4. Inicia el servidor con `npm start` (o `npm run dev` para reinicio automático).

El servidor queda disponible en `http://localhost:3000` de forma predeterminada.

## Estructura e integración

- `backend/app.js`: rutas y lógica del juego.
- `backend/server.js`: inicio del servidor.
- `backend/db.js` y `backend/partidas.repository.js`: conexión y persistencia compartidas por la API.
- `backend/database.sql`: esquema de referencia usado por `npm run db:init`.
- `frontend/`: interfaz React y Vite, todavía pendiente de implementación.

La configuración del servidor se carga siempre desde `backend/.env`, incluso al iniciarlo desde la raíz. Las dependencias del backend se administran únicamente en `backend/package.json`.

Para preparar el frontend, ejecuta `npm --prefix frontend ci` y luego `npm run dev:frontend` en otra terminal. Vite redirige `/guess`, `/reset` y `/partidas` al puerto 3000 del backend; si cambias ese puerto, actualiza `frontend/vite.config.js`. El montaje de React está preparado, pero `App.jsx` y los componentes aún deben implementarse antes de que la interfaz funcione.

## Rutas

- `POST /guess` recibe `{ "numero": 1 }` y devuelve si el secreto es mayor, menor o correcto.
- `POST /reset` crea una partida nueva.
- `GET /partidas` devuelve las últimas 50 partidas y su número de intentos.

El historial incluye `total_intentos` e `intentos_fallidos`; `intentos` se mantiene como alias de `total_intentos` para conservar el contrato de la API.

Los intentos deben ser números enteros del 1 al 100. Las partidas e intentos se guardan en PostgreSQL; el número secreto vive en memoria mientras se ejecuta el servidor.

## Pruebas

Ejecuta `npm test`. Las pruebas de las rutas usan un repositorio simulado y no requieren PostgreSQL.

Ejecuta `npm run test:db` después de configurar e inicializar PostgreSQL para comprobar la persistencia real. Esta prueba crea registros temporales y elimina los registros que creó al terminar.
