"use client";

import { useState } from "react";
import { ArrowRight, QrCode, Trophy, Users, ArrowDownLeft, Sparkles, Star, Gift, Coffee } from "lucide-react";
import { useStore } from "@/providers/store-provider";
import { useSaved } from "@/hooks/use-saved";
import { rewards } from "../utils/mock";
import { PointsCard } from "../components/points-card";

export function LoyaltyView({
  setModal,
  go,
  setActivityTab,
  profile,
}: {
  setModal: (modal: string) => void;
  go: (tab: string) => void;
  setActivityTab: (tab: string) => void;
  profile: any;
}) {
  const { points, orders, addMovement, notify } = useStore();
  const [movements] = useSaved<{ id: string; title: string; points: number; date: string }[]>(
    "paseo-movements-v1",
    []
  );

  const QR = ({ value }: { value: string }) => {
    // A simplified QR placeholder to avoid depending on QRCode inside the view
    return (
      <div className="qr-image" style={{ padding: 20, border: "1px solid #ccc", textAlign: "center" }}>
        <QrCode size={100} />
        <br />
        <small>{value}</small>
      </div>
    );
  };

  const visited = new Set(
    orders.flatMap((o) => o.items.map((i) => i.product.shop))
  ).size;

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">PASEO POINTS · FIDELIZACIÓN</span>
        <h2>Cada momento cuenta. Y suma.</h2>
        <p>Una sola cuenta, todos tus comercios. Convierte tus compras en experiencias.</p>
      </div>

      <div className="points-overview">
        <PointsCard
          points={points}
          large={true}
          onGoToPoints={() => go("Paseo Points")}
          onShowQR={() => setModal("qr")}
        />
        <div className="white-card digital-card">
          <div>
            <span className="eyebrow">TU IDENTIDAD EN EL PASEO</span>
            <h3>Tu tarjeta digital</h3>
            <p>Presenta tu código en el comercio para registrar compras y sumar puntos.</p>
            <button className="button outline" onClick={() => setModal("qr")}>
              <QrCode size={17} /> Mostrar mi código
            </button>
          </div>
          <QR value={`PASEO-DEMO:${profile.email}`} />
        </div>
      </div>

      <div className="section-title">
        <div>
          <h2>Beneficios que dan ganas de volver</h2>
          <p>Canjea tus puntos y presenta el cupón en el establecimiento.</p>
        </div>
        <span className="muted small">Catálogo de demostración</span>
      </div>

      <div className="rewards-grid">
        {rewards.map((r) => (
          <div className="reward-card" key={r.id}>
            <span className="reward-icon">
              <r.icon size={29} />
            </span>
            <span className="eyebrow">{r.shop}</span>
            <h3>{r.title}</h3>
            <p>{r.description}</p>
            <div>
              <strong>
                {r.cost} <small>puntos</small>
              </strong>
              <button
                className="button outline"
                disabled={points < r.cost}
                onClick={() => setModal(`redeem-${r.id}`)}
              >
                Canjear
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="two-columns">
        <div className="white-card">
          <div className="section-title">
            <h3>Tu reto del mes</h3>
            <span className="gold-badge">+150 pts</span>
          </div>
          <p>Compra en 3 comercios diferentes para descubrir nuevos favoritos.</p>
          <div className="mission-progress">
            <div style={{ width: `${Math.min(100, (visited / 3) * 100)}%` }} />
          </div>
          <div className="between">
            <span>{Math.min(visited, 3)} de 3 comercios</span>
            <button
              className="button text-link"
              disabled={visited < 3 || movements.some((m) => m.title === "Reto: descubre 3 comercios")}
              onClick={() => {
                addMovement("Reto: descubre 3 comercios", 150);
                notify("¡Misión completada! Ganaste 150 puntos.");
              }}
            >
              {movements.some((m) => m.title === "Reto: descubre 3 comercios")
                ? "Completado"
                : visited >= 3
                ? "Recibir puntos"
                : "En progreso"}
              <Trophy size={16} />
            </button>
          </div>
          <div className="level-list">
            {["Bronce", "Plata", "Oro", "Platinum"].map((l) => (
              <span key={l} className={l === "Oro" ? "current" : ""}>
                <Trophy size={14} />
                {l}
              </span>
            ))}
          </div>
          <p className="small muted">
            Niveles ilustrativos. Cumpleaños, referidos y bonificaciones configurables en la evolución del producto.
          </p>
          <button className="button outline" onClick={() => setModal("referral")}>
            <Users size={16} />
            Invita a alguien al Paseo
          </button>
        </div>

        <div className="white-card">
          <div className="section-title">
            <h3>Tus últimos movimientos</h3>
            <button
              className="button text-link"
              onClick={() => {
                go("Mi actividad");
                setActivityTab("Puntos");
              }}
            >
              Ver todos
              <ArrowRight size={15} />
            </button>
          </div>
          {movements.slice(0, 4).map((m) => (
            <div className="movement" key={m.id}>
              <span className={`movement-icon ${m.points < 0 ? "negative" : ""}`}>
                <ArrowDownLeft size={18} />
              </span>
              <div>
                <strong>{m.title}</strong>
                <small>{m.date}</small>
              </div>
              <strong className={m.points < 0 ? "muted" : "green"}>
                {m.points > 0 ? "+" : ""}
                {m.points} pts
              </strong>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
