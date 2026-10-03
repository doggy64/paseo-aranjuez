"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  ZonaSeguridad,
  Camara,
  AlertaSeguridad,
  ReglaSeguridad,
  HistorialTraficoHora,
  SecurityKPIs,
} from "../types";
import {
  ZONAS_MOCK,
  CAMARAS_MOCK,
  ALERTAS_MOCK,
  REGLAS_MOCK,
  HISTORIAL_HOY_MOCK,
  KPIS_MOCK,
} from "../utils/mock";

// ─────────────────────────────────────────────────────────
// Hook: Zonas de Seguridad
// ─────────────────────────────────────────────────────────
export function useZonas() {
  const [zonas, setZonas] = useState<ZonaSeguridad[]>(ZONAS_MOCK);
  const [loading, setLoading] = useState(false);

  // Cuando Supabase esté disponible, aquí iría el fetch real
  // const supabase = useTenant();
  // useEffect(() => { supabase.from('zonas_seguridad').select('*').then(...) }, []);

  const toggleZona = useCallback((id: string) => {
    setZonas((prev) =>
      prev.map((z) => (z.id === id ? { ...z, activa: !z.activa } : z))
    );
  }, []);

  return { zonas, setZonas, loading, toggleZona };
}

// ─────────────────────────────────────────────────────────
// Hook: Cámaras
// ─────────────────────────────────────────────────────────
export function useCamaras(zonaId?: string) {
  const [camaras, setCamaras] = useState<Camara[]>(CAMARAS_MOCK);
  const [loading, setLoading] = useState(false);

  const filtradas = zonaId
    ? camaras.filter((c) => c.id_zona === zonaId)
    : camaras;

  const toggleEstado = useCallback((id: string) => {
    setCamaras((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const next =
          c.estado === "activa"
            ? "inactiva"
            : c.estado === "inactiva"
            ? "activa"
            : c.estado;
        return { ...c, estado: next };
      })
    );
  }, []);

  return { camaras: filtradas, setCamaras, loading, toggleEstado };
}

// ─────────────────────────────────────────────────────────
// Hook: Conteo en tiempo real (simula Supabase Realtime)
// ─────────────────────────────────────────────────────────
export function useTraficoRealtime() {
  const [zonas, setZonas] = useState<ZonaSeguridad[]>(ZONAS_MOCK);
  const [kpis, setKpis] = useState<SecurityKPIs>(KPIS_MOCK);
  const [tick, setTick] = useState(0);

  // Simula actualización en tiempo real cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setZonas((prev) =>
        prev.map((z) => {
          if (!z.activa) return z;
          const delta = Math.floor(Math.random() * 7) - 3;
          return {
            ...z,
            ocupacion_actual: Math.max(0, (z.ocupacion_actual ?? 0) + delta),
          };
        })
      );
      setTick((t) => t + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Actualiza KPIs cuando cambian zonas
  useEffect(() => {
    setKpis((prev) => ({
      ...prev,
      total_personas_ahora: zonas.reduce(
        (acc, z) => acc + (z.ocupacion_actual ?? 0),
        0
      ),
    }));
  }, [zonas]);

  return { zonas, kpis, tick };
}

// ─────────────────────────────────────────────────────────
// Hook: Historial de tráfico por hora
// ─────────────────────────────────────────────────────────
export function useHistorialHora(zonaId?: string) {
  const [historial] = useState<HistorialTraficoHora[]>(HISTORIAL_HOY_MOCK);
  return { historial };
}

// ─────────────────────────────────────────────────────────
// Hook: Alertas
// ─────────────────────────────────────────────────────────
export function useAlertas() {
  const [alertas, setAlertas] = useState<AlertaSeguridad[]>(ALERTAS_MOCK);

  const resolver = useCallback((id: string) => {
    setAlertas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resuelta: true } : a))
    );
  }, []);

  const activas = alertas.filter((a) => !a.resuelta);
  const criticas = activas.filter((a) => a.nivel === "critico");

  return { alertas, activas, criticas, resolver };
}

// ─────────────────────────────────────────────────────────
// Hook: Reglas
// ─────────────────────────────────────────────────────────
export function useReglas() {
  const [reglas, setReglas] = useState<ReglaSeguridad[]>(REGLAS_MOCK);

  const toggleRegla = useCallback((id: string) => {
    setReglas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, activa: !r.activa } : r))
    );
  }, []);

  return { reglas, setReglas, toggleRegla };
}
