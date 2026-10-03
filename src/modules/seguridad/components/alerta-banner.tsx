"use client";

import { AlertTriangle, Info, Zap, Check, Camera, MapPin } from "lucide-react";
import type { AlertaSeguridad } from "../types";

const NIVEL_CONFIG = {
  info: {
    icon: Info,
    className: "alerta-info",
    label: "Información",
  },
  advertencia: {
    icon: AlertTriangle,
    className: "alerta-advertencia",
    label: "Advertencia",
  },
  critico: {
    icon: Zap,
    className: "alerta-critico",
    label: "Crítico",
  },
};

function tiempoRelativo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "Ahora mismo";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  return `Hace ${Math.floor(hrs / 24)}d`;
}

interface AlertaBannerProps {
  alerta: AlertaSeguridad;
  onResolver?: (id: string) => void;
  compact?: boolean;
}

export function AlertaBanner({ alerta, onResolver, compact = false }: AlertaBannerProps) {
  const config = NIVEL_CONFIG[alerta.nivel] ?? NIVEL_CONFIG.info;
  const Icon = config.icon;

  return (
    <div className={`alerta-banner ${config.className} ${compact ? "compact" : ""} ${alerta.resuelta ? "resuelta" : ""}`}>
      <div className="alerta-icon">
        <Icon size={compact ? 14 : 18} />
      </div>
      <div className="alerta-content">
        <div className="alerta-header">
          <span className="alerta-nivel">{config.label}</span>
          <span className="alerta-tiempo">{tiempoRelativo(alerta.creado_en)}</span>
        </div>
        <p className="alerta-desc">{alerta.descripcion}</p>
        {!compact && (
          <div className="alerta-meta">
            {alerta.zona && (
              <span>
                <MapPin size={11} />
                {alerta.zona.nombre}
              </span>
            )}
            {alerta.camara && (
              <span>
                <Camera size={11} />
                {alerta.camara.codigo} · {alerta.camara.nombre}
              </span>
            )}
          </div>
        )}
      </div>
      {!alerta.resuelta && onResolver && !compact && (
        <button
          className="button icon-button alerta-resolve"
          onClick={() => onResolver(alerta.id)}
          title="Marcar como resuelta"
        >
          <Check size={15} />
        </button>
      )}
    </div>
  );
}
