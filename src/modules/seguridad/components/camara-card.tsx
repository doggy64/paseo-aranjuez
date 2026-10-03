"use client";

import { Video, VideoOff, Wrench, Camera } from "lucide-react";
import type { Camara } from "../types";

const TIPO_LABEL: Record<string, string> = {
  entrada: "Entrada",
  salida: "Salida",
  interior: "Interior",
  panoramica: "Panorámica",
};

interface CamaraCardProps {
  camara: Camara;
  onToggle?: (id: string) => void;
  compact?: boolean;
}

export function CamaraCard({ camara, onToggle, compact = false }: CamaraCardProps) {
  const isActiva = camara.estado === "activa";
  const isMantenimiento = camara.estado === "mantenimiento";

  return (
    <div
      className={`camara-card ${camara.estado} ${compact ? "compact" : ""}`}
      data-estado={camara.estado}
    >
      {/* Thumbnail / placeholder */}
      <div className="camara-thumb">
        {camara.url_thumbnail ? (
          <img src={camara.url_thumbnail} alt={camara.nombre} />
        ) : (
          <div className="camara-placeholder">
            {isActiva ? (
              <>
                <div className="scan-line" />
                <Camera size={28} opacity={0.4} />
                <span className="live-badge">
                  <span className="live-dot" />
                  LIVE
                </span>
              </>
            ) : isMantenimiento ? (
              <Wrench size={28} opacity={0.4} />
            ) : (
              <VideoOff size={28} opacity={0.4} />
            )}
          </div>
        )}
        <div className="camara-estado-badge">
          {isActiva ? (
            <Video size={11} />
          ) : isMantenimiento ? (
            <Wrench size={11} />
          ) : (
            <VideoOff size={11} />
          )}
          {camara.estado === "activa"
            ? "Activa"
            : camara.estado === "mantenimiento"
            ? "Mantenimiento"
            : "Inactiva"}
        </div>
      </div>

      {!compact && (
        <div className="camara-info">
          <div className="camara-meta">
            <span className="camara-codigo">{camara.codigo}</span>
            <span className="camara-tipo">{TIPO_LABEL[camara.tipo] ?? camara.tipo}</span>
          </div>
          <h3>{camara.nombre}</h3>
          {camara.zona && (
            <p className="camara-zona">
              <span
                className="zona-dot"
                style={{ background: camara.zona.color ?? "#24614f" }}
              />
              {camara.zona.nombre}
              {camara.zona.piso !== undefined && ` · Piso ${camara.zona.piso}`}
            </p>
          )}
          {camara.descripcion && (
            <p className="camara-desc">{camara.descripcion}</p>
          )}
          {onToggle && camara.estado !== "mantenimiento" && (
            <button
              className={`button small-action ${isActiva ? "danger-soft" : "primary-soft"}`}
              onClick={() => onToggle(camara.id)}
            >
              {isActiva ? (
                <>
                  <VideoOff size={13} />
                  Desactivar
                </>
              ) : (
                <>
                  <Video size={13} />
                  Activar
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
