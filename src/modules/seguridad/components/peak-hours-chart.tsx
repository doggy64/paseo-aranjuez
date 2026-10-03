"use client";

import type { HistorialTraficoHora } from "../types";

interface PeakHoursChartProps {
  historial: HistorialTraficoHora[];
  height?: number;
}

export function PeakHoursChart({ historial, height = 120 }: PeakHoursChartProps) {
  const ahora = new Date().getHours();
  const max = Math.max(...historial.map((h) => h.total_entradas), 1);

  return (
    <div className="peak-chart">
      <div className="peak-bars" style={{ height }}>
        {historial.map((h) => {
          const pct = (h.total_entradas / max) * 100;
          const esPico = h.total_entradas === Math.max(...historial.map((x) => x.total_entradas));
          const esAhora = h.hora === ahora;
          return (
            <div
              key={h.hora}
              className={`peak-bar-wrap ${esAhora ? "now" : ""}`}
              title={`${h.hora}:00 — ${h.total_entradas} entradas`}
            >
              <div
                className={`peak-bar ${esPico ? "pico" : ""} ${esAhora ? "now" : ""}`}
                style={{ height: `${Math.max(4, pct)}%` }}
              />
              {(h.hora % 4 === 0 || esAhora) && (
                <span className="peak-label">{h.hora}h</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="peak-legend">
        <span>
          <span className="legend-dot pico" />
          Hora pico
        </span>
        <span>
          <span className="legend-dot now" />
          Ahora
        </span>
      </div>
    </div>
  );
}
