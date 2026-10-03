"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Camera, MapPin, ShieldCheck, ArrowLeft } from "lucide-react";

const SECURITY_NAV = [
  { href: "/seguridad/dashboard", icon: LayoutDashboard, label: "Centro de vigilancia" },
  { href: "/seguridad/camaras", icon: Camera, label: "Cámaras" },
  { href: "/seguridad/zonas", icon: MapPin, label: "Zonas" },
  { href: "/seguridad/reglas", icon: ShieldCheck, label: "Reglas" },
];

export default function SeguridadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="seg-layout">
      {/* Sub-nav de seguridad */}
      <nav className="seg-subnav">
        <button
          className="button seg-back"
          onClick={() => router.push("/")}
          aria-label="Volver al inicio"
        >
          <ArrowLeft size={15} />
          Paseo Aranjuez
        </button>
        <div className="seg-subnav-links">
          {SECURITY_NAV.map((n) => (
            <button
              key={n.href}
              className={`button seg-nav-item ${pathname === n.href ? "active" : ""}`}
              onClick={() => router.push(n.href)}
            >
              <n.icon size={16} />
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Contenido de la sección */}
      <div className="seg-content">{children}</div>
    </div>
  );
}
