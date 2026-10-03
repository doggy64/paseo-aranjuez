"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Bell,
  Check,
} from "lucide-react";
import { useReglas, useAlertas } from "../hooks/use-seguridad";
import { AlertaBanner } from "../components/alerta-banner";
import type { ReglaTipo } from "../types";
import { ZONAS_MOCK } from "../utils/mock";

const TIPO_LABEL: Record<ReglaTipo, string> = {
  aforo_maximo: "Aforo máximo",
  camara_offline: "Cámara offline",
  anomalia: "Anomalía",
};

export function RulesView() {
  const { reglas, setReglas, toggleRegla } = useReglas();
  const { alertas, activas, resolver } = useAlertas();
  const [tab, setTab] = useState<"reglas" | "historial">("reglas");
  const [showForm, setShowForm] = useState(false);

  // Formulario nueva regla (demo)
  const [form, setForm] = useState({
    nombre: "",
    tipo: "aforo_maximo" as ReglaTipo,
    id_zona: ZONAS_MOCK[0].id,
    valor_umbral: "",
    descripcion: "",
  });

  const handleAgregar = () => {
    if (!form.nombre.trim()) return;
    setReglas((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}`,
        nombre: form.nombre,
        tipo: form.tipo,
        id_zona: form.id_zona,
        valor_umbral: form.valor_umbral ? parseInt(form.valor_umbral) : undefined,
        descripcion: form.descripcion,
        activa: true,
        zona: ZONAS_MOCK.find((z) => z.id === form.id_zona),
      },
    ]);
    setForm({ nombre: "", tipo: "aforo_maximo", id_zona: ZONAS_MOCK[0].id, valor_umbral: "", descripcion: "" });
    setShowForm(false);
  };

  const handleEliminar = (id: string) => {
    setReglas((prev) => prev.filter((r) => r.id !== id));
  };

  const resueltas = alertas.filter((a) => a.resuelta);

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">SEGURIDAD · REGLAS</span>
        <h1>Reglas y Alertas</h1>
        <p>
          Configura umbrales de aforo, condiciones de alerta y revisa el historial de incidencias.
        </p>
      </div>

      {/* Tabs */}
      <div className="category-tabs">
        <button
          className={`button category-tab ${tab === "reglas" ? "selected" : ""}`}
          onClick={() => setTab("reglas")}
        >
          <ShieldCheck size={15} />
          Reglas ({reglas.length})
        </button>
        <button
          className={`button category-tab ${tab === "historial" ? "selected" : ""}`}
          onClick={() => setTab("historial")}
        >
          <Bell size={15} />
          Alertas activas ({activas.length})
          {activas.length > 0 && <span className="new-dot" />}
        </button>
      </div>

      {/* Tab: Reglas */}
      {tab === "reglas" && (
        <>
          <div className="seg-card-head" style={{ marginBottom: 16 }}>
            <div />
            <button
              className="button primary"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={15} />
              Nueva regla
            </button>
          </div>

          {/* Formulario nueva regla */}
          {showForm && (
            <div className="seg-card rule-form">
              <h3>Nueva regla de seguridad</h3>
              <div className="form-grid">
                <label>
                  Nombre de la regla
                  <input
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej: Aforo máximo acceso norte"
                  />
                </label>
                <label>
                  Tipo
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value as ReglaTipo })}
                  >
                    {Object.entries(TIPO_LABEL).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Zona
                  <select
                    value={form.id_zona}
                    onChange={(e) => setForm({ ...form, id_zona: e.target.value })}
                  >
                    {ZONAS_MOCK.map((z) => (
                      <option key={z.id} value={z.id}>{z.nombre}</option>
                    ))}
                  </select>
                </label>
                {form.tipo === "aforo_maximo" && (
                  <label>
                    Umbral (personas)
                    <input
                      type="number"
                      value={form.valor_umbral}
                      onChange={(e) => setForm({ ...form, valor_umbral: e.target.value })}
                      placeholder="Ej: 150"
                    />
                  </label>
                )}
                <label className="full-col">
                  Descripción
                  <input
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    placeholder="Describe cuándo se activa esta regla…"
                  />
                </label>
              </div>
              <div className="form-actions">
                <button className="button outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button className="button primary" onClick={handleAgregar}>
                  <Check size={15} />
                  Guardar regla
                </button>
              </div>
            </div>
          )}

          {/* Lista de reglas */}
          <div className="rules-list">
            {reglas.map((r) => (
              <div key={r.id} className={`rule-row ${r.activa ? "activa" : "inactiva"}`}>
                <div className="rule-icon">
                  <ShieldCheck size={18} />
                </div>
                <div className="rule-body">
                  <div className="rule-head">
                    <strong>{r.nombre}</strong>
                    <span className="rule-tipo">{TIPO_LABEL[r.tipo]}</span>
                  </div>
                  {r.descripcion && <p>{r.descripcion}</p>}
                  <div className="rule-meta">
                    {r.zona && (
                      <span className="rule-zona">{r.zona.nombre}</span>
                    )}
                    {r.valor_umbral && (
                      <span className="rule-umbral">
                        Umbral: {r.valor_umbral} personas
                      </span>
                    )}
                  </div>
                </div>
                <div className="rule-actions">
                  <button
                    className="button icon-button"
                    onClick={() => toggleRegla(r.id)}
                    title={r.activa ? "Desactivar regla" : "Activar regla"}
                  >
                    {r.activa ? (
                      <ToggleRight size={20} color="var(--green)" />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                  </button>
                  <button
                    className="button icon-button danger-soft"
                    onClick={() => handleEliminar(r.id)}
                    title="Eliminar regla"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tab: Alertas */}
      {tab === "historial" && (
        <div className="alertas-panel">
          {activas.length > 0 && (
            <section>
              <h3 className="alertas-section-title">Alertas activas</h3>
              {activas.map((a) => (
                <AlertaBanner key={a.id} alerta={a} onResolver={resolver} />
              ))}
            </section>
          )}
          {resueltas.length > 0 && (
            <section>
              <h3 className="alertas-section-title muted">Resueltas</h3>
              {resueltas.map((a) => (
                <AlertaBanner key={a.id} alerta={a} />
              ))}
            </section>
          )}
          {alertas.length === 0 && (
            <div className="seg-empty">
              <Bell size={32} opacity={0.18} />
              <p>Sin alertas registradas</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
