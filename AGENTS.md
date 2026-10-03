<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Arquitectura Modular por Dominio (Paseo Aranjuez)

## Objetivo
El proyecto sigue una arquitectura modular (Vertical Slices):
- Next.js 16.2.x + React 19 + TypeScript
- App Router con rutas finas (`src/app/`) que delegan a módulos de dominio
- Módulos por dominio en `src/modules/<dominio>/` (vertical slices)
- Separación clara server/browser (clientes Supabase diferenciados)
- Multi-tenancy por host, autenticación centralizada
- Sin `middleware.ts` (límite en `src/lib/tenant.ts` + `src/app/layout.tsx`)
- Componentes compartidos en `src/components/` (shadcn/ui), utilidades en `src/utils/`, hooks en `src/hooks/`
- Sin Drizzle, sin `src/db/`

## Reglas inquebrantables
- Usa `pnpm` únicamente. No modifiques `package-lock.json`.
- Next.js App Router: rutas vivas en `src/app/`. No crees `middleware.ts`.
- El boundary tenant/sesión debe permanecer en `src/lib/tenant.ts` y en `src/app/layout.tsx`.
- Clientes Supabase: server = `src/utils/supabase/server.ts`, browser = `src/utils/supabase/client.ts` + `TenantProvider`.
- Autorización: valida permisos/feature flags **en servidor** (API/routes server). Checks en cliente solo para UX.
- Variables: leer directo de `process.env`. `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- No inventes comandos inexistentes. Usa migraciones SQL en `supabase/migrations/` si existen.
- Mantén labels en español si el área circundante ya lo está. Respeta tokens semánticos y shadcn/ui.

## Estructura objetivo (obligatoria)
```
src/
├── app/                    # App Router: rutas finas (page/layout). Delega a módulo.
├── components/             # Primitivas compartidas + UI reutilizable (shadcn/ui)
├── hooks/                  # Hooks React compartidos
├── lib/                    # Helpers puros compartidos (ej. tenant.ts)
├── modules/                # Módulos por dominio (vertical slice)
│   └── <dominio>/
│       ├── components/     # Componentes UI específicos del dominio
│       ├── hooks/          # Hooks específicos del dominio
│       ├── services/       # Acceso remoto (fetch/RPC/Supabase) server-first
│       ├── types/          # Tipos/interfaces del dominio
│       ├── utils/          # Utilidades puras del dominio
│       ├── views/          # Vistas compuestas (ej. directory-view.tsx)
├── providers/              # Providers globales (TenantProvider, StoreProvider)
├── types/                  # Tipos globales compartidos
└── utils/                  # Utilidades globales (supabase/)
```

## Directrices para el Agente (Implementación futura)
1. **Analizar estado actual**: identificar dominios funcionales.
2. **Rutas finas**: reducir `src/app/**/page.tsx` a pura orquestación e invocación de un `View` del módulo.
3. **Server/browser boundary**: marcar componentes cliente con `'use client'` solo si es estrictamente necesario.
4. **No inventar dependencias**: usar solo lo existente en `package.json`.
