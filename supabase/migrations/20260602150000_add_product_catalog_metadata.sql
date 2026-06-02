alter table public.products
add column if not exists manufacturer text not null default 'LyLy Market',
add column if not exists vendor text not null default 'LyLy Market',
add column if not exists warehouse text not null default 'Main Store',
add column if not exists product_type text not null default 'Grocery';

update public.products
set
  manufacturer = case
    when category in ('Bread & Bakery', 'Pasta & Noodles') then 'LyLy Kitchen'
    when category in ('Fruits & Vegetables', 'Dairy & Eggs') then 'Local Farms'
    else 'LyLy Market'
  end,
  vendor = case
    when category in ('Fruits & Vegetables', 'Dairy & Eggs') then 'Green Valley Supply'
    else 'LyLy Market'
  end,
  warehouse = case
    when stock = 0 then 'Manhattan Store'
    else 'Main Store'
  end,
  product_type = case
    when category in ('Bread & Bakery', 'Pasta & Noodles') then 'Prepared food'
    when category = 'Dairy & Eggs' then 'Dairy'
    when category = 'Fruits & Vegetables' then 'Fresh produce'
    else 'Grocery'
  end;
