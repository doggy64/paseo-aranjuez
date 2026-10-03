// Mock data para el módulo de seguridad — Paseo Aranjuez
// Se usa cuando no hay Supabase configurado o en modo demo

import type {
  ZonaSeguridad,
  Camara,
  ConteoTrafico,
  HistorialTraficoHora,
  ReglaSeguridad,
  AlertaSeguridad,
  SecurityKPIs,
} from "../types";

export const ZONAS_MOCK: ZonaSeguridad[] = [
  {
    id: "a1000000-0000-0000-0000-000000000001",
    nombre: "Acceso Principal",
    descripcion: "Entrada y salida principal del mall",
    piso: 0,
    color: "#24614f",
    activa: true,
    camaras_activas: 3,
    camaras_inactivas: 0,
    ocupacion_actual: 42,
  },
  {
    id: "a1000000-0000-0000-0000-000000000002",
    nombre: "Planta Baja",
    descripcion: "Zona comercial planta baja",
    piso: 0,
    color: "#c6a569",
    activa: true,
    camaras_activas: 2,
    camaras_inactivas: 0,
    ocupacion_actual: 187,
  },
  {
    id: "a1000000-0000-0000-0000-000000000003",
    nombre: "Segundo Piso",
    descripcion: "Zona comercial segundo piso",
    piso: 2,
    color: "#4a7a6d",
    activa: true,
    camaras_activas: 1,
    camaras_inactivas: 1,
    ocupacion_actual: 93,
  },
  {
    id: "a1000000-0000-0000-0000-000000000004",
    nombre: "Tercer Piso",
    descripcion: "Mercado gastronómico y entretenimiento",
    piso: 3,
    color: "#8b5e3c",
    activa: true,
    camaras_activas: 1,
    camaras_inactivas: 0,
    ocupacion_actual: 156,
  },
  {
    id: "a1000000-0000-0000-0000-000000000005",
    nombre: "Cuarto Piso",
    descripcion: "Terraza gourmet y Sky Games",
    piso: 4,
    color: "#6b5fa5",
    activa: true,
    camaras_activas: 1,
    camaras_inactivas: 0,
    ocupacion_actual: 74,
  },
  {
    id: "a1000000-0000-0000-0000-000000000006",
    nombre: "Estacionamiento",
    descripcion: "Área de estacionamiento exterior",
    piso: -1,
    color: "#7a8a7a",
    activa: true,
    camaras_activas: 0,
    camaras_inactivas: 1,
    ocupacion_actual: 0,
  },
];

export const CAMARAS_MOCK: Camara[] = [
  {
    id: "b1000000-0000-0000-0000-000000000001",
    id_zona: "a1000000-0000-0000-0000-000000000001",
    nombre: "Entrada Norte",
    codigo: "CAM-001",
    tipo: "entrada",
    estado: "activa",
    descripcion: "Acceso principal norte",
    zona: { id: "a1000000-0000-0000-0000-000000000001", nombre: "Acceso Principal", piso: 0, color: "#24614f" },
  },
  {
    id: "b1000000-0000-0000-0000-000000000002",
    id_zona: "a1000000-0000-0000-0000-000000000001",
    nombre: "Entrada Sur",
    codigo: "CAM-002",
    tipo: "entrada",
    estado: "activa",
    descripcion: "Acceso secundario sur",
    zona: { id: "a1000000-0000-0000-0000-000000000001", nombre: "Acceso Principal", piso: 0, color: "#24614f" },
  },
  {
    id: "b1000000-0000-0000-0000-000000000003",
    id_zona: "a1000000-0000-0000-0000-000000000001",
    nombre: "Salida Principal",
    codigo: "CAM-003",
    tipo: "salida",
    estado: "activa",
    descripcion: "Salida frente a estacionamiento",
    zona: { id: "a1000000-0000-0000-0000-000000000001", nombre: "Acceso Principal", piso: 0, color: "#24614f" },
  },
  {
    id: "b1000000-0000-0000-0000-000000000004",
    id_zona: "a1000000-0000-0000-0000-000000000002",
    nombre: "PB Pasillo Central",
    codigo: "CAM-004",
    tipo: "interior",
    estado: "activa",
    descripcion: "Vista panorámica del pasillo central",
    zona: { id: "a1000000-0000-0000-0000-000000000002", nombre: "Planta Baja", piso: 0, color: "#c6a569" },
  },
  {
    id: "b1000000-0000-0000-0000-000000000005",
    id_zona: "a1000000-0000-0000-0000-000000000002",
    nombre: "PB Zona PUMA",
    codigo: "CAM-005",
    tipo: "interior",
    estado: "activa",
    descripcion: "Frente a tienda PUMA",
    zona: { id: "a1000000-0000-0000-0000-000000000002", nombre: "Planta Baja", piso: 0, color: "#c6a569" },
  },
  {
    id: "b1000000-0000-0000-0000-000000000006",
    id_zona: "a1000000-0000-0000-0000-000000000003",
    nombre: "2do Piso Escaleras",
    codigo: "CAM-006",
    tipo: "interior",
    estado: "activa",
    descripcion: "Control escaleras mecánicas",
    zona: { id: "a1000000-0000-0000-0000-000000000003", nombre: "Segundo Piso", piso: 2, color: "#4a7a6d" },
  },
  {
    id: "b1000000-0000-0000-0000-000000000007",
    id_zona: "a1000000-0000-0000-0000-000000000003",
    nombre: "2do Piso Central",
    codigo: "CAM-007",
    tipo: "panoramica",
    estado: "inactiva",
    descripcion: "Vista central segundo piso",
    zona: { id: "a1000000-0000-0000-0000-000000000003", nombre: "Segundo Piso", piso: 2, color: "#4a7a6d" },
  },
  {
    id: "b1000000-0000-0000-0000-000000000008",
    id_zona: "a1000000-0000-0000-0000-000000000004",
    nombre: "3er Piso Food Court",
    codigo: "CAM-008",
    tipo: "interior",
    estado: "activa",
    descripcion: "Área gastronómica",
    zona: { id: "a1000000-0000-0000-0000-000000000004", nombre: "Tercer Piso", piso: 3, color: "#8b5e3c" },
  },
  {
    id: "b1000000-0000-0000-0000-000000000009",
    id_zona: "a1000000-0000-0000-0000-000000000005",
    nombre: "Terraza Gourmet",
    codigo: "CAM-009",
    tipo: "panoramica",
    estado: "activa",
    descripcion: "Vista panorámica terraza",
    zona: { id: "a1000000-0000-0000-0000-000000000005", nombre: "Cuarto Piso", piso: 4, color: "#6b5fa5" },
  },
  {
    id: "b1000000-0000-0000-0000-000000000010",
    id_zona: "a1000000-0000-0000-0000-000000000006",
    nombre: "Estacionamiento A",
    codigo: "CAM-010",
    tipo: "interior",
    estado: "mantenimiento",
    descripcion: "Sector A del estacionamiento",
    zona: { id: "a1000000-0000-0000-0000-000000000006", nombre: "Estacionamiento", piso: -1, color: "#7a8a7a" },
  },
];

// Función simple para generar pseudo-aleatorios deterministas
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Historial de 24 horas para el dashboard (hoy)
// (Determinista para evitar Hydration mismatch entre SSR y Client)
const hoy = "2026-10-03"; // Hardcoded para evitar diferencias por timezone
export const HISTORIAL_HOY_MOCK: HistorialTraficoHora[] = Array.from({ length: 24 }, (_, hora) => {
  const r1 = seededRandom(hora + 1);
  const r2 = seededRandom(hora + 2);
  const r3 = seededRandom(hora + 3);

  return {
    id: `hist-${hora}`,
    id_zona: "a1000000-0000-0000-0000-000000000001",
    fecha: hoy,
    hora,
    total_entradas: hora < 8 ? Math.floor(r1 * 20) :
      hora < 11 ? Math.floor(50 + r1 * 80) :
      hora < 14 ? Math.floor(120 + r1 * 60) :
      hora < 17 ? Math.floor(80 + r1 * 50) :
      hora < 20 ? Math.floor(180 + r1 * 80) :
      Math.floor(30 + r1 * 40),
    total_salidas: hora < 8 ? Math.floor(r2 * 15) :
      hora < 11 ? Math.floor(30 + r2 * 60) :
      hora < 14 ? Math.floor(100 + r2 * 50) :
      hora < 17 ? Math.floor(60 + r2 * 40) :
      hora < 20 ? Math.floor(150 + r2 * 70) :
      Math.floor(40 + r2 * 50),
    pico_ocupacion: hora < 8 ? Math.floor(r3 * 30) :
      hora < 14 ? Math.floor(100 + r3 * 150) :
      hora < 19 ? Math.floor(200 + r3 * 200) :
      Math.floor(80 + r3 * 100),
  };
});

export const REGLAS_MOCK: ReglaSeguridad[] = [
  {
    id: "r001",
    id_zona: "a1000000-0000-0000-0000-000000000001",
    nombre: "Aforo máximo acceso",
    tipo: "aforo_maximo",
    valor_umbral: 50,
    descripcion: "Alerta si hay más de 50 personas simultáneas en el acceso",
    activa: true,
    zona: { id: "a1000000-0000-0000-0000-000000000001", nombre: "Acceso Principal" },
  },
  {
    id: "r002",
    id_zona: "a1000000-0000-0000-0000-000000000002",
    nombre: "Aforo planta baja",
    tipo: "aforo_maximo",
    valor_umbral: 300,
    descripcion: "Límite de aforo en planta baja",
    activa: true,
    zona: { id: "a1000000-0000-0000-0000-000000000002", nombre: "Planta Baja" },
  },
  {
    id: "r003",
    id_zona: "a1000000-0000-0000-0000-000000000004",
    nombre: "Capacidad food court",
    tipo: "aforo_maximo",
    valor_umbral: 200,
    descripcion: "Capacidad máxima mercado gastronómico tercer piso",
    activa: true,
    zona: { id: "a1000000-0000-0000-0000-000000000004", nombre: "Tercer Piso" },
  },
  {
    id: "r004",
    id_zona: "a1000000-0000-0000-0000-000000000003",
    nombre: "Cámara offline segundo piso",
    tipo: "camara_offline",
    descripcion: "Alerta cuando CAM-007 lleva más de 30 min offline",
    activa: false,
    zona: { id: "a1000000-0000-0000-0000-000000000003", nombre: "Segundo Piso" },
  },
];

export const ALERTAS_MOCK: AlertaSeguridad[] = [
  {
    id: "alerta-001",
    id_zona: "a1000000-0000-0000-0000-000000000003",
    id_camara: "b1000000-0000-0000-0000-000000000007",
    tipo_alerta: "camara_offline",
    descripcion: "CAM-007 sin señal desde hace 2 horas",
    nivel: "advertencia",
    resuelta: false,
    creado_en: "2026-10-03T10:00:00.000Z",
    zona: { id: "a1000000-0000-0000-0000-000000000003", nombre: "Segundo Piso" },
    camara: { id: "b1000000-0000-0000-0000-000000000007", nombre: "2do Piso Central", codigo: "CAM-007" },
  },
  {
    id: "alerta-002",
    id_zona: "a1000000-0000-0000-0000-000000000006",
    id_camara: "b1000000-0000-0000-0000-000000000010",
    tipo_alerta: "camara_offline",
    descripcion: "CAM-010 en mantenimiento programado",
    nivel: "info",
    resuelta: false,
    creado_en: "2026-10-02T12:00:00.000Z",
    zona: { id: "a1000000-0000-0000-0000-000000000006", nombre: "Estacionamiento" },
    camara: { id: "b1000000-0000-0000-0000-000000000010", nombre: "Estacionamiento A", codigo: "CAM-010" },
  },
];

export const KPIS_MOCK: SecurityKPIs = {
  total_personas_ahora: ZONAS_MOCK.reduce((acc, z) => acc + (z.ocupacion_actual ?? 0), 0),
  entradas_hoy: HISTORIAL_HOY_MOCK.reduce((acc, h) => acc + h.total_entradas, 0),
  salidas_hoy: HISTORIAL_HOY_MOCK.reduce((acc, h) => acc + h.total_salidas, 0),
  camaras_activas: CAMARAS_MOCK.filter((c) => c.estado === "activa").length,
  camaras_inactivas: CAMARAS_MOCK.filter((c) => c.estado === "inactiva").length,
  camaras_mantenimiento: CAMARAS_MOCK.filter((c) => c.estado === "mantenimiento").length,
  alertas_activas: ALERTAS_MOCK.filter((a) => !a.resuelta).length,
  zona_mas_activa: "Planta Baja",
};
