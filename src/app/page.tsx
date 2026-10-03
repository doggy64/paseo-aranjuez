"use client";
import { Leaf, Map, ArrowUpRight, Sparkles, ArrowRight, Trophy, ShoppingBag, CalendarDays, Gift, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/providers/store-provider";
import { shops, categories } from "@/modules/directory/utils/mock";
import { PointsCard } from "@/modules/loyalty/components/points-card";
import { ShopCard } from "@/modules/directory/components/shop-card";

export default function HomePage() {
  const router = useRouter();
  const { profile, favorites, setFavorites, setModal, setSelectedShop } = useStore();
  const go = (path: string) => router.push(path);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const shopCard = (s: any) => (
    <ShopCard
      key={s.id}
      shop={s}
      isFavorite={favorites.includes(s.id)}
      onToggleFavorite={toggleFavorite}
      onView={(shop) => {
        setSelectedShop(shop);
        setModal('shop');
      }}
    />
  );

  return (
    <>
      <div className="welcome-heading">
        <div>
          <div className="welcome-eyebrow">
            <span className="green-dot" />
            TU PRÓXIMA EXPERIENCIA EMPIEZA AQUÍ
          </div>
          <h1>
            Hola, {profile.name}. <span>Bienvenida a tu Paseo.</span>
          </h1>
          <p>
            Descubre, disfruta y conecta. Todo lo que te gusta, en un
            solo lugar.
          </p>
        </div>
        <button
          className="button outline map-top"
          onClick={() => {
            go("/explorar");
          }}
        >
          <Map size={16} />
          Ver mapa del Paseo
          <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="home-top-grid">
        <div className="hero">
          <img
            className="hero-image"
            src="/assets/paseo-exterior.jpg"
            alt="Vista exterior de Paseo Aranjuez"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <span className="hero-pill">
              <Leaf size={12} />
              MÁS QUE UN LUGAR, TU LUGAR
            </span>
            <h2>
              Hay un Paseo
              <br />
              para cada momento.
            </h2>
            <p>
              Sabores que sorprenden, tiendas que inspiran
              <br />y experiencias que quieres repetir.
            </p>
            <button
              className="button hero-cta"
              onClick={() => go("/explorar")}
            >
              Descubre el Paseo
              <ArrowUpRight size={17} />
            </button>
          </div>
          <div className="hero-footer">
            <span>
              <MapPin size={13} />
              Paseo Aranjuez · Cochabamba
            </span>
            <div className="hero-dots">
              <i className="active" />
              <i />
              <i />
            </div>
          </div>
        </div>
        <div className="home-right">
          <PointsCard points={1250} onGoToPoints={() => go('/puntos')} onShowQR={() => setModal('qr')} />
          <button
            className="button jarvis-teaser"
            onClick={() => go("/jarvis")}
          >
            <span className="jarvis-orb">
              <Sparkles size={22} />
            </span>
            <span>
              <strong>Un plan perfecto, en segundos</strong>
              <small>Pregúntale a Jarvis. Él conoce el Paseo.</small>
            </span>
            <ArrowUpRight size={19} />
          </button>
        </div>
      </div>
      <div className="quick-actions">
        <button className="button" onClick={() => go("/paseoya")}>
          <span className="quick-icon peach">
            <ShoppingBag size={20} />
          </span>
          <span>
            <strong>Compra en PaseoYa</strong>
            <small>Elige online, recoge en el Paseo</small>
          </span>
          <ArrowUpRight size={17} />
        </button>
        <button className="button" onClick={() => go("/puntos")}>
          <span className="quick-icon gold">
            <Gift size={20} />
          </span>
          <span>
            <strong>Tus puntos, tus beneficios</strong>
            <small>Cada visita tiene su recompensa</small>
          </span>
          <ArrowUpRight size={17} />
        </button>
        <button className="button" onClick={() => go("/eventos")}>
          <span className="quick-icon lavender">
            <CalendarDays size={20} />
          </span>
          <span>
            <strong>Siempre hay algo por vivir</strong>
            <small>Descubre eventos y experiencias</small>
          </span>
          <ArrowUpRight size={17} />
        </button>
      </div>
      <section className="discover-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">ENCUENTRA TU LUGAR</span>
            <h2>Un Paseo, muchas posibilidades</h2>
          </div>
          <button
            className="button text-link"
            onClick={() => go("/explorar")}
          >
            Ver todo el directorio
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="home-categories">
          {categories.slice(1).map((c) => (
            <button
              key={c.name}
              className="button"
              onClick={() => go("/explorar")}
            >
              <span>
                <c.icon size={24} strokeWidth={1.5} />
              </span>
              <strong>
                {c.name === "Oficinas y servicios"
                  ? "Oficinas & servicios"
                  : c.name}
              </strong>
            </button>
          ))}
        </div>
      </section>
      <section>
        <div className="section-title">
          <div>
            <span className="eyebrow">HECHO PARA TI</span>
            <h2>Tu próximo favorito está aquí</h2>
            <p>Lugares que vale la pena descubrir, una y otra vez.</p>
          </div>
          <button
            className="button text-link"
            onClick={() => go("/explorar")}
          >
            Explorar lugares
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="cards-grid home-shops">
          {shops.slice(0, 4).map(shopCard)}
        </div>
      </section>
      <div className="bottom-home-grid">
        <section>
          <div className="section-title">
            <h2>El Paseo se vive</h2>
            <button
              className="button text-link"
              onClick={() => go("/eventos")}
            >
              Ver agenda
              <ArrowRight size={15} />
            </button>
          </div>
          <div className="mini-event">
            <div className="date-tile">
              <strong>24</strong>
              <span>ABR</span>
            </div>
            <div>
              <span className="eyebrow">MÚSICA & GASTRONOMÍA</span>
              <h3>Atardeceres con música en vivo</h3>
              <p>Terraza gourmet · 19:00</p>
            </div>
            <button
              className="button icon-button"
              aria-label="Ver evento"
              onClick={() => go("/eventos")}
            >
              <ArrowUpRight size={20} />
            </button>
          </div>
        </section>
        <div className="mission-home">
          <Trophy size={26} />
          <div>
            <span className="eyebrow">TU RETO DEL MES</span>
            <h3>Descubre más. Gana más.</h3>
            <p>Visita 3 comercios diferentes y recibe 150 puntos extra.</p>
          </div>
          <button
            className="button icon-button"
            aria-label="Ver misiones"
            onClick={() => go("/puntos")}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
