"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { useSaved } from "@/hooks/use-saved";
import { Product, Order } from "@/modules/ecommerce/types";
import { initialProducts } from "@/modules/ecommerce/utils/mock";

type Movement = { id: string; title: string; points: number; date: string };
type Coupon = { id: string; title: string; code: string; used: boolean };

import { Shop } from "@/modules/directory/types";

type StoreContextType = {
  modal: string | null;
  setModal: React.Dispatch<React.SetStateAction<string | null>>;
  selectedShop: Shop | null;
  setSelectedShop: React.Dispatch<React.SetStateAction<Shop | null>>;
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  cart: Record<string, number>;
  setCart: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  points: number;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  movements: Movement[];
  setMovements: React.Dispatch<React.SetStateAction<Movement[]>>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  reservations: string[];
  setReservations: React.Dispatch<React.SetStateAction<string[]>>;
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  toast: string;
  setToast: React.Dispatch<React.SetStateAction<string>>;
  notify: (message: string) => void;
  equivalence: number;
  addMovement: (title: string, amount: number) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useSaved<string[]>("paseo-favorites-v1", []);
  const [cart, setCart] = useSaved<Record<string, number>>("paseo-cart-v1", {});
  const [points, setPoints] = useSaved("paseo-points-v1", 1250);
  const [products, setProducts] = useSaved<Product[]>("paseo-products-v1", initialProducts);
  const [orders, setOrders] = useSaved<Order[]>("paseo-orders-v1", []);
  const [equivalence] = useSaved("paseo-equivalence-v1", 1);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  
  const [movements, setMovements] = useSaved<Movement[]>("paseo-movements-v1", [
    { id: "initial1", title: "Compra en PUMA", points: 590, date: "18/04/2026" },
    { id: "initial2", title: "Bienvenida al Paseo", points: 200, date: "17/04/2026" },
    { id: "initial3", title: "Tus visitas anteriores", points: 460, date: "16/04/2026" },
  ]);
  
  const [coupons, setCoupons] = useSaved<Coupon[]>("paseo-coupons-v1", []);
  const [reservations, setReservations] = useSaved<string[]>("paseo-reservations-v1", []);
  const [profile, setProfile] = useSaved("paseo-profile-v1", {
    name: "Rodrigo",
    email: "rodrigo.demo@paseoaranjuez.bo",
    phone: "70001234",
    dob: "1995-08-15",
    notifications: true,
  });

  const notify = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 4200);
  };

  const addMovement = (title: string, amount: number) => {
    setPoints((p) => p + amount);
    setMovements((prev) => [
      { id: crypto.randomUUID(), title, points: amount, date: new Date().toLocaleDateString("es-BO") },
      ...prev,
    ]);
  };

  return (
    <StoreContext.Provider value={{
      favorites, setFavorites,
      cart, setCart,
      points, setPoints,
      products, setProducts,
      orders, setOrders,
      movements, setMovements,
      coupons, setCoupons,
      reservations, setReservations,
      profile, setProfile,
      toast, setToast, notify,
      modal, setModal,
      selectedShop, setSelectedShop,
      equivalence, addMovement
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
