require("dotenv").config();

const pool = require("./db");
const repository = require("./partidas.repository");
const { crearAplicacion } = require("./app");

function generarNumero() {
  return Math.floor(Math.random() * 100) + 1;
}

async function iniciarServidor() {
  try {
    const partida = await repository.crearPartida();
    const app = crearAplicacion({
      repository,
      partidaInicial: { id: partida.id, numeroSecreto: generarNumero() },
    });
    const port = process.env.PORT || 3000;

    return app.listen(port, () => {
      console.log(`Servidor disponible en http://localhost:${port}`);
      console.log(`Partida iniciada con ID: ${partida.id}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    await pool.end();
    process.exitCode = 1;
  }
}

if (require.main === module) {
  iniciarServidor();
}

module.exports = { iniciarServidor };