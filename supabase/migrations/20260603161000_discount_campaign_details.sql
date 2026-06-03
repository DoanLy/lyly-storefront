alter table public.discounts
add column if not exists title text,
add column if not exists method text not null default 'code'
  check (method in ('code', 'automatic')),
add column if not exists discount_type text not null default 'order'
  check (discount_type in ('order', 'product', 'buy_x_get_y', 'shipping')),
add column if not exists value_type text not null default 'percentage'
  check (value_type in ('percentage', 'fixed', 'free')),
add column if not exists value_amount numeric(12, 2) not null default 0
  check (value_amount >= 0),
add column if not exists applies_to jsonb not null default '{}'::jsonb,
add column if not exists minimum_type text not null default 'none'
  check (minimum_type in ('none', 'amount', 'quantity')),
add column if not exists minimum_value numeric(12, 2) not null default 0
  check (minimum_value >= 0),
add column if not exists usage_limit integer
  check (usage_limit is null or usage_limit > 0),
add column if not exists once_per_customer boolean not null default false,
add column if not exists combines jsonb not null default '{}'::jsonb,
add column if not exists starts_at timestamptz not null default now();

alter table public.discounts
alter column code drop not null;

update public.discounts
set
  title = coalesce(title, code),
  value_amount = case
    when value_amount = 0 and percent_off is not null then percent_off
    else value_amount
  end,
  value_type = case
    when percent_off is not null then 'percentage'
    else value_type
  end
where title is null or value_amount = 0;
