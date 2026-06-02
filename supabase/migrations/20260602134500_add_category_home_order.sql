alter table public.categories
add column home_display_order integer not null default 0;

update public.categories
set home_display_order = case name
  when 'Bread & Bakery' then 10
  when 'Flour & Baking' then 20
  when 'Fruits & Vegetables' then 30
  when 'Fresh Meals & Pizzas' then 40
  when 'Beverages' then 50
  when 'Fresh Meat' then 60
  when 'Dairy & Eggs' then 70
  when 'Sauces & Marinades' then 80
  else display_order
end;
