-- Ejecutar una sola vez sobre la base adivina_numero previamente creada.

CREATE TABLE partidas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    iniciada_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finalizada_en TIMESTAMPTZ,
    ganada BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE intentos (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    partida_id INTEGER NOT NULL REFERENCES partidas(id),
    numero INTEGER NOT NULL CHECK (numero BETWEEN 1 AND 100),
    resultado VARCHAR(8) NOT NULL
        CHECK (resultado IN ('mayor', 'menor', 'correcto')),
    creado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_intentos_partida ON intentos(partida_id);
