# GoodLuck Website

E-commerce de ropa GoodLuck: catálogo moderno, diseñador custom (Fabric.js), checkout multi-pago y backend en Supabase. Deploy pensado para Vercel.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth, Postgres, Storage, RLS)
- Pagos: Stripe, Wompi, Mercado Pago, contra entrega
- Editor: Fabric.js + Zustand

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

El catálogo funciona **sin Supabase** usando `data/catalog.ts` y placeholders en `public/products/`.

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run import:assets` | Copia mockups/diseños desde `GOODLUCK_ASSETS_PATH` |
| `npm run seed` | Carga catálogo a Supabase |

## Importar assets reales

Cuando tengas la carpeta de proyectos:

```bash
# En .env.local
GOODLUCK_ASSETS_PATH=C:/Users/monic/Documents/00_Proyectos/01_GoodLuck

npm run import:assets
```

Copia:

- `01_Mock ups/*` → `public/products/mockups/`
- `00_Diseños/02_Mundial '26/*` → `public/products/designs/mundial-2026/`
- PDFs de catálogo → `docs/catalogs/`

## Supabase

1. Crea un proyecto (recomendado `sa-east-1`).
2. Aplica la migración:

```bash
npx supabase db push
# o ejecuta supabase/migrations/001_initial_schema.sql en el SQL Editor
```

3. Rellena `.env.local` con URL y keys.
4. Siembra el catálogo:

```bash
npm run seed
```

5. Para admin, en SQL:

```sql
update profiles set role = 'admin' where email = 'tu@email.com';
```

## Pagos

Configura las keys en Vercel / `.env.local`. Sin keys, **contra entrega** sigue disponible.

Webhooks:

- `/api/webhooks/stripe`
- `/api/webhooks/wompi`
- `/api/webhooks/mercadopago`

## Deploy en Vercel

1. Importa este repo en Vercel (root = `goodluck-website` si es monorepo).
2. Añade las variables de `.env.example`.
3. Deploy. Opcional: dominio custom (`goodluck.co`).

```bash
npx vercel
```

## Rutas principales

- `/` — Home
- `/catalogo` — Catálogo con filtros
- `/catalogo/[slug]` — Producto
- `/colecciones/[slug]` — Colección
- `/disenar` — Editor custom
- `/checkout` — Carrito + pago
- `/cuenta/*` — Auth, pedidos, diseños
- `/admin` — Pedidos y catálogo (rol admin)
