# Project Structure Blueprint (Bilingual)

This document describes the current codebase structure for the ALOHA storefront, in both English and Spanish. It is based on the existing folders and files in this repository.

---

## 1) Overview / Resumen

**EN:** This is a Next.js App Router storefront with UI components organized by domain. Styling is handled via `app/globals.css` (Tailwind v4 + custom theme + global styles). Product data is stored locally in `lib/products.ts` and `src/data/*`.  
**ES:** Esta es una tienda en Next.js con App Router, con componentes organizados por dominio. El estilo global vive en `app/globals.css` (Tailwind v4 + tema + estilos globales). Los datos de producto están en `lib/products.ts` y `src/data/*`.

---

## 2) High‑Level Tree / Árbol de Alto Nivel

**EN:** Main directories and their responsibilities.  
**ES:** Directorios principales y su responsabilidad.

```
app/                 # Next.js App Router routes and layouts
components/          # UI components organized by domain
components/ui/       # Reusable UI primitives (buttons, cards, navbar)
components/home/     # Home page sections
components/product/  # Product cards/detail/related products
components/shop/     # Shop page UI and filters
components/cart/     # Cart UI + drawer
components/checkout/ # Checkout flow UI
components/layout/   # Header / Footer / shared layout UI
components/admin/    # Admin-facing UI
components/collections/ # Collections UI (if used by pages)

lib/                 # Shared utilities and core product data
lib/types.ts         # Primary type definitions
lib/products.ts      # Current product dataset (used by app)
lib/bold/            # Bold payment integration helpers

src/data/            # Legacy or alternate data sources
styles/              # Tailwind globals (unused in App Router)
public/              # Static assets (product images)
hooks/               # Shared hooks
docs/                # Project documentation
```

---

## 3) Routing (App Router) / Rutas (App Router)

**EN:** Each folder under `app/` represents a route segment.  
**ES:** Cada carpeta en `app/` representa un segmento de ruta.

```
app/layout.tsx       # Root layout (imports app/globals.css)
app/page.tsx         # Home page

app/shop/            # /shop
app/product/[slug]/  # Product detail
app/cart/            # /cart
app/checkout/        # /checkout
app/order/           # /order
app/order-confirmation/ # /order-confirmation
app/guia-de-tallas/  # /guia-de-tallas
app/devoluciones/    # /devoluciones
app/devoluciones-y-cambios/
app/terminos/
app/politicas-comerciales/
app/politicas-de-privacidad/
app/privacidad/
app/admin/           # admin tools
app/api/             # API routes (server)
```

---

## 4) Styling System / Sistema de Estilos

**EN:**
- Global styles live in `app/globals.css`.
- Tailwind v4 is imported there.
- The liquid background, mesh gradient, and typography are configured globally.
- Glassmorphism primitives are provided by utility classes (`glass-panel`, `glass-hover`, etc.).

**ES:**
- Los estilos globales viven en `app/globals.css`.
- Tailwind v4 se importa allí.
- El fondo líquido, el mesh gradient y la tipografía están configurados globalmente.
- Las utilidades de glassmorphism se definen con clases (`glass-panel`, `glass-hover`, etc.).

---

## 5) Core UI Components / Componentes UI Base

**EN:** UI primitives are in `components/ui/`. These are reused by sections and pages.  
**ES:** Los componentes base están en `components/ui/`. Se reutilizan en secciones y páginas.

Examples:
- `components/ui/button.tsx` — base buttons
- `components/ui/glass-card.tsx` — glassmorphism wrapper
- `components/ui/glass-navbar.tsx` — sticky, blur-on-scroll navbar

---

## 6) Home Sections / Secciones Home

**EN:** Home is composed by `app/page.tsx`. Sections are in `components/home/`.  
**ES:** La home se arma en `app/page.tsx`. Las secciones viven en `components/home/`.

Examples:
- `components/home/hero-section.tsx`
- `components/home/hot-sale-section.tsx`
- `components/home/best-sellers-section.tsx`
- `components/home/collection-section.tsx`

---

## 7) Product Architecture / Arquitectura de Productos

**EN:**
- Product cards live in `components/product/product-card.tsx`.
- Detail view in `components/product/product-detail.tsx`.
- Related products in `components/product/related-products.tsx`.
- Data comes from `lib/products.ts` (current source of truth).

**ES:**
- Las tarjetas de producto están en `components/product/product-card.tsx`.
- El detalle está en `components/product/product-detail.tsx`.
- Productos relacionados en `components/product/related-products.tsx`.
- Los datos vienen de `lib/products.ts` (fuente principal actual).

---

## 8) Data & Types / Datos y Tipos

**EN:**
- `lib/types.ts` defines the canonical types for products and orders.
- `lib/products.ts` is the primary dataset used by the app.
- `src/data/*` contains additional data files (catalog, collections, products).

**ES:**
- `lib/types.ts` define los tipos principales.
- `lib/products.ts` es el dataset principal.
- `src/data/*` contiene datos adicionales (catálogo, colecciones, productos).

---

## 9) State & Store / Estado y Store

**EN:** Cart state is managed via `useCartStore` in `lib/store` (Zustand).  
**ES:** El estado del carrito se maneja con `useCartStore` en `lib/store` (Zustand).

---

## 10) Payments / Pagos

**EN:** Bold payment integration lives in `lib/bold/` and API routes under `app/api/`.  
**ES:** La integración con Bold está en `lib/bold/` y las rutas API en `app/api/`.

---

## 11) Images / Imágenes

**EN:** Static images are in `public/`, with product images under `public/products/`.  
**ES:** Las imágenes están en `public/`, y los productos en `public/products/`.

---

## 12) Recommended Growth Path / Ruta Recomendada

**EN:**
- Consolidate data sources by choosing either `lib/products.ts` or `src/data/*` as the single source of truth.
- Add a `/components/collections` UI only if collections become a major product surface.
- Consider `lib/content/` for editorial content (marketing pages, copy blocks).

**ES:**
- Consolidar fuentes de datos eligiendo `lib/products.ts` o `src/data/*` como única fuente.
- Usar `/components/collections` si las colecciones se vuelven una superficie central.
- Considerar `lib/content/` para contenido editorial (marketing, copy).

---

## 13) File Index (Key Files) / Índice de Archivos (Clave)

```
app/layout.tsx                  # Root layout + global CSS
app/globals.css                 # Global theme + typography + background
app/page.tsx                    # Home composition
components/layout/header.tsx    # Navbar
components/layout/footer.tsx    # Footer
components/product/product-card.tsx
components/product/product-detail.tsx
components/shop/shop-content.tsx
lib/types.ts
lib/products.ts
```

---

If you want this turned into a living `ARCHITECTURE.md` or expanded with diagrams, I can add it.  
Si quieres esto como un `ARCHITECTURE.md` vivo o con diagramas, lo preparo.
