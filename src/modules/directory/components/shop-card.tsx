import { Heart, MapPin, Star, Gift, ArrowUpRight } from "lucide-react";
import { Shop } from "../types";

export function ShopCard({ 
  shop, 
  isFavorite, 
  onToggleFavorite, 
  onView 
}: { 
  shop: Shop;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onView: (shop: Shop) => void;
}) {
  return (
    <div className="shop-card">
      <div className="shop-photo">
        <img src={shop.image} alt={shop.name} />
        <span className="photo-badge">
          <span className="green-dot" />
          En el Paseo
        </span>
        <button
          type="button"
          className={`button favorite icon-button ${isFavorite ? "is-favorite" : ""}`}
          aria-label={`Guardar ${shop.name}`}
          onClick={() => onToggleFavorite(shop.id)}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="shop-info">
        <div className="shop-category">
          {shop.category}
          <span>
            <Star size={12} fill="currentColor" />
            {shop.rating}
          </span>
        </div>
        <h3>{shop.name}</h3>
        <p>
          <MapPin size={13} />
          {shop.floor}
        </p>
        <div className="shop-bottom">
          <span>
            <Gift size={13} />
            Acumula Paseo Points
          </span>
          <button
            type="button"
            className="button small-link"
            onClick={() => onView(shop)}
            aria-label={`Ver ${shop.name}`}
          >
            <ArrowUpRight size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}
