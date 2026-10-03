import type { Metadata } from "next";
import "./globals.css";
import { getProxyContext } from "@/lib/tenant";
import { TenantProvider } from "@/providers/tenant-provider";
import { StoreProvider } from "@/providers/store-provider";
import { AppLayout } from "@/components/layout/app-layout";

export const metadata: Metadata = {
  title: "Paseo Aranjuez · Un lugar. Mil experiencias.",
  description:
    "Descubre tiendas, gastronomía, eventos y experiencias en Paseo Aranjuez, Cochabamba. Gestiona tus Paseo Points, haz pedidos con PaseoYa y conversa con Jarvis Paseo.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const proxy = await getProxyContext();

  return (
    <html lang="es">
      <body>
        <TenantProvider
          supabaseUrl={proxy.tenant.supabaseUrl}
          supabaseAnonKey={proxy.tenant.supabaseAnonKey}
        >
          <StoreProvider>
            <AppLayout>{children}</AppLayout>
          </StoreProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
