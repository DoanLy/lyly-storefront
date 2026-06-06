-- Fix: order history was empty everywhere (admin + customer).
--
-- Root cause: order_events had NO INSERT policy for the `authenticated`
-- role, only `service_role` (ALL) and `authenticated` (SELECT). Both the
-- admin dashboard and the storefront call logOrderEvents() through the
-- authenticated supabase client, so every insert was blocked by RLS and
-- swallowed by logOrderEvents()'s console.warn. No events were ever
-- persisted -- the only history line shown was a hard-coded UI string.
--
-- Secondary bug: the SELECT policy matched only the customer's own email
-- and had no is_admin() branch, so even if events existed the admin
-- dashboard could not read them.
--
-- This migration grants the table privileges explicitly and replaces the
-- policy set so that admins, and customers acting on their own orders,
-- can both read and write events.

grant select, insert on public.order_events to authenticated;

drop policy if exists "customers_read_own_order_events" on public.order_events;
drop policy if exists "read_order_events_admin_or_owner" on public.order_events;
drop policy if exists "insert_order_events_admin_or_owner" on public.order_events;

create policy "read_order_events_admin_or_owner"
  on public.order_events for select to authenticated
  using (
    public.is_admin()
    or order_id in (
      select o.id
      from public.orders o
      join public.customers c on c.id = o.customer_id
      where lower(c.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy "insert_order_events_admin_or_owner"
  on public.order_events for insert to authenticated
  with check (
    public.is_admin()
    or order_id in (
      select o.id
      from public.orders o
      join public.customers c on c.id = o.customer_id
      where lower(c.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );
