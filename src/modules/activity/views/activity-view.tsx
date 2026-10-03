"use client";

import { useState } from "react";
import { Package, Clock3, CalendarDays, Gift, Settings, MapPin, Check, ChevronRight, ArrowRight, X, ArrowDownLeft } from "lucide-react";
import { useStore } from "@/providers/store-provider";
import { events } from "@/modules/events/utils/mock";
import { shops } from "@/modules/directory/utils/mock";

const orderStates = [
  "Pedido recibido",
  "Pedido confirmado",
  "Preparando pedido",
  "Listo para recoger",
  "Cliente llegó al Paseo",
  "Pedido entregado",
];

export function ActivityView({
  go,
  setModal,
  initialTab = "Pedidos"
}: {
  go: (tab: string) => void;
  setModal: (modal: string) => void;
  initialTab?: string;
}) {
  const { profile, setProfile, orders, coupons, movements, reservations, setReservations, notify } = useStore();
  const [activityTab, setActivityTab] = useState(initialTab);

  const shopOf = (id: string) => shops.find((s) => s.id === id) || shops[0];
  const money = (n: number) => `Bs ${n.toLocaleString("es-BO")}`;

  return (
    <>
      <div className="profile-header">
        <div className="profile-avatar">{profile.name[0]}</div>
        <div className="profile-info">
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
        </div>
        <button
          className="button icon-button settings-btn"
          aria-label="Ajustes"
          onClick={() => setModal("settings")}
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="category-tabs" style={{ marginBottom: 20 }}>
        {["Pedidos", "Puntos", "Cupones", "Reservas"].map((t) => (
          <button
            key={t}
            className={`button category-tab ${activityTab === t ? "selected" : ""}`}
            onClick={() => setActivityTab(t)}
          >
            {t === "Pedidos" && <Package size={17} />}
            {t === "Puntos" && <Clock3 size={17} />}
            {t === "Cupones" && <Gift size={17} />}
            {t === "Reservas" && <CalendarDays size={17} />}
            {t}
          </button>
        ))}
      </div>

      {activityTab === "Pedidos" && (orders.length ? (
        <div className="orders-list">
          {orders.map((o) => (
            <div className="order-card" key={o.id}>
              <div className="order-header">
                <div>
                  <strong>{o.id}</strong>
                  <span className="muted small">{o.date}</span>
                </div>
                <span className="status-badge">
                  {o.state === 5 ? <Check size={14} /> : <Clock3 size={14} />}
                  {orderStates[o.state]}
                </span>
              </div>
              <div className="order-items">
                {o.items.map((i, idx) => (
                  <div key={idx}>
                    <span>
                      {i.quantity} × {i.product.name}
                    </span>
                    <span className="muted">
                      {shopOf(i.product.shop).name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <div>
                  <strong>Total: {money(o.total)}</strong>
                  <span className="muted small">· {o.payment}</span>
                </div>
                {o.state < 5 && (
                  <button className="button primary" onClick={() => setModal(`order-${o.id}`)}>
                    Ver código de retiro
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Package size={35} />
          <h3>Aún no tienes pedidos</h3>
          <p>Explora PaseoYa y pide de tus tiendas favoritas.</p>
          <button className="button primary" onClick={() => go("PaseoYa")}>
            Descubrir productos
          </button>
        </div>
      ))}

      {activityTab === "Puntos" && (movements.length ? (
        <div className="white-card">
          {movements.map((m) => (
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
      ) : (
        <div className="empty-state">
          <Clock3 size={35} />
          <h3>No hay movimientos</h3>
          <p>Registra compras o canjea beneficios para verlos aquí.</p>
        </div>
      ))}

      {activityTab === "Cupones" && (coupons.length ? (
        <div className="coupons-list">
          {coupons.map((c) => (
            <div className={`coupon-card ${c.used ? "used" : ""}`} key={c.id}>
              <div className="coupon-left">
                <strong>{c.title}</strong>
                <code>{c.code}</code>
              </div>
              {c.used ? (
                <div className="coupon-status used">
                  <Check size={16} /> Utilizado
                </div>
              ) : (
                <div className="coupon-status active">Disponible</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Gift size={35} />
          <h3>Hay recompensas esperándote</h3>
          <p>Canjea tus puntos para obtener tu primer cupón.</p>
          <button className="button primary" onClick={() => go("Paseo Points")}>
            Ver beneficios
          </button>
        </div>
      ))}

      {activityTab === "Reservas" && (reservations.length ? (
        <div className="white-card">
          {reservations.map((r) => (
            <div className="movement" key={r}>
              <CalendarDays size={23} />
              <div>
                <strong>{events.find((e) => e.id === r)?.title || r}</strong>
                <small>Solicitud guardada localmente · Sin confirmación real</small>
              </div>
              <button
                className="button outline"
                onClick={() => {
                  setReservations((prev) => prev.filter((x) => x !== r));
                  notify("Reserva cancelada.");
                }}
              >
                Cancelar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CalendarDays size={35} />
          <h3>Haz espacio para un nuevo plan</h3>
          <p>Encuentra eventos o solicita tu espacio de cowork.</p>
          <button className="button primary" onClick={() => go("Eventos y experiencias")}>
            Ver experiencias
          </button>
        </div>
      ))}
    </>
  );
}
