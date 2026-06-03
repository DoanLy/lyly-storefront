alter table public.orders
add column if not exists subtotal numeric(12, 2) not null default 0 check (subtotal >= 0),
add column if not exists discount_total numeric(12, 2) not null default 0 check (discount_total >= 0),
add column if not exists delivery_fee numeric(12, 2) not null default 0 check (delivery_fee >= 0),
add column if not exists tax_total numeric(12, 2) not null default 0 check (tax_total >= 0),
add column if not exists delivery_method text not null default 'local',
add column if not exists payment_method text not null default 'cod',
add column if not exists shipping_address text,
add column if not exists notes text;

create or replace function public.create_storefront_order(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_customer_location text,
  p_delivery_method text,
  p_payment_method text,
  p_notes text,
  p_order_totals jsonb,
  p_items jsonb
)
returns table (
  order_id uuid,
  order_number text,
  total numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(12, 2) := 0;
  v_discount numeric(12, 2) := greatest(0, coalesce((p_order_totals ->> 'discount')::numeric, 0));
  v_delivery_fee numeric(12, 2) := greatest(0, coalesce((p_order_totals ->> 'deliveryFee')::numeric, 0));
  v_tax numeric(12, 2) := greatest(0, coalesce((p_order_totals ->> 'tax')::numeric, 0));
  v_total numeric(12, 2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_product_id bigint;
  v_quantity integer;
begin
  if length(trim(coalesce(p_customer_name, ''))) < 2 then
    raise exception 'Invalid customer name';
  end if;

  if length(trim(coalesce(p_customer_email, ''))) < 3 then
    raise exception 'Invalid customer email';
  end if;

  if jsonb_typeof(p_items) <> 'array' then
    raise exception 'Items must be an array';
  end if;

  if jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 50 then
    raise exception 'Invalid item count';
  end if;

  insert into public.customers (email, full_name, phone, location)
  values (
    lower(trim(p_customer_email)),
    trim(p_customer_name),
    nullif(trim(coalesce(p_customer_phone, '')), ''),
    nullif(trim(coalesce(p_customer_location, '')), '')
  )
  on conflict (email) do update
  set
    full_name = excluded.full_name,
    phone = coalesce(excluded.phone, public.customers.phone),
    location = coalesce(excluded.location, public.customers.location)
  returning id into v_customer_id;

  v_order_number := '#LY' || lpad(nextval('public.order_number_seq')::text, 4, '0');

  insert into public.orders (
    order_number,
    customer_id,
    delivery_method,
    payment_method,
    shipping_address,
    notes
  )
  values (
    v_order_number,
    v_customer_id,
    coalesce(nullif(trim(p_delivery_method), ''), 'local'),
    coalesce(nullif(trim(p_payment_method), ''), 'cod'),
    nullif(trim(coalesce(p_customer_location, '')), ''),
    nullif(trim(coalesce(p_notes, '')), '')
  )
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if coalesce(v_item ->> 'productId', '') !~ '^[0-9]+$'
      or coalesce(v_item ->> 'quantity', '') !~ '^[0-9]+$' then
      raise exception 'Invalid order item';
    end if;

    v_product_id := (v_item ->> 'productId')::bigint;
    v_quantity := (v_item ->> 'quantity')::integer;

    if v_quantity < 1 or v_quantity > 99 then
      raise exception 'Invalid quantity';
    end if;

    select *
    into v_product
    from public.products
    where id = v_product_id and status = 'active'
    for update;

    if not found then
      raise exception 'Product is unavailable';
    end if;

    if v_product.stock < v_quantity then
      raise exception 'Insufficient inventory';
    end if;

    update public.products
    set stock = stock - v_quantity
    where id = v_product.id;

    insert into public.order_items (order_id, product_id, product_name, unit_price, quantity)
    values (v_order_id, v_product.id, v_product.name, v_product.price, v_quantity);

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  end loop;

  v_discount := least(v_discount, v_subtotal);
  v_total := greatest(0, v_subtotal - v_discount + v_delivery_fee + v_tax);

  update public.orders
  set
    subtotal = v_subtotal,
    discount_total = v_discount,
    delivery_fee = v_delivery_fee,
    tax_total = v_tax,
    total = v_total
  where id = v_order_id;

  return query
  select o.id, o.order_number, o.total
  from public.orders o
  where o.id = v_order_id;
end;
$$;

grant execute on function public.create_storefront_order(text, text, text, text, text, text, text, jsonb, jsonb) to service_role;
