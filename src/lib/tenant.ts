import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function getProxyContext() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  // Boundary multitenant. Se lee de variables de entorno,
  // pero en un escenario multi-host real esto se resolvería por dominio.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  // Inicializamos el cliente de servidor para sesión
  const supabase = await createClient(supabaseUrl, supabaseAnonKey);
  const { data: { session } } = await supabase.auth.getSession();

  return {
    host,
    tenant: {
      supabaseUrl,
      supabaseAnonKey,
    },
    session,
  };
}
