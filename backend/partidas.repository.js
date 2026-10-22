const pool = require('./db');

async function crearPartida() {
  const { rows } = await pool.query(
    'INSERT INTO partidas DEFAULT VALUES RETURNING *'
  );
  return rows[0];
}

async function guardarIntento(partidaId, numero, resultado) {
  if (!Number.isInteger(partidaId) || partidaId < 1) {
    throw new Error('El ID de partida debe ser un entero positivo.');
  }
  if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
    throw new Error('El numero debe ser un entero entre 1 y 100.');
  }
  if (!['mayor', 'menor', 'correcto'].includes(resultado)) {
    throw new Error('Resultado no valido.');
  }

  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    const { rows } = await cliente.query(
      `INSERT INTO intentos (partida_id, numero, resultado)
       VALUES ($1, $2, $3) RETURNING *`,
      [partidaId, numero, resultado]
    );
    if (resultado === 'correcto') {
      await cliente.query(
        `UPDATE partidas SET ganada = TRUE,
         finalizada_en = COALESCE(finalizada_en, CURRENT_TIMESTAMP)
         WHERE id = $1`,
        [partidaId]
      );
    }
    await cliente.query('COMMIT');
    return rows[0];
  } catch (error) {
    await cliente.query('ROLLBACK');
    throw error;
  } finally {
    cliente.release();
  }
}

async function listarPartidas() {
  const { rows } = await pool.query(`
    SELECT p.id, p.iniciada_en, p.finalizada_en, p.ganada,
      COUNT(i.id)::INTEGER AS total_intentos,
      (COUNT(i.id) FILTER (WHERE i.resultado <> 'correcto'))::INTEGER
        AS intentos_fallidos
    FROM partidas p LEFT JOIN intentos i ON i.partida_id = p.id
    GROUP BY p.id ORDER BY p.id DESC LIMIT 50
  `);
  return rows;
}

module.exports = { crearPartida, guardarIntento, listarPartidas };
