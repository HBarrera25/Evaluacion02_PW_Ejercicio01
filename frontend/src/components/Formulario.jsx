import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default function Formulario({
  numero,
  setNumero,
  onEnviar,
  cargando,
  gano,
}) {
  return (
    <Form onSubmit={onEnviar}>
      <FormGroup>
        <Label for="numero">Tu intento</Label>

        <Input
          id="numero"
          name="numero"
          type="number"
          min="1"
          max="100"
          step="1"
          value={numero}
          onChange={(evento) => setNumero(evento.target.value)}
          placeholder="Ejemplo: 50"
          aria-describedby="ayuda-numero"
          disabled={cargando || gano}
          required
        />

        <small id="ayuda-numero" className="text-muted">
          Escribe un número entero entre 1 y 100.
        </small>
      </FormGroup>

      <Button
        color="primary"
        type="submit"
        disabled={cargando || gano}
      >
        {cargando ? "Procesando..." : "Enviar intento"}
      </Button>
    </Form>
  );
}