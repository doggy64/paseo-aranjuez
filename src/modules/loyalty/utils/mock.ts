import { Coffee, Gift, Star } from "lucide-react";
import { Reward } from "../types";

export const rewards: Reward[] = [
  {
    id: "cafe",
    title: "Tu próxima pausa, por nuestra cuenta",
    shop: "Cayenna Bistro Café",
    cost: 300,
    icon: Coffee,
    description: "Un café de cortesía para disfrutar en el Paseo.",
  },
  {
    id: "discount",
    title: "Un detalle para ti",
    shop: "Tiendas participantes",
    cost: 500,
    icon: Gift,
    description: "Cupón de Bs 50 en compras superiores a Bs 250.",
  },
  {
    id: "vip",
    title: "Una experiencia diferente",
    shop: "Terraza gourmet",
    cost: 1000,
    icon: Star,
    description: "Acceso a una degustación especial para una persona.",
  },
];
