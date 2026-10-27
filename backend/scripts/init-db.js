const fs = require('node:fs/promises');
const path = require('node:path');
const { Client } = require('pg');
const pool = require('../db');

async function iniciarBase() {
  const nombre = process.env.PGDATABASE;
  if (!nombre || !/^[a-z_][a-z0-9_]{0,62}$/.test(nombre)) {
    throw new Error('PGDATABASE debe usar minusculas, numeros o guion bajo (maximo 63 caracteres).');
  }

  const administrador = new Client({
    database: 'postgres',
    connectionTimeoutMillis: 5000,
  });

  try {
    await administrador.connect();
    const existente = await administrador.query(
      'SELECT 1 FROM pg_database WHERE datname = $1', [nombre]
    );
    if (existente.rowCount === 0) {
      // Los identificadores no aceptan $1; el nombre se valida antes de interpolarlo.
      await administrador.query(`CREATE DATABASE "${nombre}"`);
      console.log(`Base creada: ${nombre}`);
    } else {
      console.log(`La base ${nombre} ya existe; se conservaran sus datos.`);
    }
  } finally {
    await administrador.end();
  }

  const sql = await fs.readFile(path.join(__dirname, '..', 'database.sql'), 'utf8');
  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    await cliente.query(sql);
    await cliente.query('COMMIT');
    console.log('Tablas partidas e intentos listas.');
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}

iniciarBase()
  .catch((error) => {
    console.error('No se pudo preparar PostgreSQL:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
