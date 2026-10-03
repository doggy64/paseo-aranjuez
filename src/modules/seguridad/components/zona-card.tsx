"use client";

import { Users, Camera, Video, VideoOff } from "lucide-react";
import type { ZonaSeguridad } from "../types";

interface ZonaCardProps {
  zona: ZonaSeguridad;
  onClick?: () => void;
  selected?: boolean;
}

export function ZonaCard({ zona, onClick, selected }: ZonaCardProps) {
  const total = (zona.camaras_activas ?? 0) + (zona.camaras_inactivas ?? 0);
  const ocupacion = zona.ocupacion_actual ?? 0;

  return (
    <button
      className={`zona-card button ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="zona-color-bar" style={{ background: zona.color ?? "#24614f" }} />
      <div className="zona-card-body">
        <div className="zona-header">
          <span className="zona-nombre">{zona.nombre}</span>
          {zona.piso !== undefined && (
            <span className="zona-piso">
              {zona.piso === -1 ? "Sótano" : zona.piso === 0 ? "PB" : `P${zona.piso}`}
            </span>
          )}
        </div>
        {zona.descripcion && (
          <p className="zona-desc">{zona.descripcion}</p>
        )}
        <div className="zona-metrics">
          <span className="zona-metric">
            <Users size={13} />
            <strong>{ocupacion}</strong>
            <small>personas</small>
          </span>
          <span className="zona-metric">
            <Video size={13} />
            <strong>{zona.camaras_activas ?? 0}</strong>
            <small>activas</small>
          </span>
          {(zona.camaras_inactivas ?? 0) > 0 && (
            <span className="zona-metric danger">
              <VideoOff size={13} />
              <strong>{zona.camaras_inactivas}</strong>
              <small>offline</small>
            </span>
          )}
        </div>
        {/* Barra de ocupación */}
        <div className="zona-bar-track">
          <div
            className="zona-bar-fill"
            style={{
              width: `${Math.min(100, (ocupacion / 400) * 100)}%`,
              background: zona.color ?? "#24614f",
              opacity: zona.activa ? 1 : 0.35,
            }}
          />
        </div>
      </div>
    </button>
  );
}
