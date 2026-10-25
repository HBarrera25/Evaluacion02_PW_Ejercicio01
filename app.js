const express = require("express");

function generarNumero() {
  return Math.floor(Math.random() * 100) + 1;
}

function crearAplicacion({ repository, partidaInicial, randomNumber = generarNumero }) {
  const app = express();
  let partidaActual = partidaInicial;

  app.use(express.json());

  app.post("/guess", async (req, res, next) => {
    const numero = req.body?.numero;

    if (
      typeof numero !== "number" ||
      !Number.isInteger(numero) ||
      numero < 1 ||
      numero > 100
    ) {
      return res.status(400).json({
        mensaje: "Debes enviar un número entero entre 1 y 100.",
      });
    }

    if (!partidaActual) {
      return res.status(503).json({ mensaje: "No hay una partida activa." });
    }

    const partida = partidaActual;
    let resultado = "correcto";
    let mensaje = "¡Correcto! Adivinaste el número.";

    if (numero < partida.numeroSecreto) {
      resultado = "mayor";
      mensaje = "El número secreto es mayor que tu intento.";
    } else if (numero > partida.numeroSecreto) {
      resultado = "menor";
      mensaje = "El número secreto es menor que tu intento.";
    }

    try {
      await repository.guardarIntento(partida.id, numero, resultado);

      return res.status(200).json({
        partidaId: partida.id,
        numero,
        resultado,
        mensaje,
        gano: resultado === "correcto",
      });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/reset", async (_req, res, next) => {
    try {
      const partida = await repository.crearPartida();
      partidaActual = { id: partida.id, numeroSecreto: randomNumber() };

      return res.status(200).json({
        partidaId: partidaActual.id,
        mensaje: "Nueva partida iniciada. Adivina un número entre 1 y 100.",
        gano: false,
      });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/partidas", async (_req, res, next) => {
    try {
      const partidas = await repository.listarPartidas();
      return res.status(200).json(partidas);
    } catch (error) {
      return next(error);
    }
  });

  app.use((_req, res) => {
    return res.status(404).json({ mensaje: "Ruta no encontrada." });
  });

  app.use((error, _req, res, _next) => {
    if (error.type === "entity.parse.failed") {
      return res.status(400).json({
        mensaje: "El cuerpo de la petición debe ser un JSON válido.",
      });
    }

    console.error("Error del servidor:", error.message);
    return res.status(500).json({
      mensaje: "No se pudo completar la operación. Inténtalo nuevamente.",
    });
  });

  return app;
}

module.exports = { crearAplicacion };