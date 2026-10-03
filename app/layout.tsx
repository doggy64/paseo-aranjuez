import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paseo Aranjuez · Un lugar. Mil experiencias.",
  description:
    "Descubre tiendas, gastronomía, eventos y experiencias en Paseo Aranjuez, Cochabamba. Gestiona tus Paseo Points, haz pedidos con PaseoYa y conversa con Jarvis Paseo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
