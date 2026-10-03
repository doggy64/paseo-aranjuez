// Tipos del módulo de seguridad — Paseo Aranjuez

export type CamaraEstado = "activa" | "inactiva" | "mantenimiento";
export type CamaraTipo = "entrada" | "salida" | "interior" | "panoramica";
export type AlertaNivel = "info" | "advertencia" | "critico";
export type ReglaTipo = "aforo_maximo" | "camara_offline" | "anomalia";

export type ZonaSeguridad = {
  id: string;
  nombre: string;
  descripcion?: string;
  piso?: number;
  color?: string;
  id_tienda?: string;
  activa: boolean;
  creado_en?: string;
  actualizado_en?: string;
  // Campos calculados (no en DB directamente)
  camaras_activas?: number;
  camaras_inactivas?: number;
  ocupacion_actual?: number;
};

export type Camara = {
  id: string;
  id_zona: string;
  nombre: string;
  codigo?: string;
  url_rtsp?: string;
  url_thumbnail?: string;
  tipo: CamaraTipo;
  estado: CamaraEstado;
  descripcion?: string;
  creado_en?: string;
  actualizado_en?: string;
  // Relación
  zona?: Pick<ZonaSeguridad, "id" | "nombre" | "piso" | "color">;
};

export type ConteoTrafico = {
  id: string;
  id_camara: string;
  id_zona: string;
  entradas: number;
  salidas: number;
  ocupacion_actual: number;
  registrado_en: string;
};

export type HistorialTraficoHora = {
  id: string;
  id_zona: string;
  fecha: string;
  hora: number;
  total_entradas: number;
  total_salidas: number;
  pico_ocupacion: number;
  creado_en?: string;
};

export type ReglaSeguridad = {
  id: string;
  id_zona: string;
  nombre: string;
  tipo: ReglaTipo;
  valor_umbral?: number;
  descripcion?: string;
  activa: boolean;
  creado_en?: string;
  // Relación
  zona?: Pick<ZonaSeguridad, "id" | "nombre">;
};

export type AlertaSeguridad = {
  id: string;
  id_regla?: string;
  id_zona: string;
  id_camara?: string;
  tipo_alerta: string;
  descripcion?: string;
  nivel: AlertaNivel;
  resuelta: boolean;
  creado_en: string;
  // Relaciones
  zona?: Pick<ZonaSeguridad, "id" | "nombre">;
  camara?: Pick<Camara, "id" | "nombre" | "codigo">;
};

// KPIs para el dashboard
export type SecurityKPIs = {
  total_personas_ahora: number;
  entradas_hoy: number;
  salidas_hoy: number;
  camaras_activas: number;
  camaras_inactivas: number;
  camaras_mantenimiento: number;
  alertas_activas: number;
  zona_mas_activa?: string;
};
