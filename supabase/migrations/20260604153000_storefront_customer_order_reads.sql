grant select on public.customers, public.orders, public.order_items to authenticated;

create policy customers_read_own
on public.customers for select
to authenticated
using (
  public.is_admin()
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

create policy orders_read_own
on public.orders for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.customers
    where customers.id = orders.customer_id
      and lower(customers.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);

create policy order_items_read_own
on public.order_items for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders
    join public.customers on customers.id = orders.customer_id
    where orders.id = order_items.order_id
      and lower(customers.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);
