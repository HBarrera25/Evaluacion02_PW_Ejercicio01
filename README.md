# Adivina el número — Evaluación 02, Ejercicio 01

Juego web desarrollado por **FluxCode** para Programación Web. El objetivo es descubrir un número misterioso entre **1 y 100**, siguiendo las pistas de cada intento.

## Equipo FluxCode

| Integrante | Carné |
| --- | --- |
| Heraldo Riquelmy Barrera Gómez | 00226325 |
| Jorge Alberto Escobar Menjivar | 00072325 |
| Erick Jose Claros López | 00071125 |
| Robert Stanley Colocho Andrade | 00054625 |
| Diego Leonardo Melara Munguía | 00180825 |

## ¿De qué trata el juego?

Al iniciar el backend se genera un número aleatorio del 1 al 100. El jugador escribe un número entero y pulsa **Enviar intento**. La aplicación indica si el número secreto es mayor, menor o si acertó.

La pantalla muestra todos los números intentados, el total de intentos y la cantidad de intentos fallidos. Al acertar, aparece un mensaje de victoria y se deshabilita el formulario. **Nueva partida** genera otro número y limpia el historial y los contadores de la pantalla.

Las partidas y los intentos se guardan en PostgreSQL. El número secreto permanece en memoria en el backend; el historial visible se mantiene en el estado de React y se limpia al recargar la página.

## Tecnologías y requisitos

- **Frontend:** React, Vite, Bootstrap y Reactstrap.
- **Backend:** Node.js y Express.
- **Base de datos:** PostgreSQL.
- Para ejecutar el proyecto necesitas **Node.js 22.12 o superior**, npm, PostgreSQL instalado y en ejecución, y un navegador web.
- Para clonar el repositorio necesitas Git.

## Instalación y configuración inicial

### 1. Clonar el proyecto

```powershell
git clone --branch develop https://github.com/HBarrera25/Evaluacion02_PW_Ejercicio01.git
cd Evaluacion02_PW_Ejercicio01
```

Si ya tienes el proyecto, abre una terminal en su carpeta raíz. Ejecuta todos los comandos siguientes desde esa carpeta.

### 2. Instalar las dependencias

```powershell
npm --prefix backend ci
npm --prefix frontend ci
```

### 3. Configurar PostgreSQL

Copia `backend/.env.example` como `backend/.env`. Si ya tienes un archivo `.env` configurado, conserva ese archivo. Para crear la copia en PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

Edita los valores de `backend/.env` de acuerdo con tu instalación:

```dotenv
PORT=3000
PGHOST=localhost
PGPORT=5432
PGDATABASE=adivina_numero
PGUSER=postgres
PGPASSWORD=TU_CONTRASENA
```

Reemplaza `TU_CONTRASENA` por la contraseña de tu usuario de PostgreSQL. El archivo `.env` está excluido de Git para no publicar las credenciales.

### 4. Crear la base de datos y las tablas

Con PostgreSQL iniciado, ejecuta:

```powershell
npm run db:init
```

Este comando crea la base de datos si no existe y prepara las tablas `partidas` e `intentos`, conservando los datos existentes. El usuario configurado necesita permiso para crear bases de datos si la base todavía no existe.

## Ejecutar el programa

Mantén **dos terminales abiertas** en la carpeta raíz del proyecto.

### Terminal 1: backend

```powershell
npm start
```

Debería aparecer un mensaje como:

```text
Servidor disponible en http://localhost:3000
Partida iniciada con ID: ...
```

Para reiniciar automáticamente el backend al editar su código, puedes usar `npm run dev` en lugar de `npm start`.

### Terminal 2: frontend

```powershell
npm run dev:frontend
```

Abre la dirección que indique Vite, normalmente **http://localhost:5173**. Esa es la interfaz para jugar; el puerto 3000 corresponde a la API. Si el puerto 5173 está ocupado, Vite puede indicar otro.

Para detener el programa, presiona **Ctrl+C** en cada terminal. En ejecuciones posteriores basta con iniciar PostgreSQL y ejecutar los comandos del backend y del frontend.

## Cómo probar el juego

1. Abre la interfaz y envía un número, por ejemplo `50`.
2. Sigue las pistas de mayor o menor y verifica que cada intento aparezca en el historial.
3. Comprueba que se actualicen los contadores de intentos totales y fallidos.
4. Intenta enviar un campo vacío, un decimal o un número fuera del rango 1 a 100: el formulario debe impedirlo.
5. Al acertar, verifica el mensaje de victoria y que el formulario quede deshabilitado.
6. Pulsa **Nueva partida**: el historial y los contadores se limpian y puedes jugar de nuevo.

Con el backend activo, también puedes abrir http://localhost:3000/partidas para consultar las últimas 50 partidas guardadas en formato JSON.

## Pruebas automáticas y compilación

Pruebas de las rutas de la API, sin necesidad de PostgreSQL:

```powershell
npm test
```

Prueba de persistencia real, después de configurar e inicializar PostgreSQL:

```powershell
npm run test:db
```

Esta prueba crea registros temporales y elimina únicamente los registros que creó al terminar.

Para verificar que el frontend compila:

```powershell
npm --prefix frontend run build
```

## Estructura del proyecto

- `backend/app.js`: rutas y lógica del juego.
- `backend/server.js`: inicio del servidor y generación del número inicial.
- `backend/db.js`: conexión a PostgreSQL.
- `backend/partidas.repository.js`: persistencia de partidas e intentos.
- `backend/database.sql`: esquema de las tablas.
- `backend/scripts/init-db.js`: inicialización de la base de datos.
- `backend/tests/`: pruebas de la API y de persistencia.
- `frontend/src/App.jsx`: estado e interfaz principal del juego.
- `frontend/src/api.js`: comunicación con el backend.
- `frontend/src/components/`: formulario e historial de intentos.
- `frontend/src/styles.css`: estilos de la interfaz.

## Rutas de la API

| Método y ruta | Descripción |
| --- | --- |
| `POST /guess` | Recibe `{ "numero": 50 }` y responde `mayor`, `menor` o `correcto`, junto con el mensaje y el estado de victoria. |
| `POST /reset` | Crea una partida con un nuevo número secreto. |
| `GET /partidas` | Devuelve las últimas 50 partidas con sus contadores de intentos. |

El historial de partidas incluye `total_intentos` e `intentos_fallidos`; `intentos` se mantiene como alias de `total_intentos`.

## Problemas frecuentes

- **El backend no conecta con PostgreSQL:** comprueba que el servicio esté iniciado y que los valores de `backend/.env` sean correctos.
- **Faltan la base de datos o las tablas:** ejecuta `npm run db:init` después de configurar las credenciales.
- **La interfaz no puede enviar intentos:** verifica que el backend siga activo y que estés abriendo la dirección de Vite.
- **Cambiaste el puerto del backend:** actualiza también los destinos de `/guess`, `/reset` y `/partidas` en `frontend/vite.config.js`, que apuntan al puerto 3000 de forma predeterminada.

La configuración del backend siempre se carga desde `backend/.env`, incluso al iniciarlo desde la raíz del proyecto.
