-- GoodLuck e-commerce initial schema
create extension if not exists "pgcrypto";

create type public.gender_type as enum ('hombre', 'mujer', 'unisex');
create type public.product_type as enum ('camiseta-algodon', 'oversized', 'crop-top', 'tela-fria');
create type public.order_status as enum (
  'draft', 'pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
);
create type public.payment_provider as enum ('stripe', 'wompi', 'mercadopago', 'cod', 'transfer');
create type public.payment_status as enum ('pending', 'processing', 'succeeded', 'failed', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  hero_image text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  collection_id uuid references public.collections (id) on delete set null,
  type public.product_type not null,
  gender public.gender_type not null default 'unisex',
  base_price_cop integer not null check (base_price_cop >= 0),
  is_customizable boolean not null default true,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text not null unique,
  color text not null,
  color_hex text not null default '#888888',
  size text not null,
  price_cop integer not null check (price_cop >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  unique (product_id, color, size)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text not null default '',
  view text not null default 'front' check (view in ('front', 'back')),
  color text,
  sort_order int not null default 0
);

create table public.custom_designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  guest_email text,
  product_id uuid references public.products (id) on delete set null,
  product_slug text not null,
  color text not null,
  size text not null,
  canvas_json jsonb not null,
  preview_url text,
  created_at timestamptz not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete cascade,
  guest_token text unique,
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  custom_design_id uuid references public.custom_designs (id) on delete set null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_cop integer not null,
  customization_fee_cop integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  status public.order_status not null default 'draft',
  payment_provider public.payment_provider,
  subtotal_cop integer not null default 0,
  shipping_cop integer not null default 0,
  total_cop integer not null default 0,
  shipping_full_name text,
  shipping_email text,
  shipping_phone text,
  shipping_address text,
  shipping_city text,
  shipping_department text,
  shipping_postal_code text,
  shipping_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid,
  variant_id uuid,
  custom_design_id uuid references public.custom_designs (id) on delete set null,
  product_name text not null,
  color text not null,
  size text not null,
  quantity integer not null,
  unit_price_cop integer not null,
  customization_fee_cop integer not null default 0,
  image_url text,
  preview_url text
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider public.payment_provider not null,
  external_id text,
  status public.payment_status not null default 'pending',
  amount_cop integer not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_collection_id_idx on public.products (collection_id);
create index products_type_idx on public.products (type);
create index products_gender_idx on public.products (gender);
create index products_base_price_idx on public.products (base_price_cop);
create index product_variants_product_id_idx on public.product_variants (product_id);
create index orders_user_id_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);
create index payments_order_id_idx on public.payments (order_id);
create index custom_designs_user_id_idx on public.custom_designs (user_id);

alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.custom_designs enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create policy "Public read collections" on public.collections for select using (true);
create policy "Public read products" on public.products for select using (active = true);
create policy "Public read variants" on public.product_variants for select using (true);
create policy "Public read product images" on public.product_images for select using (true);

create policy "Users read own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users manage own designs" on public.custom_designs
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

create policy "Users read own carts" on public.carts for select using (auth.uid() = user_id or public.is_admin());
create policy "Users manage own carts" on public.carts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own cart items" on public.cart_items
  for all using (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
    or public.is_admin()
  )
  with check (
    exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())
  );

create policy "Users read own orders" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "Users insert own orders" on public.orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "Admin update orders" on public.orders for update using (public.is_admin());

create policy "Users read own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);

create policy "Users read own payments" on public.payments for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);

create policy "Admin manage catalog" on public.collections for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage variants" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values
  ('product-images', 'product-images', true),
  ('custom-designs', 'custom-designs', false),
  ('design-previews', 'design-previews', true)
on conflict (id) do nothing;

create policy "Public read product images bucket"
  on storage.objects for select
  using (bucket_id = 'product-images' or bucket_id = 'design-previews');

create policy "Auth upload custom designs"
  on storage.objects for insert
  with check (
    bucket_id in ('custom-designs', 'design-previews')
    and auth.role() = 'authenticated'
  );

create policy "Users read own custom designs bucket"
  on storage.objects for select
  using (
    bucket_id = 'custom-designs'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
