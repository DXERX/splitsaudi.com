-- Split Store — Drop 02 schema for split.sa
-- Run in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Drops / collections
create table if not exists drops (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  season text not null,
  concept text,
  launch_date date,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  drop_id uuid references drops(id) on delete cascade,
  slug text unique not null,
  name text not null,
  category text not null,
  description text,
  fit_type text,
  fabric text,
  wash_treatment text,
  special_details text[],
  price_sar numeric(10,2) not null,
  cost_sar numeric(10,2),
  hero_color text not null default '#0A0A0A',
  accent_color text,
  sort_order int default 0,
  is_featured boolean default false,
  status text default 'production',
  created_at timestamptz default now()
);

-- Variants (color + size)
create table if not exists product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  color_name text not null,
  color_hex text,
  size text not null default 'OS',
  sku text unique not null,
  stock int not null default 0,
  image_url text,
  created_at timestamptz default now()
);

-- Orders (basic checkout)
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  phone text,
  full_name text not null,
  city text,
  address text,
  total_sar numeric(10,2) not null,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  variant_id uuid references product_variants(id),
  product_name text not null,
  color_name text not null,
  size text not null,
  quantity int not null,
  unit_price_sar numeric(10,2) not null
);

-- RLS
alter table drops enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public read drops" on drops for select using (true);
create policy "Public read products" on products for select using (true);
create policy "Public read variants" on product_variants for select using (true);
create policy "Public insert orders" on orders for insert with check (true);
create policy "Public insert order items" on order_items for insert with check (true);

-- Seed Drop 02
insert into drops (slug, name, season, concept, launch_date)
values (
  'drop-02',
  'Split Is Art.',
  'Winter',
  'It''s about control. Knowing when to shift, when to stay, and how to balance both sides.',
  '2026-10-27'
) on conflict (slug) do nothing;

-- Products
with d as (select id from drops where slug = 'drop-02')
insert into products (drop_id, slug, name, category, description, fit_type, fabric, wash_treatment, special_details, price_sar, cost_sar, hero_color, accent_color, sort_order, is_featured)
select d.id, v.*
from d, (values
  ('split-loop', 'Split Loop', 'Hoodie', 'French terry boxy hoodie. Double layered one-piece hood with screen print and silicone patch.', 'Boxy', '300gsm French Terry', '10% stone wash', array['Double layered hood','Screen print','Silicone patch'], 219.00, 119.61, '#E31B23', '#F5E642', 1, true),
  ('sia-double', 'SIA Double', 'Zip Up Hoodie', 'Reversible zip hoodie. 600gsm total. Distressed embroidery, DTG camo print, silicone patch.', 'Boxy', '300gsm French Terry (reversible)', '30% stone wash', array['Reversible','Distressed embroidery','DTG camo print','Silicone patch'], 299.00, 194.44, '#0A0A0A', '#3D4F2F', 2, true),
  ('sia-pants', 'SIA Pants', 'Sweat Pants', 'Wide leg sweat pants with DTG camo pockets and long drawstrings.', 'Wide Leg', '300gsm French Terry', '30% stone wash', array['DTG camo pockets','Long drawstrings','Distressed embroidery'], 219.00, 134.54, '#0A0A0A', '#3D4F2F', 3, false),
  ('sia-waffle', 'SIA Waffle', 'Long Sleeve T-Shirt', 'Open waffle knit with DTG sleeve print, screen print, and appliqué patch.', 'Drop Shoulders', '220gsm Open Waffle Knit', 'Enzyme wash', array['DTG sleeve print','Screen print','Appliqué patch'], 179.00, 96.86, '#0A0A0A', '#3D4F2F', 4, false),
  ('76-waffle', '76 Waffle', 'Long Sleeve T-Shirt', 'Open waffle knit long sleeve. White and yellow camo colorway.', 'Drop Shoulders', '220gsm Open Waffle Knit', 'Enzyme wash', array['DTG sleeve print','Screen print','Appliqué patch'], 179.00, 96.86, '#F5E642', '#FFFFFF', 5, true),
  ('patch-shorts', 'Patch Shorts', 'Shorts', 'Baggy French terry shorts with silicone patch.', 'Baggy', '300gsm French Terry', '10% stone wash', array['Silicone patch'], 169.00, 97.24, '#B8B8B8', '#0A0A0A', 6, false)
) as v(slug, name, category, description, fit_type, fabric, wash_treatment, special_details, price_sar, cost_sar, hero_color, accent_color, sort_order, is_featured)
on conflict (slug) do nothing;

-- Variants (30 per product, one size OS for now)
insert into product_variants (product_id, color_name, color_hex, size, sku, stock)
select p.id, v.color_name, v.color_hex, 'OS', v.sku, 30
from products p
join (values
  ('split-loop', 'Red', '#E31B23', 'SPL-LOOP-RED-OS'),
  ('sia-double', 'Black', '#0A0A0A', 'SIA-DBL-BLK-OS'),
  ('sia-double', 'Green Camo', '#3D4F2F', 'SIA-DBL-CAM-OS'),
  ('sia-pants', 'Black', '#0A0A0A', 'SIA-PNT-BLK-OS'),
  ('sia-waffle', 'Black', '#0A0A0A', 'SIA-WAF-BLK-OS'),
  ('sia-waffle', 'Green Camo', '#3D4F2F', 'SIA-WAF-CAM-OS'),
  ('76-waffle', 'White', '#FFFFFF', '76-WAF-WHT-OS'),
  ('76-waffle', 'Yellow Camo', '#F5E642', '76-WAF-YCM-OS'),
  ('patch-shorts', 'Light Grey Marl', '#B8B8B8', 'PCH-SHT-GRY-OS')
) as v(slug, color_name, color_hex, sku) on p.slug = v.slug
on conflict (sku) do nothing;
