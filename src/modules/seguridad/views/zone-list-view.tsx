"use client";

import { useState } from "react";
import { Users, Video, VideoOff, ChevronRight } from "lucide-react";
import { useZonas, useCamaras } from "../hooks/use-seguridad";
import { ZonaCard } from "../components/zona-card";
import { CamaraCard } from "../components/camara-card";
import type { ZonaSeguridad } from "../types";

export function ZoneListView() {
  const { zonas, toggleZona } = useZonas();
  const { camaras, toggleEstado } = useCamaras();
  const [zonaSeleccionada, setZonaSeleccionada] = useState<ZonaSeguridad | null>(null);

  const camarasDeZona = zonaSeleccionada
    ? camaras.filter((c) => c.id_zona === zonaSeleccionada.id)
    : [];

  const totalPersonas = zonas.reduce((acc, z) => acc + (z.ocupacion_actual ?? 0), 0);

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">SEGURIDAD · ZONAS</span>
        <h1>Zonas de Seguridad</h1>
        <p>
          {zonas.length} zonas monitoreadas ·{" "}
          <strong>{totalPersonas.toLocaleString("es-BO")}</strong> personas en el mall ahora.
        </p>
      </div>

      <div className="zonas-layout">
        {/* Lista de zonas */}
        <div className="zonas-list">
          {zonas.map((z) => (
            <ZonaCard
              key={z.id}
              zona={z}
              selected={zonaSeleccionada?.id === z.id}
              onClick={() =>
                setZonaSeleccionada(
                  zonaSeleccionada?.id === z.id ? null : z
                )
              }
            />
          ))}
        </div>

        {/* Panel de detalle de zona */}
        {zonaSeleccionada ? (
          <aside className="zona-detail-panel">
            <div className="zona-detail-head">
              <div
                className="zona-detail-color"
                style={{ background: zonaSeleccionada.color ?? "#24614f" }}
              />
              <div>
                <h2>{zonaSeleccionada.nombre}</h2>
                {zonaSeleccionada.descripcion && (
                  <p>{zonaSeleccionada.descripcion}</p>
                )}
              </div>
            </div>

            {/* Métricas de zona */}
            <div className="zona-detail-kpis">
              <div className="zona-dk">
                <Users size={16} />
                <strong>{zonaSeleccionada.ocupacion_actual ?? 0}</strong>
                <span>personas ahora</span>
              </div>
              <div className="zona-dk">
                <Video size={16} />
                <strong>{camarasDeZona.filter((c) => c.estado === "activa").length}</strong>
                <span>cámaras activas</span>
              </div>
              <div className="zona-dk">
                <VideoOff size={16} />
                <strong>
                  {camarasDeZona.filter((c) => c.estado !== "activa").length}
                </strong>
                <span>offline</span>
              </div>
            </div>

            {/* Cámaras de la zona */}
            <h3 className="zona-detail-subtitle">
              Cámaras en esta zona ({camarasDeZona.length})
            </h3>
            {camarasDeZona.length > 0 ? (
              <div className="zona-camaras-grid">
                {camarasDeZona.map((c) => (
                  <CamaraCard
                    key={c.id}
                    camara={c}
                    onToggle={toggleEstado}
                  />
                ))}
              </div>
            ) : (
              <div className="seg-empty small">
                <Video size={24} opacity={0.2} />
                <p>Sin cámaras asignadas a esta zona</p>
              </div>
            )}

            {/* Controles de zona */}
            <div className="zona-actions">
              <button
                className={`button ${zonaSeleccionada.activa ? "outline danger-soft" : "primary"}`}
                onClick={() => toggleZona(zonaSeleccionada.id)}
              >
                {zonaSeleccionada.activa ? "Desactivar zona" : "Activar zona"}
              </button>
            </div>
          </aside>
        ) : (
          <aside className="zona-detail-panel empty">
            <ChevronRight size={30} opacity={0.15} />
            <p>Selecciona una zona para ver el detalle</p>
          </aside>
        )}
      </div>
    </>
  );
}
