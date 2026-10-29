-- Folio: schema, row-level security and the order function.
-- Run once in the Supabase SQL Editor (or `supabase db push`). Safe to re-run: every object is created if missing.

-- ───────────────────────────── Catalogue ─────────────────────────────
-- Text that exists in every site language is stored as {"az": "...", "en": "...", "ru": "..."}.

create table if not exists public.authors (
    id          text primary key,
    name        jsonb not null,
    born        integer not null,
    died        integer not null,
    approx      boolean not null default false,
    movement    jsonb not null,
    bio         jsonb not null,
    quote       jsonb,
    featured    integer,
    portrait    text,
    scene       text,
    position    integer not null default 0,
    created_at  timestamptz not null default now()
);

create table if not exists public.books (
    id           text primary key,
    author_id    text not null references public.authors(id) on update cascade,
    category     text not null check (category in ('philosophy', 'history', 'psychology', 'literature')),
    title        jsonb not null,
    description  jsonb not null,
    price        numeric(8, 2) not null check (price >= 0),
    old_price    numeric(8, 2) check (old_price is null or old_price > price),
    stock        integer not null default 0 check (stock >= 0),
    pages        integer not null check (pages > 0),
    year         integer not null,
    approx_year  boolean not null default false,
    ornament     text not null,
    tag          text check (tag in ('bestseller', 'new')),
    cover_image  text,
    position     integer not null default 0,
    created_at   timestamptz not null default now()
);

create index if not exists books_author_id_idx on public.books (author_id);
create index if not exists books_category_idx on public.books (category);

-- ───────────────────────────── People ─────────────────────────────

create table if not exists public.profiles (
    id          uuid primary key references auth.users(id) on delete cascade,
    full_name   text,
    phone       text,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create table if not exists public.addresses (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade,
    label       text not null default '',
    city        text not null,
    line        text not null,
    note        text not null default '',
    is_default  boolean not null default false,
    created_at  timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses (user_id);

create table if not exists public.favorites (
    user_id     uuid not null references auth.users(id) on delete cascade,
    book_id     text not null references public.books(id) on delete cascade,
    created_at  timestamptz not null default now(),
    primary key (user_id, book_id)
);

create table if not exists public.cart_items (
    user_id     uuid not null references auth.users(id) on delete cascade,
    book_id     text not null references public.books(id) on delete cascade,
    quantity    integer not null check (quantity > 0),
    updated_at  timestamptz not null default now(),
    primary key (user_id, book_id)
);

-- ───────────────────────────── Orders ─────────────────────────────

create sequence if not exists public.order_number_seq start 10001;

create table if not exists public.orders (
    id               uuid primary key default gen_random_uuid(),
    number           text not null unique,
    user_id          uuid references auth.users(id) on delete set null,
    status           text not null default 'new' check (status in ('new', 'processing', 'shipped', 'delivered', 'cancelled')),
    first_name       text not null,
    last_name        text not null,
    email            text not null,
    phone            text not null,
    delivery_method  text not null check (delivery_method in ('courier', 'pickup')),
    city             text,
    address          text,
    note             text not null default '',
    payment_method   text not null check (payment_method in ('cash', 'card')),
    subtotal         numeric(10, 2) not null,
    shipping         numeric(10, 2) not null,
    total            numeric(10, 2) not null,
    created_at       timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id, created_at desc);

create table if not exists public.order_items (
    order_id    uuid not null references public.orders(id) on delete cascade,
    book_id     text not null references public.books(id),
    title       jsonb not null,
    unit_price  numeric(8, 2) not null,
    quantity    integer not null check (quantity > 0),
    primary key (order_id, book_id)
);

-- ───────────────────────────── Row-level security ─────────────────────────────
-- The catalogue is public to read; everything personal is visible only to its owner.
-- Orders are never written directly: place_order() below does it after checking prices and stock.

alter table public.authors enable row level security;
alter table public.books enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.favorites enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "authors are public" on public.authors;
create policy "authors are public" on public.authors for select using (true);

drop policy if exists "books are public" on public.books;
create policy "books are public" on public.books for select using (true);

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own addresses" on public.addresses;
create policy "own addresses" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own favorites" on public.favorites;
create policy "own favorites" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own cart" on public.cart_items;
create policy "own cart" on public.cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own orders" on public.orders;
create policy "own orders" on public.orders for select using (auth.uid() = user_id);

drop policy if exists "own order items" on public.order_items;
create policy "own order items" on public.order_items for select
    using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- ───────────────────────────── New users get a profile ─────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    insert into public.profiles (id, full_name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
    for each row execute function public.handle_new_user();

-- ───────────────────────────── Placing an order ─────────────────────────────
-- The browser sends only book ids and quantities; prices, totals and stock come from the database, inside one
-- transaction with the book rows locked, so two buyers can never take the last copy twice.
-- Delivery is free from 40 manat, otherwise 4 manat (the same rule as the storefront).
-- Errors raise with a short code in the message (OUT_OF_STOCK:<book>, EMPTY_CART, UNKNOWN_BOOK:<book>, INVALID_INPUT)
-- that the client translates.

create or replace function public.place_order(
    items            jsonb,
    first_name       text,
    last_name        text,
    email            text,
    phone            text,
    delivery_method  text,
    city             text,
    address          text,
    note             text,
    payment_method   text
)
returns table (order_id uuid, order_number text, order_total numeric)
language plpgsql
security definer set search_path = ''
as $$
declare
    v_order_id uuid;
    v_number text;
    v_subtotal numeric(10, 2) := 0;
    v_shipping numeric(10, 2);
    v_item jsonb;
    v_book public.books%rowtype;
    v_quantity integer;
begin
    if items is null or jsonb_typeof(items) <> 'array' or jsonb_array_length(items) = 0 then
        raise exception 'EMPTY_CART';
    end if;
    if coalesce(trim(first_name), '') = '' or coalesce(trim(last_name), '') = '' or coalesce(trim(email), '') = ''
        or coalesce(trim(phone), '') = '' or delivery_method not in ('courier', 'pickup') or payment_method not in ('cash', 'card')
        or (delivery_method = 'courier' and (coalesce(trim(city), '') = '' or coalesce(trim(address), '') = '')) then
        raise exception 'INVALID_INPUT';
    end if;

    v_number := 'FL-' || to_char(now(), 'YYYY') || '-' || nextval('public.order_number_seq');

    insert into public.orders (number, user_id, first_name, last_name, email, phone, delivery_method, city, address, note,
                               payment_method, subtotal, shipping, total)
    values (v_number, auth.uid(), trim(first_name), trim(last_name), trim(email), trim(phone), delivery_method,
            nullif(trim(city), ''), nullif(trim(address), ''), coalesce(note, ''), payment_method, 0, 0, 0)
    returning id into v_order_id;

    for v_item in select * from jsonb_array_elements(items) loop
        v_quantity := (v_item ->> 'quantity')::integer;
        if v_quantity is null or v_quantity <= 0 then
            raise exception 'INVALID_INPUT';
        end if;

        select * into v_book from public.books where id = v_item ->> 'book_id' for update;
        if not found then
            raise exception 'UNKNOWN_BOOK:%', v_item ->> 'book_id';
        end if;
        if v_book.stock < v_quantity then
            raise exception 'OUT_OF_STOCK:%', v_book.id;
        end if;

        update public.books set stock = stock - v_quantity where id = v_book.id;
        insert into public.order_items (order_id, book_id, title, unit_price, quantity)
        values (v_order_id, v_book.id, v_book.title, v_book.price, v_quantity);
        v_subtotal := v_subtotal + v_book.price * v_quantity;
    end loop;

    v_shipping := case when v_subtotal >= 40 then 0 else 4 end;
    update public.orders set subtotal = v_subtotal, shipping = v_shipping, total = v_subtotal + v_shipping where id = v_order_id;

    -- A signed-in buyer's saved cart is emptied once the order is in.
    if auth.uid() is not null then
        delete from public.cart_items where user_id = auth.uid();
    end if;

    return query select v_order_id, v_number, v_subtotal + v_shipping;
end;
$$;

revoke all on function public.place_order(jsonb, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.place_order(jsonb, text, text, text, text, text, text, text, text, text) to anon, authenticated;
