create or replace function public.update_storefront_order_action(
  p_order_id uuid,
  p_action text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_payment_status text;
  v_delivery_status text;
begin
  if v_email = '' then
    raise exception 'Authentication is required.';
  end if;

  select o.payment_status, o.delivery_status
  into v_payment_status, v_delivery_status
  from public.orders o
  join public.customers c on c.id = o.customer_id
  where o.id = p_order_id
    and lower(c.email) = v_email
  for update of o;

  if not found then
    raise exception 'Order not found.';
  end if;

  if p_action = 'pay' then
    if v_delivery_status in ('cancelled', 'delivered') then
      raise exception 'This order can no longer be paid.';
    end if;

    if v_payment_status = 'pending' then
      update public.orders
      set payment_status = 'paid'
      where id = p_order_id;
    end if;
  elsif p_action = 'cancel' then
    if v_delivery_status in ('cancelled', 'delivered') then
      raise exception 'This order can no longer be cancelled.';
    end if;

    update public.orders
    set delivery_status = 'cancelled'
    where id = p_order_id;
  else
    raise exception 'Unsupported order action.';
  end if;
end;
$$;

revoke all on function public.update_storefront_order_action(uuid, text) from public;
grant execute on function public.update_storefront_order_action(uuid, text) to authenticated;
