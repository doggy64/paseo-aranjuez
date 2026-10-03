"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

type TenantContextType = {
  supabase: SupabaseClient;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({
  children,
  supabaseUrl,
  supabaseAnonKey,
}: {
  children: ReactNode;
  supabaseUrl: string;
  supabaseAnonKey: string;
}) {
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseAnonKey));

  return (
    <TenantContext.Provider value={{ supabase }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
