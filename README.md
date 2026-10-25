# Evaluacion02_PW_Ejercicio01

API de un juego de adivinanza, desarrollada con Express y PostgreSQL.

## Requisitos

- Node.js 18 o superior
- PostgreSQL

## Configuración

1. Crea una base de datos PostgreSQL para el juego.
2. Copia `.env.example` como `.env` y configura `DATABASE_URL` con las credenciales de tu base.
3. Ejecuta el contenido de `schema.sql` en esa base de datos.
4. Instala las dependencias con `npm install`.
5. Inicia el servidor con `npm start`.

El servidor queda disponible en `http://localhost:3000` de forma predeterminada.

## Rutas

- `POST /guess` recibe `{ "numero": 1 }` y devuelve si el secreto es mayor, menor o correcto.
- `POST /reset` crea una partida nueva.
- `GET /partidas` devuelve las últimas 50 partidas y su número de intentos.

Los intentos deben ser números enteros del 1 al 100. Las partidas e intentos se guardan en PostgreSQL; el número secreto vive en memoria mientras se ejecuta el servidor.

## Pruebas

Ejecuta `npm test`. Las pruebas de las rutas usan un repositorio simulado y no requieren PostgreSQL.
