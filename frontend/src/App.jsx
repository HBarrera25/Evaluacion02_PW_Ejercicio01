import { useEffect, useState } from "react";

import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Container,
} from "reactstrap";

import { enviarIntento, reiniciarPartida } from "./api";

import Formulario from "./components/Formulario";
import Historial from "./components/Historial";

export default function App() {
  const [numero, setNumero] = useState("");

  const [historial, setHistorial] = useState([]);

  const [intentosFallidos, setIntentosFallidos] = useState([]);

  const [mensaje, setMensaje] = useState(
    "Adivina un número entre 1 y 100."
  );

  const [gano, setGano] = useState(false);

  const [cargando, setCargando] = useState(false);

  const [error, setError] = useState("");

  // Actualiza el título cuando cambia el estado de victoria.
  useEffect(() => {
    document.title = gano
      ? "¡Ganaste! | Adivina el número"
      : "Adivina el número";
  }, [gano]);

  async function manejarIntento(evento) {
    evento.preventDefault();

    if (cargando || gano) {
      return;
    }

    // Los inputs entregan texto; lo convertimos a número.
    const valor = Number(numero);

    if (
      numero.trim() === "" ||
      !Number.isInteger(valor) ||
      valor < 1 ||
      valor > 100
    ) {
      setError("Escribe un número entero entre 1 y 100.");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const datos = await enviarIntento(valor);

      const intento = {
        numero: datos.numero,
        resultado: datos.resultado,
        mensaje: datos.mensaje,
        gano: datos.gano,
      };

      // Guarda todos los intentos, incluido el ganador.
      setHistorial((anteriores) => [
        ...anteriores,
        intento,
      ]);

      // Guarda por separado únicamente los fallidos.
      if (!datos.gano) {
        setIntentosFallidos((anteriores) => [
          ...anteriores,
          intento,
        ]);
      }

      setMensaje(datos.mensaje);
      setGano(datos.gano);
      setNumero("");
    } catch (errorPeticion) {
      setError(
        errorPeticion.message ||
          "No se pudo conectar con el servidor."
      );
    } finally {
      setCargando(false);
    }
  }

  async function manejarReinicio() {
    if (cargando) {
      return;
    }

    setCargando(true);
    setError("");

    try {
      const datos = await reiniciarPartida();

      // Limpia el estado solo si el servidor logró reiniciar.
      setNumero("");
      setHistorial([]);
      setIntentosFallidos([]);
      setMensaje(datos.mensaje);
      setGano(datos.gano);
    } catch (errorPeticion) {
      setError(
        errorPeticion.message ||
          "No se pudo reiniciar la partida."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <Container className="py-5">
      <Card className="juego mx-auto shadow-sm">
        <CardBody className="p-4">
          <h1 className="h2">Adivina el número</h1>

          <p className="text-muted">
            Hay un número misterioso entre 1 y 100.
            ¡Sigue las pistas y descúbrelo!
          </p>

          <div className="d-flex gap-2 flex-wrap mb-3">
            <Badge color="primary">
              Intentos totales: {historial.length}
            </Badge>

            <Badge color="secondary">
              Intentos fallidos: {intentosFallidos.length}
            </Badge>
          </div>

          <div aria-live="polite">
            <Alert color={gano ? "success" : "info"}>
              {mensaje}
            </Alert>
          </div>

          {error && (
            <Alert color="danger" role="alert">
              {error}
            </Alert>
          )}

          <Formulario
            numero={numero}
            setNumero={setNumero}
            onEnviar={manejarIntento}
            cargando={cargando}
            gano={gano}
          />

          {gano && (
            <p className="fw-bold text-success mt-3">
              Terminaste la partida en {historial.length}
              {" "}intento(s).
            </p>
          )}

          <Button
            color="secondary"
            outline
            className="mt-3"
            onClick={manejarReinicio}
            disabled={cargando}
          >
            Nueva partida
          </Button>

          <Historial intentos={historial} />
        </CardBody>
      </Card>
    </Container>
  );
}
