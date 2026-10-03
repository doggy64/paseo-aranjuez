"use client";

import {
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  Video,
  VideoOff,
  Wrench,
  Bell,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useTraficoRealtime, useAlertas, useHistorialHora } from "../hooks/use-seguridad";
import { PeakHoursChart } from "../components/peak-hours-chart";
import { AlertaBanner } from "../components/alerta-banner";
import { ZonaCard } from "../components/zona-card";
import { CAMARAS_MOCK } from "../utils/mock";
import { useRouter } from "next/navigation";

export function SecurityDashboardView() {
  const { zonas, kpis, tick } = useTraficoRealtime();
  const { activas: alertasActivas, resolver } = useAlertas();
  const { historial } = useHistorialHora();
  const router = useRouter();

  const zonasOrdenadas = [...zonas]
    .filter((z) => z.activa)
    .sort((a, b) => (b.ocupacion_actual ?? 0) - (a.ocupacion_actual ?? 0));

  const camarasActivas = CAMARAS_MOCK.filter((c) => c.estado === "activa").length;
  const camarasInactivas = CAMARAS_MOCK.filter((c) => c.estado === "inactiva").length;
  const camarasMantenimiento = CAMARAS_MOCK.filter((c) => c.estado === "mantenimiento").length;

  return (
    <>
      {/* Header */}
      <div className="page-heading">
        <span className="eyebrow">MÓDULO DE SEGURIDAD</span>
        <h1>Centro de Vigilancia</h1>
        <p>
          Monitoreo en tiempo real de aforo, cámaras y alertas de seguridad del Paseo Aranjuez.
        </p>
      </div>

      {/* Alertas activas (si las hay) */}
      {alertasActivas.length > 0 && (
        <div className="seg-alerts-bar">
          {alertasActivas.map((a) => (
            <AlertaBanner
              key={a.id}
              alerta={a}
              onResolver={resolver}
              compact
            />
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="seg-kpis">
        <div className="seg-kpi primary">
          <div className="seg-kpi-icon">
            <Users size={22} />
          </div>
          <div>
            <span className="seg-kpi-label">Personas en el mall</span>
            <strong className="seg-kpi-value">
              {kpis.total_personas_ahora.toLocaleString("es-BO")}
            </strong>
            <span className="seg-kpi-sub realtime">
              <RefreshCw size={10} />
              Tiempo real
            </span>
          </div>
        </div>

        <div className="seg-kpi">
          <div className="seg-kpi-icon green">
            <ArrowUpRight size={22} />
          </div>
          <div>
            <span className="seg-kpi-label">Entradas hoy</span>
            <strong className="seg-kpi-value">
              {kpis.entradas_hoy.toLocaleString("es-BO")}
            </strong>
            <span className="seg-kpi-sub">Total acumulado</span>
          </div>
        </div>

        <div className="seg-kpi">
          <div className="seg-kpi-icon gold">
            <ArrowDownLeft size={22} />
          </div>
          <div>
            <span className="seg-kpi-label">Salidas hoy</span>
            <strong className="seg-kpi-value">
              {kpis.salidas_hoy.toLocaleString("es-BO")}
            </strong>
            <span className="seg-kpi-sub">Total acumulado</span>
          </div>
        </div>

        <div className="seg-kpi">
          <div className="seg-kpi-icon">
            <Video size={22} />
          </div>
          <div>
            <span className="seg-kpi-label">Cámaras</span>
            <strong className="seg-kpi-value">{camarasActivas} activas</strong>
            <span className="seg-kpi-sub">
              {camarasInactivas} offline · {camarasMantenimiento} mantenimiento
            </span>
          </div>
        </div>

        <div className={`seg-kpi ${alertasActivas.length > 0 ? "danger" : ""}`}>
          <div className={`seg-kpi-icon ${alertasActivas.length > 0 ? "danger" : "muted"}`}>
            <Bell size={22} />
          </div>
          <div>
            <span className="seg-kpi-label">Alertas activas</span>
            <strong className="seg-kpi-value">{alertasActivas.length}</strong>
            <span className="seg-kpi-sub">
              {alertasActivas.length === 0 ? "Todo en orden" : "Requiere atención"}
            </span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="seg-main-grid">
        {/* Hora pico */}
        <section className="seg-card wide">
          <div className="seg-card-head">
            <div>
              <TrendingUp size={17} />
              <h2>Flujo de visitas — Hoy</h2>
            </div>
            <span className="eyebrow">ENTRADAS POR HORA</span>
          </div>
          <PeakHoursChart historial={historial} height={140} />
        </section>

        {/* Alertas panel */}
        <section className="seg-card">
          <div className="seg-card-head">
            <div>
              <Bell size={17} />
              <h2>Alertas</h2>
            </div>
            <button
              className="button small-link"
              onClick={() => router.push("/seguridad/reglas")}
            >
              Ver reglas
            </button>
          </div>
          {alertasActivas.length > 0 ? (
            <div className="seg-alertas-list">
              {alertasActivas.map((a) => (
                <AlertaBanner key={a.id} alerta={a} onResolver={resolver} />
              ))}
            </div>
          ) : (
            <div className="seg-empty">
              <Bell size={30} opacity={0.18} />
              <p>Sin alertas activas</p>
            </div>
          )}
        </section>

        {/* Zonas por ocupación */}
        <section className="seg-card wide">
          <div className="seg-card-head">
            <div>
              <Users size={17} />
              <h2>Zonas — Ocupación actual</h2>
            </div>
            <button
              className="button small-link"
              onClick={() => router.push("/seguridad/zonas")}
            >
              Gestionar zonas
            </button>
          </div>
          <div className="zonas-ranking">
            {zonasOrdenadas.map((z, i) => (
              <div key={z.id} className="zona-rank-row">
                <span className="zona-rank-num">{i + 1}</span>
                <div className="zona-rank-dot" style={{ background: z.color ?? "#24614f" }} />
                <span className="zona-rank-nombre">{z.nombre}</span>
                <div className="zona-rank-bar-track">
                  <div
                    className="zona-rank-bar"
                    style={{
                      width: `${Math.min(100, ((z.ocupacion_actual ?? 0) / 400) * 100)}%`,
                      background: z.color ?? "#24614f",
                    }}
                  />
                </div>
                <strong className="zona-rank-val">
                  {z.ocupacion_actual ?? 0}
                </strong>
              </div>
            ))}
          </div>
        </section>

        {/* Estado cámaras resumen */}
        <section className="seg-card">
          <div className="seg-card-head">
            <div>
              <Video size={17} />
              <h2>Estado de cámaras</h2>
            </div>
            <button
              className="button small-link"
              onClick={() => router.push("/seguridad/camaras")}
            >
              Ver todas
            </button>
          </div>
          <div className="cam-estado-list">
            <div className="cam-estado-row activa">
              <Video size={15} />
              <span>Activas</span>
              <strong>{camarasActivas}</strong>
            </div>
            <div className="cam-estado-row inactiva">
              <VideoOff size={15} />
              <span>Offline</span>
              <strong>{camarasInactivas}</strong>
            </div>
            <div className="cam-estado-row mantenimiento">
              <Wrench size={15} />
              <span>Mantenimiento</span>
              <strong>{camarasMantenimiento}</strong>
            </div>
          </div>
          <div className="cam-estado-bar">
            <div
              className="cam-seg activa"
              style={{ flex: camarasActivas }}
              title={`${camarasActivas} activas`}
            />
            <div
              className="cam-seg mantenimiento"
              style={{ flex: camarasMantenimiento }}
              title={`${camarasMantenimiento} mantenimiento`}
            />
            <div
              className="cam-seg inactiva"
              style={{ flex: camarasInactivas || 0.01 }}
              title={`${camarasInactivas} offline`}
            />
          </div>
        </section>
      </div>
    </>
  );
}
