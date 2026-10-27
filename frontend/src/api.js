async function enviarPeticion(ruta, cuerpo = {}) {
  const respuesta = await fetch(ruta, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cuerpo),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje || "No se pudo completar la petición."
    );
  }

  return datos;
}

export function enviarIntento(numero) {
  return enviarPeticion("/guess", { numero });
}

export function reiniciarPartida() {
  return enviarPeticion("/reset");
}