-- Add 'in_transit' and ensure 'returned'/'failed_delivery' are in the delivery_status constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_delivery_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_delivery_status_check
  CHECK (delivery_status IN (
    'unfulfilled', 'packing', 'ready', 'in_transit',
    'delivered', 'cancelled', 'returned', 'failed_delivery'
  ));
