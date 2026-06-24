-- Split Store v2: sizes S–XL, newsletter, order numbers, admin RPC
-- Run after 001_store_schema.sql in Supabase SQL Editor

-- Newsletter
create table if not exists newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  source text default 'website',
  created_at timestamptz default now()
);

alter table newsletter_subscribers enable row level security;

drop policy if exists "Public insert newsletter" on newsletter_subscribers;
create policy "Public insert newsletter" on newsletter_subscribers
  for insert with check (true);

-- Admin secret (change value in Supabase Table Editor after deploy)
create table if not exists site_secrets (
  key text primary key,
  value text not null
);

insert into site_secrets (key, value)
values ('admin_key', 'split-admin-change-me')
on conflict (key) do nothing;

-- Order reference number
alter table orders add column if not exists order_number text unique;

create sequence if not exists order_number_seq start 1001;

-- Public catalog view — hides stock counts
create or replace view product_variants_public as
select
  id,
  product_id,
  color_name,
  color_hex,
  size,
  sku,
  image_url,
  (stock > 0) as in_stock
from product_variants;

grant select on product_variants_public to anon, authenticated;

-- Replace OS-only variants with S/M/L/XL (30 stock each, not exposed to clients)
delete from product_variants where size = 'OS';

insert into product_variants (product_id, color_name, color_hex, size, sku, stock)
select p.id, v.color_name, v.color_hex, v.size, v.sku, 30
from products p
cross join lateral (
  values
    ('split-loop', 'Red', '#E31B23', 'S', 'SPL-LOOP-RED-S'),
    ('split-loop', 'Red', '#E31B23', 'M', 'SPL-LOOP-RED-M'),
    ('split-loop', 'Red', '#E31B23', 'L', 'SPL-LOOP-RED-L'),
    ('split-loop', 'Red', '#E31B23', 'XL', 'SPL-LOOP-RED-XL'),
    ('sia-double', 'Black', '#0A0A0A', 'S', 'SIA-DBL-BLK-S'),
    ('sia-double', 'Black', '#0A0A0A', 'M', 'SIA-DBL-BLK-M'),
    ('sia-double', 'Black', '#0A0A0A', 'L', 'SIA-DBL-BLK-L'),
    ('sia-double', 'Black', '#0A0A0A', 'XL', 'SIA-DBL-BLK-XL'),
    ('sia-double', 'Green Camo', '#3D4F2F', 'S', 'SIA-DBL-CAM-S'),
    ('sia-double', 'Green Camo', '#3D4F2F', 'M', 'SIA-DBL-CAM-M'),
    ('sia-double', 'Green Camo', '#3D4F2F', 'L', 'SIA-DBL-CAM-L'),
    ('sia-double', 'Green Camo', '#3D4F2F', 'XL', 'SIA-DBL-CAM-XL'),
    ('sia-pants', 'Black', '#0A0A0A', 'S', 'SIA-PNT-BLK-S'),
    ('sia-pants', 'Black', '#0A0A0A', 'M', 'SIA-PNT-BLK-M'),
    ('sia-pants', 'Black', '#0A0A0A', 'L', 'SIA-PNT-BLK-L'),
    ('sia-pants', 'Black', '#0A0A0A', 'XL', 'SIA-PNT-BLK-XL'),
    ('sia-waffle', 'Black', '#0A0A0A', 'S', 'SIA-WAF-BLK-S'),
    ('sia-waffle', 'Black', '#0A0A0A', 'M', 'SIA-WAF-BLK-M'),
    ('sia-waffle', 'Black', '#0A0A0A', 'L', 'SIA-WAF-BLK-L'),
    ('sia-waffle', 'Black', '#0A0A0A', 'XL', 'SIA-WAF-BLK-XL'),
    ('sia-waffle', 'Green Camo', '#3D4F2F', 'S', 'SIA-WAF-CAM-S'),
    ('sia-waffle', 'Green Camo', '#3D4F2F', 'M', 'SIA-WAF-CAM-M'),
    ('sia-waffle', 'Green Camo', '#3D4F2F', 'L', 'SIA-WAF-CAM-L'),
    ('sia-waffle', 'Green Camo', '#3D4F2F', 'XL', 'SIA-WAF-CAM-XL'),
    ('76-waffle', 'White', '#FFFFFF', 'S', '76-WAF-WHT-S'),
    ('76-waffle', 'White', '#FFFFFF', 'M', '76-WAF-WHT-M'),
    ('76-waffle', 'White', '#FFFFFF', 'L', '76-WAF-WHT-L'),
    ('76-waffle', 'White', '#FFFFFF', 'XL', '76-WAF-WHT-XL'),
    ('76-waffle', 'Yellow Camo', '#F5E642', 'S', '76-WAF-YCM-S'),
    ('76-waffle', 'Yellow Camo', '#F5E642', 'M', '76-WAF-YCM-M'),
    ('76-waffle', 'Yellow Camo', '#F5E642', 'L', '76-WAF-YCM-L'),
    ('76-waffle', 'Yellow Camo', '#F5E642', 'XL', '76-WAF-YCM-XL'),
    ('patch-shorts', 'Light Grey Marl', '#B8B8B8', 'S', 'PCH-SHT-GRY-S'),
    ('patch-shorts', 'Light Grey Marl', '#B8B8B8', 'M', 'PCH-SHT-GRY-M'),
    ('patch-shorts', 'Light Grey Marl', '#B8B8B8', 'L', 'PCH-SHT-GRY-L'),
    ('patch-shorts', 'Light Grey Marl', '#B8B8B8', 'XL', 'PCH-SHT-GRY-XL')
) as v(slug, color_name, color_hex, size, sku)
where p.slug = v.slug
on conflict (sku) do update set stock = 30;

-- Newsletter signup (idempotent)
create or replace function subscribe_newsletter(p_email text, p_source text default 'website')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized text := lower(trim(p_email));
begin
  if normalized !~ '^[^@]+@[^@]+\.[^@]+$' then
    raise exception 'Invalid email';
  end if;
  insert into newsletter_subscribers (email, source)
  values (normalized, coalesce(p_source, 'website'))
  on conflict (email) do nothing;
  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function subscribe_newsletter(text, text) to anon, authenticated;

-- Place order with stock check (stock never returned to client)
create or replace function place_order(
  p_email text,
  p_full_name text,
  p_phone text,
  p_city text,
  p_address text,
  p_total_sar numeric,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  item jsonb;
  v_variant_id uuid;
  v_qty int;
  v_stock int;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  for item in select * from jsonb_array_elements(p_items)
  loop
    v_variant_id := (item->>'variant_id')::uuid;
    v_qty := (item->>'quantity')::int;
    select stock into v_stock from product_variants where id = v_variant_id for update;
    if v_stock is null then
      raise exception 'Variant not found';
    end if;
    if v_stock < v_qty then
      raise exception 'One or more items are no longer available in that size';
    end if;
  end loop;

  v_order_number := 'SPL-' || lpad(nextval('order_number_seq')::text, 5, '0');

  insert into orders (email, full_name, phone, city, address, total_sar, order_number, status)
  values (lower(trim(p_email)), trim(p_full_name), nullif(trim(p_phone), ''), nullif(trim(p_city), ''), nullif(trim(p_address), ''), p_total_sar, v_order_number, 'pending')
  returning id into v_order_id;

  for item in select * from jsonb_array_elements(p_items)
  loop
    v_variant_id := (item->>'variant_id')::uuid;
    v_qty := (item->>'quantity')::int;
    update product_variants set stock = stock - v_qty where id = v_variant_id;
    insert into order_items (order_id, variant_id, product_name, color_name, size, quantity, unit_price_sar)
    values (
      v_order_id,
      v_variant_id,
      item->>'product_name',
      item->>'color_name',
      item->>'size',
      v_qty,
      (item->>'unit_price_sar')::numeric
    );
  end loop;

  return jsonb_build_object('id', v_order_id, 'order_number', v_order_number);
end;
$$;

grant execute on function place_order(text, text, text, text, text, numeric, jsonb) to anon, authenticated;

-- Admin: list orders
create or replace function admin_list_orders(p_secret text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  expected text;
begin
  select value into expected from site_secrets where key = 'admin_key';
  if p_secret is distinct from expected then
    raise exception 'Unauthorized';
  end if;
  return (
    select coalesce(jsonb_agg(row_to_json(t) order by t.created_at desc), '[]'::jsonb)
    from (
      select
        o.id,
        o.order_number,
        o.email,
        o.phone,
        o.full_name,
        o.city,
        o.address,
        o.total_sar,
        o.status,
        o.created_at,
        (
          select jsonb_agg(jsonb_build_object(
            'product_name', oi.product_name,
            'color_name', oi.color_name,
            'size', oi.size,
            'quantity', oi.quantity,
            'unit_price_sar', oi.unit_price_sar
          ))
          from order_items oi where oi.order_id = o.id
        ) as items
      from orders o
      order by o.created_at desc
      limit 200
    ) t
  );
end;
$$;

grant execute on function admin_list_orders(text) to anon, authenticated;

-- Admin: update order status
create or replace function admin_update_order_status(p_secret text, p_order_id uuid, p_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  expected text;
begin
  select value into expected from site_secrets where key = 'admin_key';
  if p_secret is distinct from expected then
    raise exception 'Unauthorized';
  end if;
  if p_status not in ('pending', 'confirmed', 'shipped', 'cancelled') then
    raise exception 'Invalid status';
  end if;
  update orders set status = p_status where id = p_order_id;
  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function admin_update_order_status(text, uuid, text) to anon, authenticated;
