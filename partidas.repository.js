const pool = require("./db");

async function crearPartida() {
  const { rows } = await pool.query(
    "INSERT INTO partidas DEFAULT VALUES RETURNING id",
  );

  return rows[0];
}

async function guardarIntento(partidaId, numero, resultado) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "INSERT INTO intentos (partida_id, numero, resultado) VALUES ($1, $2, $3)",
      [partidaId, numero, resultado],
    );

    if (resultado === "correcto") {
      await client.query(
        "UPDATE partidas SET ganada = TRUE, finalizada_en = NOW() WHERE id = $1",
        [partidaId],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function listarPartidas() {
  const { rows } = await pool.query(`
    SELECT
      p.id,
      p.iniciada_en,
      p.finalizada_en,
      p.ganada,
      COUNT(i.id)::int AS intentos
    FROM partidas AS p
    LEFT JOIN intentos AS i ON i.partida_id = p.id
    GROUP BY p.id
    ORDER BY p.iniciada_en DESC
    LIMIT 50
  `);

  return rows;
}

module.exports = { crearPartida, guardarIntento, listarPartidas };