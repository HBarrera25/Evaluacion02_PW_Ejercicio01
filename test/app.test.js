const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { crearAplicacion } = require("../app");

let server;
let baseUrl;
let guardarIntentos;
let partidasCreadas;

before(async () => {
  guardarIntentos = [];
  partidasCreadas = [];
  const repository = {
    async guardarIntento(...intento) {
      guardarIntentos.push(intento);
    },
    async crearPartida() {
      const partida = { id: partidasCreadas.length + 2 };
      partidasCreadas.push(partida);
      return partida;
    },
    async listarPartidas() {
      return [{ id: 1, intentos: 1 }];
    },
  };
  const app = crearAplicacion({
    repository,
    partidaInicial: { id: 1, numeroSecreto: 50 },
    randomNumber: () => 42,
  });

  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("rechaza intentos que no sean enteros entre 1 y 100", async () => {
  const response = await fetch(`${baseUrl}/guess`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ numero: 101 }),
  });

  assert.equal(response.status, 400);
  assert.equal(guardarIntentos.length, 0);
});

test("devuelve una pista y persiste el intento", async () => {
  const response = await fetch(`${baseUrl}/guess`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ numero: 40 }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    partidaId: 1,
    numero: 40,
    resultado: "mayor",
    mensaje: "El número secreto es mayor que tu intento.",
    gano: false,
  });
  assert.deepEqual(guardarIntentos[0], [1, 40, "mayor"]);
});

test("registra la victoria", async () => {
  const response = await fetch(`${baseUrl}/guess`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ numero: 50 }),
  });

  assert.equal(response.status, 200);
  assert.equal((await response.json()).gano, true);
  assert.deepEqual(guardarIntentos[1], [1, 50, "correcto"]);
});

test("inicia una nueva partida y usa su secreto", async () => {
  const resetResponse = await fetch(`${baseUrl}/reset`, { method: "POST" });

  assert.equal(resetResponse.status, 200);
  assert.equal((await resetResponse.json()).partidaId, 2);
  assert.equal(partidasCreadas.length, 1);

  const guessResponse = await fetch(`${baseUrl}/guess`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ numero: 42 }),
  });

  assert.equal((await guessResponse.json()).gano, true);
  assert.deepEqual(guardarIntentos[2], [2, 42, "correcto"]);
});

test("expone el historial y responde 404 a rutas desconocidas", async () => {
  const historyResponse = await fetch(`${baseUrl}/partidas`);
  const missingResponse = await fetch(`${baseUrl}/no-existe`);

  assert.deepEqual(await historyResponse.json(), [{ id: 1, intentos: 1 }]);
  assert.equal(missingResponse.status, 404);
});