alter table public.orders
  add column if not exists shipping_partner text,
  add column if not exists tracking_id text;

insert into public.store_settings (key, value)
select
  'shipping',
  '{
    "pickupEnabled": true,
    "deliveryEnabled": true,
    "freeShippingThreshold": 75,
    "localDeliveryFee": 0,
    "domesticShippingFee": 8,
    "expressShippingFee": 18,
    "promise": "Usually ready in 2 hrs",
    "carriers": [
      {
        "id": "ghn",
        "name": "GHN",
        "service": "Giao hàng nhanh",
        "type": "domestic",
        "enabled": true,
        "cod": true,
        "trackingUrl": "https://donhang.ghn.vn/?order_code={trackingId}",
        "notes": "Phù hợp giao nội thành và liên tỉnh."
      },
      {
        "id": "ghtk",
        "name": "GHTK",
        "service": "Giao hàng tiết kiệm",
        "type": "domestic",
        "enabled": true,
        "cod": true,
        "trackingUrl": "https://i.ghtk.vn/{trackingId}",
        "notes": "Tối ưu chi phí cho đơn tiêu chuẩn."
      },
      {
        "id": "viettel-post",
        "name": "Viettel Post",
        "service": "Chuyển phát tiêu chuẩn",
        "type": "domestic",
        "enabled": true,
        "cod": true,
        "trackingUrl": "https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/?orderNumber={trackingId}",
        "notes": "Phủ rộng toàn quốc."
      }
    ]
  }'::jsonb
where not exists (
  select 1 from public.store_settings where key = 'shipping'
);

update public.store_settings
set value = value || jsonb_build_object(
  'carriers',
  '[
    {
      "id": "ghn",
      "name": "GHN",
      "service": "Giao hàng nhanh",
      "type": "domestic",
      "enabled": true,
      "cod": true,
      "trackingUrl": "https://donhang.ghn.vn/?order_code={trackingId}",
      "notes": "Phù hợp giao nội thành và liên tỉnh."
    },
    {
      "id": "ghtk",
      "name": "GHTK",
      "service": "Giao hàng tiết kiệm",
      "type": "domestic",
      "enabled": true,
      "cod": true,
      "trackingUrl": "https://i.ghtk.vn/{trackingId}",
      "notes": "Tối ưu chi phí cho đơn tiêu chuẩn."
    },
    {
      "id": "viettel-post",
      "name": "Viettel Post",
      "service": "Chuyển phát tiêu chuẩn",
      "type": "domestic",
      "enabled": true,
      "cod": true,
      "trackingUrl": "https://viettelpost.com.vn/tra-cuu-hanh-trinh-don/?orderNumber={trackingId}",
      "notes": "Phủ rộng toàn quốc."
    }
  ]'::jsonb
)
where key = 'shipping'
  and not (value ? 'carriers');
