"use client";

import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { shops, categories } from "@/modules/directory/utils/mock";
import { ProductCard } from "../components/product-card";
import { useStore } from "@/providers/store-provider";
import { Product } from "../types";

export function EcommerceView() {
  const { favorites, setFavorites, cart, setCart, products, equivalence, notify } = useStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const query = search.toLowerCase();
  
  const shopOf = (id: string) => shops.find((s) => s.id === id) || shops[0];

  const filteredProducts = products.filter(
    (p) =>
      (category === "Todos" || p.category === category) &&
      `${p.name} ${shopOf(p.shop).name} ${p.category}`.toLowerCase().includes(query)
  );

  const toggleFavorite = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const addCart = (p: Product) => {
    if ((cart[p.id] || 0) >= p.stock)
      return notify("Has alcanzado el stock disponible.");
    setCart((prev) => ({ ...prev, [p.id]: (prev[p.id] || 0) + 1 }));
    notify(`${p.name} añadido al carrito`);
  };

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">COMPRA HOY. RETIRA CUANDO QUIERAS.</span>
        <h2>PaseoYa</h2>
        <p>Tus tiendas favoritas del Paseo al alcance de un clic. Compra, reserva y recoge tu pedido presencialmente.</p>
      </div>

      <div className="toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Buscar productos"
            placeholder="¿Qué estás buscando hoy?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="category-tabs">
        {categories.map((c) => (
          <button
            key={c.name}
            className={`button category-tab ${category === c.name ? "selected" : ""}`}
            onClick={() => setCategory(c.name)}
          >
            <c.icon size={17} />
            {c.name}
          </button>
        ))}
      </div>

      {filteredProducts.length ? (
        <div className="cards-grid">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              shop={shopOf(p.shop)}
              isFavorite={favorites.includes(p.id)}
              onToggleFavorite={toggleFavorite}
              onAddCart={addCart}
              equivalence={equivalence}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={35} />
          <h3>No encontramos ese producto</h3>
          <p>Prueba con otros términos de búsqueda.</p>
        </div>
      )}
    </>
  );
}
