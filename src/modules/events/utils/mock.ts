import { Utensils, Sparkles, Ticket } from "lucide-react";
import { EventItem } from "../types";

export const events: EventItem[] = [
  {
    id: "music",
    title: "Atardeceres con música en vivo",
    type: "Música & gastronomía",
    date: "24 ABR",
    time: "Viernes · 19:00",
    place: "Terraza gourmet · Cuarto piso",
    image: "/assets/cayenna.jpeg",
    icon: Utensils,
  },
  {
    id: "art",
    title: "Un encuentro con el arte",
    type: "Arte & cultura",
    date: "25 ABR",
    time: "Sábado · 15:00",
    place: "Espacio cultural",
    image: "/assets/paseo-exterior.jpg",
    icon: Sparkles,
  },
  {
    id: "kids",
    title: "Pequeños, grandes aventureros",
    type: "Diversión en familia",
    date: "26 ABR",
    time: "Domingo · 15:00",
    place: "Sky Games · Tercer y cuarto piso",
    image: "/assets/game-shop.webp",
    icon: Ticket,
  },
];
