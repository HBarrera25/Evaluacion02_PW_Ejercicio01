import {
  Badge,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

export default function Historial({ intentos }) {
  return (
    <section
      className="mt-4"
      aria-labelledby="titulo-historial"
    >
      <h2 id="titulo-historial" className="h5">
        Historial de la partida
      </h2>

      {intentos.length === 0 ? (
        <p className="text-muted">
          Todavía no has realizado intentos.
        </p>
      ) : (
        <ListGroup tag="ol" className="historial">
          {intentos.map((intento, indice) => (
            <ListGroupItem
              tag="li"
              key={indice}
              className="intento d-flex justify-content-between align-items-start gap-3"
            >
              <div>
                <strong>
                  #{indice + 1}: {intento.numero}
                </strong>

                <p className="mb-0 small">
                  {intento.mensaje}
                </p>
              </div>

              <Badge
                color={intento.gano ? "success" : "secondary"}
              >
                {intento.resultado}
              </Badge>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </section>
  );
}