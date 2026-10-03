"use client";

import { useState } from "react";
import { Search, Heart, Map, MapPin, BriefcaseBusiness, ArrowRight } from "lucide-react";
import { Shop } from "../types";
import { shops, categories } from "../utils/mock";
import { ShopCard } from "../components/shop-card";
import { useStore } from "@/providers/store-provider";

export function DirectoryView({
  setSelectedShop,
  setModal,
}: {
  setSelectedShop: (shop: Shop) => void;
  setModal: (modal: string) => void;
}) {
  const { favorites, setFavorites } = useStore();
  const [search, setSearch] = useState("");
  const [floor, setFloor] = useState("Todos los pisos");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [category, setCategory] = useState("Todos");

  const query = search.toLowerCase();
  const allShops = shops; // If extraShops are needed, they can be added to store later

  const filteredShops = allShops.filter(
    (s) =>
      (category === "Todos" || s.category === category) &&
      `${s.name} ${s.category} ${s.description}`.toLowerCase().includes(query) &&
      (!onlyFavorites || favorites.includes(s.id)) &&
      (floor === "Todos los pisos" || s.floor === floor)
  );

  const toggleFavorite = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">UN LUGAR. MIL POSIBILIDADES.</span>
        <h2>Encuentra tu lugar en el Paseo</h2>
        <p>Tiendas, sabores, servicios y espacios para conectar con lo que te gusta.</p>
      </div>

      <div className="toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Buscar establecimientos"
            placeholder="Busca una tienda, un sabor o un servicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          aria-label="Filtrar por piso"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
        >
          {[
            "Todos los pisos",
            "Planta baja",
            "Primer piso",
            "Segundo piso",
            "Tercer piso",
            "Cuarto piso",
          ].map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
        <button
          className={`button outline ${onlyFavorites ? "selected" : ""}`}
          onClick={() => setOnlyFavorites(!onlyFavorites)}
        >
          <Heart size={16} />
          Favoritos
        </button>
        <button className="button outline" onClick={() => setMapView(!mapView)}>
          <Map size={16} />
          {mapView ? "Ver directorio" : "Ver mapa"}
        </button>
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

      {mapView ? (
        <div className="map-panel">
          <div className="section-title">
            <div>
              <h2>Tu guía dentro del Paseo</h2>
              <p>Esquema de navegación ilustrativo, no es un plano oficial.</p>
            </div>
            <MapPin size={25} />
          </div>
          <div className="floor-map">
            {[
              "Cuarto piso",
              "Tercer piso",
              "Segundo piso",
              "Primer piso",
              "Planta baja",
            ].map((f) => (
              <div className="map-floor" key={f}>
                <strong>{f}</strong>
                <div>
                  {allShops
                    .filter((s) => s.floor.toLowerCase() === f.toLowerCase())
                    .map((s) => (
                      <button
                        key={s.id}
                        className="button"
                        onClick={() => {
                          setSelectedShop(s);
                          setModal("shop");
                        }}
                      >
                        <MapPin size={15} />
                        {s.name}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : category === "Oficinas y servicios" ? (
        <div className="office-feature">
          <img src="/assets/paseo-building.jpg" alt="Oficinas" />
          <div>
            <span className="eyebrow">TU NEGOCIO, EN OTRO NIVEL</span>
            <h2>Espacios para grandes ideas</h2>
            <p>
              Oficinas tipo A, B, C y D en las torres empresariales. Cowork con
              proyector, vistas panorámicas y alquiler flexible por hora, día o
              mes.
            </p>
            <div className="tags">
              <span>Oficinas</span>
              <span>Cowork</span>
              <span>Empresas</span>
              <span>Servicios</span>
            </div>
            <button className="button outline" onClick={() => setModal("cowork")}>
              Solicitar información
            </button>
          </div>
        </div>
      ) : filteredShops.length ? (
        <div className="cards-grid">
          {filteredShops.map((s) => (
            <ShopCard
              key={s.id}
              shop={s}
              isFavorite={favorites.includes(s.id)}
              onToggleFavorite={toggleFavorite}
              onView={(shop) => {
                setSelectedShop(shop);
                setModal("shop");
              }}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Map size={35} />
          <h3>No se encontraron resultados</h3>
          <p>Prueba con otros términos de búsqueda o filtros.</p>
        </div>
      )}
    </>
  );
}
