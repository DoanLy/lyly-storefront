create temporary table desired_categories (
  name text primary key,
  slug text not null,
  parent_name text,
  display_order integer not null
) on commit drop;

insert into desired_categories (name, slug, parent_name, display_order)
values
  ('Pantry', 'pantry', null, 10),
  ('Pasta & Noodles', 'pasta-noodles', 'Pantry', 11),
  ('Grains & Beans', 'grains-beans', 'Pantry', 12),
  ('Snacks', 'snacks', 'Pantry', 13),
  ('Oil, Vinegar & Spices', 'oil-vinegar-spices', 'Pantry', 14),
  ('Sauces & Marinades', 'sauces-marinades', 'Pantry', 15),
  ('Dressings', 'dressings', 'Pantry', 16),
  ('Produce', 'produce', null, 20),
  ('Fruits & Vegetables', 'fruits-vegetables', 'Produce', 21),
  ('Vegetables', 'vegetables', 'Produce', 22),
  ('Fruit', 'fruit', 'Produce', 23),
  ('Herbs & Aromatics', 'herbs-aromatics', 'Produce', 24),
  ('Drinks', 'drinks', null, 30),
  ('Beverages', 'beverages', 'Drinks', 31),
  ('Coffee', 'coffee', 'Drinks', 32),
  ('Tea & Elixirs', 'tea-elixirs', 'Drinks', 33),
  ('Juices', 'juices', 'Drinks', 34),
  ('Bakery', 'bakery', null, 40),
  ('Bread & Bakery', 'bread-bakery', 'Bakery', 41),
  ('Flour & Baking', 'flour-baking', 'Bakery', 42),
  ('Bread', 'bread', 'Bakery', 43),
  ('Buns & Rolls', 'buns-rolls', 'Bakery', 44),
  ('Bagels & Breakfast', 'bagels-breakfast', 'Bakery', 45),
  ('Gluten-Free', 'gluten-free', 'Bakery', 46),
  ('Dairy & Eggs', 'dairy-eggs', null, 50),
  ('Milk & Cream', 'milk-cream', 'Dairy & Eggs', 51),
  ('Eggs & Butter', 'eggs-butter', 'Dairy & Eggs', 52),
  ('Cheese', 'cheese', 'Dairy & Eggs', 53),
  ('Yogurt & Cultured Dairy', 'yogurt-cultured-dairy', 'Dairy & Eggs', 54),
  ('Plant-Based', 'plant-based', 'Dairy & Eggs', 55);

insert into public.categories (name, slug, active, include_in_menu, display_order, home_display_order)
select name, slug, true, true, display_order, display_order
from desired_categories
where parent_name is null
on conflict (name) do update
set
  slug = excluded.slug,
  parent_id = null,
  active = true,
  include_in_menu = true,
  display_order = excluded.display_order;

insert into public.categories (parent_id, name, slug, active, include_in_menu, display_order, home_display_order)
select parent.id, desired.name, desired.slug, true, false, desired.display_order, desired.display_order
from desired_categories desired
join public.categories parent on parent.name = desired.parent_name
where desired.parent_name is not null
on conflict (name) do update
set
  slug = excluded.slug,
  parent_id = excluded.parent_id,
  active = true,
  include_in_menu = false,
  display_order = excluded.display_order;

update public.products
set category = 'Pasta & Noodles'
where category = 'Fresh Meals & Pizzas';

update public.products
set category = 'Pantry'
where category = 'Fresh Meat';

update public.products
set category = 'Pantry'
where category not in (select name from desired_categories);

delete from public.categories
where name not in (select name from desired_categories);

create or replace function public.enforce_category_root()
returns trigger
language plpgsql
as $$
begin
  if new.parent_id is null
    and new.name not in ('Pantry', 'Produce', 'Drinks', 'Bakery', 'Dairy & Eggs') then
    raise exception 'Categories must belong to one of the five managed roots';
  end if;

  return new;
end;
$$;

create trigger categories_enforce_root
before insert or update of parent_id, name on public.categories
for each row execute function public.enforce_category_root();
