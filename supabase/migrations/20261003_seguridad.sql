-- ============================================================
-- Módulo de Seguridad / Cámaras — Paseo Aranjuez
-- Migración: 20261003_seguridad.sql
-- ============================================================

-- 1. ZONAS DE SEGURIDAD
-- Zonas físicas del mall. Cada zona puede agrupar una o varias tiendas.
CREATE TABLE IF NOT EXISTS zonas_seguridad (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        text NOT NULL,
  descripcion   text,
  piso          int4,
  color         text DEFAULT '#24614f',       -- Color de visualización en mapa
  id_tienda     uuid REFERENCES tiendas(id) ON DELETE SET NULL,
  activa        bool DEFAULT true,
  creado_en     timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now()
);

-- 2. CÁMARAS
-- Cámaras IP asociadas a zonas de seguridad.
CREATE TABLE IF NOT EXISTS camaras (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_zona        uuid REFERENCES zonas_seguridad(id) ON DELETE CASCADE,
  nombre         text NOT NULL,
  codigo         text UNIQUE,                  -- Ej: CAM-001
  url_rtsp       text,                         -- Stream RTSP (futuro)
  url_thumbnail  text,                         -- Snapshot URL (futuro)
  tipo           varchar(50) DEFAULT 'interior', -- 'entrada' | 'salida' | 'interior' | 'panoramica'
  estado         varchar(20) DEFAULT 'activa', -- 'activa' | 'inactiva' | 'mantenimiento'
  descripcion    text,
  creado_en      timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now()
);

-- 3. CONTEOS DE TRÁFICO (eventos en tiempo real)
-- Cada fila representa un evento de conteo por cámara.
CREATE TABLE IF NOT EXISTS conteos_trafico (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_camara        uuid REFERENCES camaras(id) ON DELETE CASCADE,
  id_zona          uuid REFERENCES zonas_seguridad(id) ON DELETE CASCADE,
  entradas         int4 DEFAULT 0,
  salidas          int4 DEFAULT 0,
  ocupacion_actual int4 DEFAULT 0,
  registrado_en    timestamptz DEFAULT now()
);

-- 4. HISTORIAL DE TRÁFICO POR HORA
-- Resumen agregado por zona, fecha y hora. Para dashboards y hora pico.
CREATE TABLE IF NOT EXISTS historial_trafico_hora (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_zona         uuid REFERENCES zonas_seguridad(id) ON DELETE CASCADE,
  fecha           date NOT NULL,
  hora            int2 NOT NULL CHECK (hora >= 0 AND hora <= 23),
  total_entradas  int4 DEFAULT 0,
  total_salidas   int4 DEFAULT 0,
  pico_ocupacion  int4 DEFAULT 0,
  creado_en       timestamptz DEFAULT now(),
  UNIQUE (id_zona, fecha, hora)
);

-- 5. REGLAS DE SEGURIDAD
-- Umbrales y condiciones para disparar alertas.
CREATE TABLE IF NOT EXISTS reglas_seguridad (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_zona        uuid REFERENCES zonas_seguridad(id) ON DELETE CASCADE,
  nombre         text NOT NULL,
  tipo           varchar(50) DEFAULT 'aforo_maximo',  -- 'aforo_maximo' | 'camara_offline' | 'anomalia'
  valor_umbral   int4,
  descripcion    text,
  activa         bool DEFAULT true,
  creado_en      timestamptz DEFAULT now()
);

-- 6. ALERTAS DE SEGURIDAD
-- Alertas generadas por reglas o manualmente.
CREATE TABLE IF NOT EXISTS alertas_seguridad (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_regla     uuid REFERENCES reglas_seguridad(id) ON DELETE SET NULL,
  id_zona      uuid REFERENCES zonas_seguridad(id) ON DELETE CASCADE,
  id_camara    uuid REFERENCES camaras(id) ON DELETE SET NULL,
  tipo_alerta  varchar(50) NOT NULL,          -- 'aforo_excedido' | 'camara_offline' | 'anomalia'
  descripcion  text,
  nivel        varchar(20) DEFAULT 'info',   -- 'info' | 'advertencia' | 'critico'
  resuelta     bool DEFAULT false,
  creado_en    timestamptz DEFAULT now()
);

-- ÍNDICES para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_conteos_zona ON conteos_trafico (id_zona, registrado_en DESC);
CREATE INDEX IF NOT EXISTS idx_conteos_camara ON conteos_trafico (id_camara, registrado_en DESC);
CREATE INDEX IF NOT EXISTS idx_historial_zona_fecha ON historial_trafico_hora (id_zona, fecha DESC);
CREATE INDEX IF NOT EXISTS idx_alertas_zona ON alertas_seguridad (id_zona, resuelta, creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_camaras_zona ON camaras (id_zona, estado);

-- HABILITAR REALTIME en las tablas de eventos
-- (Ejecutar en el dashboard de Supabase si no está habilitado por defecto)
-- ALTER PUBLICATION supabase_realtime ADD TABLE conteos_trafico;
-- ALTER PUBLICATION supabase_realtime ADD TABLE alertas_seguridad;
-- ALTER PUBLICATION supabase_realtime ADD TABLE camaras;

-- ============================================================
-- SEED DATA — Datos de demostración
-- ============================================================

-- Zonas de demostración
INSERT INTO zonas_seguridad (id, nombre, descripcion, piso, color) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Acceso Principal', 'Entrada y salida principal del mall', 0, '#24614f'),
  ('a1000000-0000-0000-0000-000000000002', 'Planta Baja', 'Zona comercial planta baja', 0, '#c6a569'),
  ('a1000000-0000-0000-0000-000000000003', 'Segundo Piso', 'Zona comercial segundo piso', 2, '#4a7a6d'),
  ('a1000000-0000-0000-0000-000000000004', 'Tercer Piso', 'Mercado gastronómico y entretenimiento', 3, '#8b5e3c'),
  ('a1000000-0000-0000-0000-000000000005', 'Cuarto Piso', 'Terraza gourmet y sky games', 4, '#6b5fa5'),
  ('a1000000-0000-0000-0000-000000000006', 'Estacionamiento', 'Área de estacionamiento exterior', -1, '#7a8a7a')
ON CONFLICT (id) DO NOTHING;

-- Cámaras de demostración
INSERT INTO camaras (id, id_zona, nombre, codigo, tipo, estado, descripcion) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Entrada Norte', 'CAM-001', 'entrada', 'activa', 'Acceso principal norte'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Entrada Sur', 'CAM-002', 'entrada', 'activa', 'Acceso secundario sur'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Salida Principal', 'CAM-003', 'salida', 'activa', 'Salida frente a estacionamiento'),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'PB Pasillo Central', 'CAM-004', 'interior', 'activa', 'Vista panorámica del pasillo central'),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'PB Zona PUMA', 'CAM-005', 'interior', 'activa', 'Frente a tienda PUMA'),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', '2do Piso Escaleras', 'CAM-006', 'interior', 'activa', 'Control de acceso escaleras mecánicas'),
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003', '2do Piso Central', 'CAM-007', 'panoramica', 'inactiva', 'Vista central segundo piso (en mantenimiento)'),
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000004', '3er Piso Food Court', 'CAM-008', 'interior', 'activa', 'Área gastronómica'),
  ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000005', 'Terraza Gourmet', 'CAM-009', 'panoramica', 'activa', 'Vista panorámica terraza'),
  ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000006', 'Estacionamiento A', 'CAM-010', 'interior', 'mantenimiento', 'Sector A del estacionamiento')
ON CONFLICT (id) DO NOTHING;

-- Reglas de demostración
INSERT INTO reglas_seguridad (id_zona, nombre, tipo, valor_umbral, descripcion) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Aforo máximo acceso', 'aforo_maximo', 50, 'Alerta si hay más de 50 personas en el acceso principal'),
  ('a1000000-0000-0000-0000-000000000002', 'Aforo planta baja', 'aforo_maximo', 300, 'Límite de aforo planta baja'),
  ('a1000000-0000-0000-0000-000000000004', 'Capacidad food court', 'aforo_maximo', 200, 'Capacidad máxima mercado gastronómico')
ON CONFLICT DO NOTHING;
