# Evaluacion02_PW_Ejercicio01
EVALUACION 02 PW: Desarrollo de Aplicaciones Web con Integración Frontend- Backend

## Base de datos local

Requisitos: Node.js 22.12 o superior y PostgreSQL en ejecucion.

1. Desde `backend`, ejecutar `npm ci`.
2. Si no existe `.env`, copiar `.env.example` como `.env`.
3. Configurar en `.env` el usuario, contrasena, host y puerto de PostgreSQL.
   El nombre de la base es `adivina_numero`. No subir `.env` a Git.
4. Ejecutar `npm run db:init` desde `backend`. El usuario configurado debe
   poder crear bases de datos. El script crea la base si falta y prepara las
   tablas sin borrar registros. Repetirlo no modifica tablas existentes;
   cambios futuros al esquema requieren migraciones.
5. Ejecutar `npm run test:db` para verificar persistencia, victoria,
   validaciones y relaciones. La prueba elimina solo sus propios registros;
   los contadores de IDs pueden avanzar.

### Contrato para el integrante del backend

Importar desde `backend/partidas.repository.js`:

```javascript
const {
  crearPartida,
  guardarIntento,
  listarPartidas,
} = require('./partidas.repository');
```

- `await crearPartida()`: devuelve la fila creada, incluyendo `id`.
- `await guardarIntento(partidaId, numero, resultado)`: devuelve el intento
  guardado. Resultado admite `mayor`, `menor` y `correcto`. Si es correcto,
  tambien marca la partida como ganada dentro de la misma transaccion.
- `await listarPartidas()`: devuelve las ultimas 50 partidas con sus contadores.

Express debe generar y conservar el numero secreto en memoria, comparar los
intentos y pasar el resultado al repositorio. Las funciones propagan errores
para que las rutas respondan apropiadamente. El secreto no se almacena en SQL.
Las partidas no ganadas conservan `finalizada_en` vacio; este modelo no
distingue entre partidas activas y abandonadas.

La conexion se exporta desde `backend/db.js`. Al terminar un script o prueba,
usar `await pool.end()`; no cerrar el pool despues de cada solicitud HTTP.

La implementacion de las rutas y del frontend sigue pendiente y corresponde
a los otros integrantes.
