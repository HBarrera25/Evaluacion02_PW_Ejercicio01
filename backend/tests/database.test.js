const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const pool = require('../db');
const { crearPartida, guardarIntento, listarPartidas } = require('../partidas.repository');

after(() => pool.end());

test('guarda intentos y victoria; rechaza datos invalidos sin alterar la partida', async () => {
  const partida = await crearPartida();
  try {
    assert.equal(partida.ganada, false);
    await guardarIntento(partida.id, 50, 'mayor');
    await assert.rejects(guardarIntento(partida.id, 101, 'menor'));
    await assert.rejects(guardarIntento(partida.id, 60, 'invalido'));

    // Comprueba tambien la restriccion SQL, sin pasar por la validacion JS.
    await assert.rejects(
      pool.query('INSERT INTO intentos (partida_id, numero, resultado) VALUES ($1, 0, $2)',
        [partida.id, 'menor']),
      { code: '23514' }
    );

    await guardarIntento(partida.id, 75, 'correcto');
    const resumen = (await listarPartidas()).find((fila) => fila.id === partida.id);
    assert.equal(resumen.total_intentos, 2);
    assert.equal(resumen.intentos_fallidos, 1);
    assert.equal(resumen.ganada, true);
    assert.ok(resumen.finalizada_en);

    // La FK rechaza una partida inexistente y la transaccion hace rollback.
    await assert.rejects(guardarIntento(2147483647, 50, 'correcto'), { code: '23503' });
    assert.equal((await pool.query('SELECT 1')).rowCount, 1);
  } finally {
    // Elimina unicamente los registros que esta prueba acaba de crear.
    await pool.query('DELETE FROM intentos WHERE partida_id = $1', [partida.id]);
    await pool.query('DELETE FROM partidas WHERE id = $1', [partida.id]);
  }
});
