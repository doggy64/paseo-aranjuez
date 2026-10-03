"use client";

import { useState } from "react";
import { Search, Video, VideoOff, Wrench, SlidersHorizontal } from "lucide-react";
import { useCamaras } from "../hooks/use-seguridad";
import { CamaraCard } from "../components/camara-card";
import type { CamaraEstado, CamaraTipo } from "../types";
import { ZONAS_MOCK } from "../utils/mock";

const ESTADOS: { value: CamaraEstado | "todos"; label: string }[] = [
  { value: "todos", label: "Todas" },
  { value: "activa", label: "Activas" },
  { value: "inactiva", label: "Offline" },
  { value: "mantenimiento", label: "Mantenimiento" },
];

const TIPOS: { value: CamaraTipo | "todos"; label: string }[] = [
  { value: "todos", label: "Todos los tipos" },
  { value: "entrada", label: "Entrada" },
  { value: "salida", label: "Salida" },
  { value: "interior", label: "Interior" },
  { value: "panoramica", label: "Panorámica" },
];

export function CameraListView() {
  const { camaras, toggleEstado } = useCamaras();
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState<CamaraEstado | "todos">("todos");
  const [tipo, setTipo] = useState<CamaraTipo | "todos">("todos");
  const [zona, setZona] = useState("todas");

  const filtradas = camaras.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.nombre.toLowerCase().includes(q) ||
      (c.codigo ?? "").toLowerCase().includes(q) ||
      (c.descripcion ?? "").toLowerCase().includes(q);
    const matchEstado = estado === "todos" || c.estado === estado;
    const matchTipo = tipo === "todos" || c.tipo === tipo;
    const matchZona = zona === "todas" || c.id_zona === zona;
    return matchSearch && matchEstado && matchTipo && matchZona;
  });

  const activas = camaras.filter((c) => c.estado === "activa").length;
  const inactivas = camaras.filter((c) => c.estado === "inactiva").length;
  const mantenimiento = camaras.filter((c) => c.estado === "mantenimiento").length;

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">SEGURIDAD · CÁMARAS</span>
        <h1>Gestión de Cámaras</h1>
        <p>
          Administra el estado y configuración de las {camaras.length} cámaras del Paseo Aranjuez.
        </p>
      </div>

      {/* Resumen rápido */}
      <div className="cam-summary-row">
        <button
          className={`cam-summary-pill ${estado === "activa" ? "active" : ""}`}
          onClick={() => setEstado(estado === "activa" ? "todos" : "activa")}
        >
          <Video size={14} />
          {activas} activas
        </button>
        <button
          className={`cam-summary-pill danger ${estado === "inactiva" ? "active" : ""}`}
          onClick={() => setEstado(estado === "inactiva" ? "todos" : "inactiva")}
        >
          <VideoOff size={14} />
          {inactivas} offline
        </button>
        <button
          className={`cam-summary-pill warning ${estado === "mantenimiento" ? "active" : ""}`}
          onClick={() => setEstado(estado === "mantenimiento" ? "todos" : "mantenimiento")}
        >
          <Wrench size={14} />
          {mantenimiento} mantenimiento
        </button>
      </div>

      {/* Filtros */}
      <div className="toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            placeholder="Buscar por nombre o código…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar cámaras"
          />
        </div>
        <div className="filter-row">
          <SlidersHorizontal size={15} />
          <select
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            aria-label="Filtrar por zona"
          >
            <option value="todas">Todas las zonas</option>
            {ZONAS_MOCK.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nombre}
              </option>
            ))}
          </select>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as CamaraTipo | "todos")}
            aria-label="Filtrar por tipo"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs de estado */}
      <div className="category-tabs">
        {ESTADOS.map((e) => (
          <button
            key={e.value}
            className={`button category-tab ${estado === e.value ? "selected" : ""}`}
            onClick={() => setEstado(e.value)}
          >
            {e.label}
          </button>
        ))}
      </div>

      {filtradas.length > 0 ? (
        <div className="camaras-grid">
          {filtradas.map((c) => (
            <CamaraCard
              key={c.id}
              camara={c}
              onToggle={toggleEstado}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <VideoOff size={35} opacity={0.25} />
          <h3>Sin resultados</h3>
          <p>No hay cámaras que coincidan con los filtros aplicados.</p>
        </div>
      )}
    </>
  );
}
