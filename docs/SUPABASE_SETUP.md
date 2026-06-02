# Supabase and Vercel Setup

This project uses:

- Supabase Postgres for catalog, customers, orders, discounts, articles, and newsletter data.
- Supabase Auth plus the `admin_users` allowlist for `/admin`.
- Supabase Storage bucket `product-images` for future catalog uploads.
- Supabase Edge Functions for public newsletter signup and server-side order creation.
- Vercel for the Vite SPA.

## 1. Create the Supabase project

Create a Free project in the Supabase dashboard and select the closest available region. The
current hosted project uses Seoul. Keep the project reference available from
**Project Settings > General**.

Install and authenticate the CLI:

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

Apply the schema and deploy the public Edge Functions:

```powershell
npx supabase db push
npx supabase functions deploy create-order newsletter-subscribe --no-verify-jwt --use-api
```

Hosted Edge Functions automatically receive `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY`. Never expose the service-role or secret key to Vite.

## 2. Configure the frontend

Copy `.env.example` to `.env.local`. In **Project Settings > API**, copy the project URL and
the publishable key:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Run locally:

```powershell
npm run dev
```

Without these variables, the app intentionally stays in local demo mode.

## 3. Create the first admin

In the Supabase dashboard, open **Authentication > Users** and create a user with email and
password. Then run this query in **SQL Editor**, replacing the email:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'YOUR_ADMIN_EMAIL'
on conflict (user_id) do nothing;
```

Open `/admin` and sign in with that account. Row Level Security prevents non-admin users from
reading draft products or changing catalog records.

## 4. Deploy to Vercel

Import `DoanLy/lyly-storefront` in Vercel or deploy with the CLI:

```powershell
npx vercel login
npx vercel
```

In the Vercel project settings, add these variables for Production, Preview, and Development:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Then trigger a production deployment:

```powershell
npx vercel --prod
```

`vercel.json` rewrites deep links such as `/admin/products` back to `index.html`.

## Operational notes

- The order Edge Function recalculates prices from Postgres and reduces stock in one database
  transaction. The browser cannot set trusted prices.
- Payment collection is not enabled yet. New orders start with `payment_status = pending`.
- Product image upload UI is not enabled yet, but the Storage bucket and policies are ready.
- Before a public launch, add bot protection or rate limiting to public Edge Functions and
  connect the selected payment provider webhook.
