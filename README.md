# ALOHA Store

Base Next.js + App Router para una tienda de ropa con catálogo dinámico en Prisma/SQLite.

## Arquitectura resumida

- `app/tienda` y `app/tienda/[slug]`: catálogo y detalle públicos.
- `app/admin/productos`: administración básica sin autenticación.
- `lib/products.server.ts`: capa centralizada de consultas, caché pública y helpers de producto.
- `app/admin/productos/actions.ts`: mutaciones server-side para crear, editar y activar/desactivar.
- `prisma/`: esquema, seed y utilitario simple para inicializar la base local.

## Cómo correr

1. Instala dependencias:

```bash
npm install
```

2. Configura variables de entorno usando `.env.example`.

3. Genera cliente Prisma, crea la base local y carga datos:

```bash
DATABASE_URL='file:./dev.db' npm run db:generate
DATABASE_URL='file:./dev.db' npm run db:push
DATABASE_URL='file:./dev.db' npm run db:seed
```

4. Inicia el proyecto:

```bash
DATABASE_URL='file:./dev.db' npm run dev
```

## Rutas importantes

- `/shop`: experiencia visual existente de tienda.
- `/product/[slug]`: detalle visual existente.
- `/tienda`: catálogo dinámico listo para crecer.
- `/tienda/[slug]`: detalle dinámico con variantes e imágenes desde DB.
- `/admin/productos`: listado admin.
- `/admin/productos/nuevo`: crear producto.
- `/admin/productos/[id]/editar`: editar producto.

## Cómo agregar un producto nuevo

Opción 1:
- entra a `/admin/productos/nuevo`
- completa nombre, slug, descripción y precio
- agrega imágenes por URL
- agrega variantes con talla, color, stock y SKU
- guarda

Opción 2:
- modifica el seed en `prisma/seed.ts`
- vuelve a ejecutar:

```bash
DATABASE_URL='file:./dev.db' npm run db:push
DATABASE_URL='file:./dev.db' npm run db:seed
```

## Mantenimiento de la tienda

- Toda consulta de productos debe pasar por `lib/products.server.ts`.
- El catálogo público usa caché simple con revalidación por tags.
- Las mutaciones admin invalidan `products` y revalidan catálogo/detalle.
- `getProductPurchaseSnapshot(...)` deja preparado un punto claro para conectar carrito y checkout después.
- `next.config.mjs` ya acepta imágenes remotas para URLs cargadas desde admin.

## Validaciones útiles

```bash
npx tsc --noEmit
npm run lint
DATABASE_URL='file:./dev.db' npm run build
```
