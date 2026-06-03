alter table public.articles
  add column if not exists author text not null default 'LyLy Editorial',
  add column if not exists content text,
  add column if not exists tags jsonb not null default '[]'::jsonb,
  add column if not exists type text not null default 'news'
    check (type in ('news', 'recipe'));

create table if not exists public.store_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists store_settings_set_updated_at on public.store_settings;
create trigger store_settings_set_updated_at
before update on public.store_settings
for each row execute function public.set_updated_at();

alter table public.store_settings enable row level security;

drop policy if exists "Public can read store settings" on public.store_settings;
create policy "Public can read store settings"
on public.store_settings for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage store settings" on public.store_settings;
create policy "Admins can manage store settings"
on public.store_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.store_settings (key, value)
values
  ('general', '{"storeName":"LyLy Fresh Market","contactEmail":"lydoan.king@gmail.com","phone":"","country":"Vietnam","currency":"VND","timezone":"Asia/Bangkok","orderPrefix":"LY"}'::jsonb),
  ('shipping', '{"pickupEnabled":true,"deliveryEnabled":true,"freeShippingThreshold":75,"localDeliveryFee":0,"domesticShippingFee":8,"expressShippingFee":18,"promise":"Usually ready in 2 hrs"}'::jsonb),
  ('notifications', '{"senderEmail":"lydoan.king@gmail.com","customerNotifications":true,"staffNotifications":true,"webhooks":false}'::jsonb)
on conflict (key) do nothing;
