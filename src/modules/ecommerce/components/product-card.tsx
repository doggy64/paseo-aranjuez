import { Heart, Plus } from "lucide-react";
import { Product } from "../types";
import { Shop } from "@/modules/directory/types";

export function ProductCard({
  product,
  shop,
  isFavorite,
  onToggleFavorite,
  onAddCart,
  equivalence = 1,
}: {
  product: Product;
  shop: Shop;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddCart: (product: Product) => void;
  equivalence?: number;
}) {
  const money = (n: number) => `Bs ${n.toLocaleString("es-BO")}`;

  return (
    <div className="shop-card product-card">
      <div className="shop-photo">
        <img src={product.image} alt={`Comercio ${shop.name}`} />
        <span className="photo-badge">
          {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
        </span>
        <button
          type="button"
          className={`button favorite icon-button ${
            isFavorite ? "is-favorite" : ""
          }`}
          aria-label={`Guardar ${product.name}`}
          onClick={() => onToggleFavorite(product.id)}
        >
          <Heart
            size={17}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="shop-info">
        <span className="muted small">
          {shop.name} · {shop.floor}
        </span>
        <h3>{product.name}</h3>
        <div className="product-price">
          <strong>{money(product.price)}</strong>
          <span>+{Math.floor(product.price * equivalence)} puntos</span>
        </div>
        <button
          type="button"
          className="button primary full"
          disabled={product.stock <= 0}
          onClick={() => onAddCart(product)}
        >
          <Plus size={16} />
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}
