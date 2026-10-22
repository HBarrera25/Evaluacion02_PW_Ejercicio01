const path = require('node:path');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });

const pool = new Pool({ connectionTimeoutMillis: 5000 });

pool.on('error', (error) => {
  console.error('Error de conexion con PostgreSQL:', error.message);
});

module.exports = pool;
