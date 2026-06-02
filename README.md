# LyLy Fresh Market

Single-vendor e-commerce storefront for the LyLy D2C grocery brand. The first implementation covers the customer-facing storefront and is inspired by the layout language of the Shopify Local theme while using original branding, content, and hero artwork.

## Included

- Responsive desktop and mobile storefront
- Search suggestions
- Category, lifestyle, promotion, article, and newsletter sections
- Product quick-add actions
- Cart drawer with quantity updates and free-delivery progress
- Mobile navigation drawer
- Shopify-inspired LyLy admin workspace at `/admin`
- Admin dashboard, catalog, orders, customers, marketing, discounts, content, analytics, locations, and settings

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Quality checks

```bash
npm run lint
npm run build
```

## Supabase and Vercel

The storefront can run with local demo data, but production uses Supabase for catalog data,
admin authentication, orders, newsletter subscriptions, and product image storage.

Follow [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) to create the free Supabase project,
apply migrations, deploy Edge Functions, configure an admin account, and deploy the Vite SPA
to Vercel.
