"use client";

import { useState } from "react";
import { ShieldCheck, CreditCard, ShoppingBag, Store, Gift, Plus, ArrowRight, Check, CheckCheck } from "lucide-react";
import { useStore } from "@/providers/store-provider";
import { shops } from "@/modules/directory/utils/mock";

const orderStates = [
  "Pedido recibido",
  "Pedido confirmado",
  "Preparando pedido",
  "Listo para recoger",
  "Cliente llegó al Paseo",
  "Pedido entregado",
];

export function AdminView({
  isAdmin,
  setModal,
}: {
  isAdmin: boolean; // false for Merchant view
  setModal: (modal: string) => void;
}) {
  const { profile, orders, setOrders, points, coupons, setCoupons, products, setProducts, addMovement, equivalence, notify } = useStore();
  const [merchantShop, setMerchantShop] = useState(shops[0].id);
  const [validation, setValidation] = useState("");

  const allShops = shops; // Add extraShops from store if needed later
  const shopOf = (id: string) => allShops.find((s) => s.id === id) || shops[0];
  const money = (n: number) => `Bs ${n.toLocaleString("es-BO")}`;

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">
          {!isAdmin ? "PORTAL DE COMERCIOS" : "ADMINISTRACIÓN · PASEO ARANJUEZ"}
        </span>
        <h2>
          {!isAdmin ? "Tu comercio, más conectado." : "Un ecosistema. Una visión completa."}
        </h2>
        <p>
          {!isAdmin
            ? "Gestiona pedidos, inventario, compras y canjes desde un mismo lugar."
            : "Supervisa comercios, fidelización y ventas de todo el Paseo."}
        </p>
      </div>
      <div className="info-strip">
        <ShieldCheck size={18} />
        Vista de demostración. El cambio de rol no constituye autenticación ni concede acceso real.
      </div>
      <div className="admin-metrics">
        {[
          { title: "Ventas de la demo", value: money(orders.reduce((a, o) => a + o.total, 0)), icon: CreditCard },
          { title: "Pedidos registrados", value: orders.length, icon: ShoppingBag },
          { title: "Comercios del catálogo", value: allShops.length, icon: Store },
          { title: "Puntos disponibles", value: points.toLocaleString("es-BO"), icon: Gift },
        ].map((m) => (
          <div className="white-card metric" key={m.title}>
            <span className="quick-icon">
              <m.icon size={22} />
            </span>
            <div>
              <span>{m.title}</span>
              <strong>{m.value}</strong>
            </div>
          </div>
        ))}
      </div>

      {!isAdmin ? (
        <>
          <div className="toolbar">
            <h3>Mi establecimiento</h3>
            <select
              aria-label="Seleccionar comercio"
              value={merchantShop}
              onChange={(e) => setMerchantShop(e.target.value)}
            >
              {allShops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button className="button primary" onClick={() => setModal("product")}>
              <Plus size={16} />
              Nuevo producto
            </button>
          </div>
          <div className="two-columns">
            <div className="white-card">
              <h3>Registrar una compra presencial</h3>
              <p>Identifica al cliente y acredita puntos por una compra.</p>
              <form
                className="stack-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  const customer = String(form.get("customer")).trim();
                  if (
                    customer !== profile.email &&
                    customer !== profile.phone &&
                    customer !== `PASEO-DEMO:${profile.email}`
                  )
                    return notify("Cliente no encontrado. Usa el correo de la cuenta de demostración.");
                  const amount = Number(form.get("amount"));
                  if (!(amount > 0)) return;
                  addMovement(`Compra presencial · ${shopOf(merchantShop).name}`, Math.floor(amount * equivalence));
                  notify("Compra registrada y puntos acreditados a tu cuenta demo.");
                  e.currentTarget.reset();
                }}
              >
                <label>
                  Correo, celular o contenido del QR
                  <input name="customer" required placeholder={profile.email} />
                </label>
                <label>
                  Monto de compra (Bs)
                  <input name="amount" type="number" min="1" max="100000" required />
                </label>
                <button className="button primary" type="submit">
                  <Plus size={16} />
                  Registrar y asignar puntos
                </button>
              </form>
            </div>
            <div className="white-card">
              <h3>Validar un canje</h3>
              <p>Introduce el código del cupón que presenta el cliente.</p>
              <form
                className="stack-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const c = coupons.find((x) => x.code === validation.trim().toUpperCase());
                  if (!c) return notify("Cupón no encontrado.");
                  if (c.used) return notify("Este cupón ya fue utilizado.");
                  setCoupons((prev) =>
                    prev.map((x) => (x.id === c.id ? { ...x, used: true } : x))
                  );
                  notify("Canje validado y registrado.");
                  setValidation("");
                }}
              >
                <label>
                  Código de cupón
                  <input
                    required
                    value={validation}
                    onChange={(e) => setValidation(e.target.value)}
                    placeholder="PASEO-123456"
                  />
                </label>
                <button className="button outline" type="submit">
                  <CheckCheck size={16} /> Validar cupón
                </button>
              </form>
            </div>
          </div>
          
          <div className="section-title">
            <h3>Pedidos de {shopOf(merchantShop).name}</h3>
            <span className="muted small">Validación de retiro por PIN</span>
          </div>
          {orders
            .filter((o) => o.items.some((i) => i.product.shop === merchantShop))
            .map((o) => (
              <div className="white-card merchant-order" key={o.id}>
                <div>
                  <strong>{o.id} · {orderStates[o.state]}</strong>
                  <p>
                    {o.items
                      .filter((i) => i.product.shop === merchantShop)
                      .map((i) => `${i.quantity} × ${i.product.name}`)
                      .join(", ")}
                  </p>
                </div>
                {o.state < 4 ? (
                  <button
                    className="button primary"
                    onClick={() =>
                      setOrders((prev) =>
                        prev.map((x) => (x.id === o.id ? { ...x, state: x.state + 1 } : x))
                      )
                    }
                  >
                    {orderStates[o.state + 1]}
                    <ArrowRight size={15} />
                  </button>
                ) : o.state === 4 ? (
                  <form
                    className="inline-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const pin = new FormData(e.currentTarget).get("pin");
                      if (pin !== o.pin) return notify("PIN incorrecto. No se puede entregar el pedido.");
                      setOrders((prev) =>
                        prev.map((x) => (x.id === o.id ? { ...x, state: 5 } : x))
                      );
                      notify("Pedido entregado. Retiro presencial validado.");
                    }}
                  >
                    <input name="pin" required placeholder="PIN de retiro" aria-label="PIN de retiro" />
                    <button className="button primary" type="submit">Validar entrega</button>
                  </form>
                ) : (
                  <span className="status-badge">
                    <Check size={14} /> Entregado
                  </span>
                )}
              </div>
            ))}

          <div className="section-title">
            <h3>Inventario y precios</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio (Bs)</th>
                  <th>Stock</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((p) => p.shop === merchantShop)
                  .map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>
                        <input
                          type="number"
                          value={p.price}
                          min="0"
                          style={{ width: 80, padding: 5 }}
                          onChange={(e) =>
                            setProducts((prev) =>
                              prev.map((x) => (x.id === p.id ? { ...x, price: Number(e.target.value) } : x))
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={p.stock}
                          min="0"
                          style={{ width: 70, padding: 5 }}
                          onChange={(e) =>
                            setProducts((prev) =>
                              prev.map((x) => (x.id === p.id ? { ...x, stock: Number(e.target.value) } : x))
                            )
                          }
                        />
                      </td>
                      <td>
                        {p.stock > 0 ? (
                          <span className="green">Activo</span>
                        ) : (
                          <span className="muted">Agotado</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="table-wrap" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>Comercio</th>
                <th>Piso</th>
                <th>Categoría</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {allShops.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.name}</strong>
                  </td>
                  <td>{s.floor}</td>
                  <td>{s.category}</td>
                  <td>
                    <button className="button outline" onClick={() => setModal("editShop")}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
