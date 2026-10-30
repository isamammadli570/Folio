-- Folio: reviews, cancelling an order, "tell me when it is back", promo codes, the admin's customer list and live
-- orders. Run after 0001–0005. Safe to re-run.

-- ───────────────────────────── Reviews ─────────────────────────────
-- Only a reader who ordered the book (an order that was not cancelled) may review it, once. The reviewer's first name
-- is copied onto the review, so reviews can be public while profiles stay private.

create table if not exists public.reviews (
    id           uuid primary key default gen_random_uuid(),
    book_id      text not null references public.books(id) on delete cascade,
    user_id      uuid not null references auth.users(id) on delete cascade,
    author_name  text not null default '',
    rating       integer not null check (rating between 1 and 5),
    body         text not null default '' check (length(body) <= 2000),
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now(),
    unique (book_id, user_id)
);

create index if not exists reviews_book_id_idx on public.reviews (book_id, created_at desc);

create or replace function public.has_bought(p_book_id text)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
    select exists (
        select 1 from public.order_items i join public.orders o on o.id = i.order_id
        where i.book_id = p_book_id and o.user_id = auth.uid() and o.status <> 'cancelled'
    );
$$;

grant execute on function public.has_bought(text) to authenticated;

create or replace function public.stamp_review()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
    new.user_id := auth.uid();
    new.author_name := coalesce(nullif(split_part(trim((select full_name from public.profiles where id = auth.uid())), ' ', 1), ''), '');
    new.updated_at := now();
    return new;
end;
$$;

drop trigger if exists stamp_review on public.reviews;
create trigger stamp_review before insert or update on public.reviews for each row execute function public.stamp_review();

alter table public.reviews enable row level security;

drop policy if exists "reviews are public" on public.reviews;
create policy "reviews are public" on public.reviews for select using (true);

drop policy if exists "buyers write a review" on public.reviews;
create policy "buyers write a review" on public.reviews for insert to authenticated with check (public.has_bought(book_id));

drop policy if exists "own review changes" on public.reviews;
create policy "own review changes" on public.reviews for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own or admin review removal" on public.reviews;
create policy "own or admin review removal" on public.reviews for delete using (auth.uid() = user_id or public.is_admin());

-- ───────────────────────────── Cancelling an order ─────────────────────────────
-- The buyer may cancel while the order is still "new"; the copies go back on the shelf.

create or replace function public.cancel_order(p_order_id uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare
    v_order public.orders%rowtype;
begin
    select * into v_order from public.orders where id = p_order_id for update;
    if not found or v_order.user_id is distinct from auth.uid() then
        raise exception 'NOT_FOUND';
    end if;
    if v_order.status <> 'new' then
        raise exception 'TOO_LATE';
    end if;
    update public.books b set stock = b.stock + i.quantity from public.order_items i where i.order_id = p_order_id and b.id = i.book_id;
    update public.orders set status = 'cancelled' where id = p_order_id;
end;
$$;

revoke all on function public.cancel_order(uuid) from public;
grant execute on function public.cancel_order(uuid) to authenticated;

-- ───────────────────────────── Back-in-stock alerts ─────────────────────────────

create table if not exists public.stock_alerts (
    id          uuid primary key default gen_random_uuid(),
    book_id     text not null references public.books(id) on delete cascade,
    email       text not null check (length(email) <= 254 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
    language    text not null default 'az' check (language in ('az', 'en', 'ru')),
    created_at  timestamptz not null default now()
);

create unique index if not exists stock_alerts_book_email_idx on public.stock_alerts (book_id, lower(email));

alter table public.stock_alerts enable row level security;

drop policy if exists "anyone asks for an alert" on public.stock_alerts;
create policy "anyone asks for an alert" on public.stock_alerts for insert to anon, authenticated with check (true);

drop policy if exists "admins read alerts" on public.stock_alerts;
create policy "admins read alerts" on public.stock_alerts for select using (public.is_admin());

drop policy if exists "admins remove alerts" on public.stock_alerts;
create policy "admins remove alerts" on public.stock_alerts for delete using (public.is_admin());

-- ───────────────────────────── Promo codes ─────────────────────────────
-- Codes are stored upper-case. Shoppers never read the table; they ask check_promo() for one code's percentage.

create table if not exists public.promo_codes (
    code         text primary key check (code = upper(code) and code ~ '^[A-Z0-9-]{3,24}$'),
    percent      integer not null check (percent between 1 and 90),
    active       boolean not null default true,
    expires_at   timestamptz,
    usage_limit  integer check (usage_limit is null or usage_limit > 0),
    used_count   integer not null default 0,
    created_at   timestamptz not null default now()
);

alter table public.promo_codes enable row level security;

drop policy if exists "admins manage promo codes" on public.promo_codes;
create policy "admins manage promo codes" on public.promo_codes for all using (public.is_admin()) with check (public.is_admin());

-- The discount a code gives right now, or 0 when it is unknown, switched off, expired or used up.
create or replace function public.check_promo(p_code text)
returns integer
language sql
stable
security definer set search_path = ''
as $$
    select coalesce((
        select percent from public.promo_codes
        where code = upper(trim(p_code)) and active
          and (expires_at is null or expires_at > now())
          and (usage_limit is null or used_count < usage_limit)
    ), 0);
$$;

grant execute on function public.check_promo(text) to anon, authenticated;

alter table public.orders add column if not exists promo_code text;
alter table public.orders add column if not exists discount numeric(10, 2) not null default 0;

-- place_order() learns the promo code: the discount comes off the books (not the delivery) and the code is counted.
drop function if exists public.place_order(jsonb, text, text, text, text, text, text, text, text, text);

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
    payment_method   text,
    promo_code       text default null
)
returns table (order_id uuid, order_number text, order_total numeric)
language plpgsql
security definer set search_path = ''
as $$
declare
    v_order_id uuid;
    v_number text;
    v_subtotal numeric(10, 2) := 0;
    v_discount numeric(10, 2) := 0;
    v_shipping numeric(10, 2);
    v_item jsonb;
    v_book public.books%rowtype;
    v_quantity integer;
    v_code text := nullif(upper(trim(coalesce(promo_code, ''))), '');
    v_percent integer := 0;
begin
    if items is null or jsonb_typeof(items) <> 'array' or jsonb_array_length(items) = 0 then
        raise exception 'EMPTY_CART';
    end if;
    if coalesce(trim(first_name), '') = '' or coalesce(trim(last_name), '') = '' or coalesce(trim(email), '') = ''
        or coalesce(trim(phone), '') = '' or delivery_method not in ('courier', 'pickup') or payment_method not in ('cash', 'card')
        or (delivery_method = 'courier' and (coalesce(trim(city), '') = '' or coalesce(trim(address), '') = '')) then
        raise exception 'INVALID_INPUT';
    end if;
    if v_code is not null then
        select percent into v_percent from public.promo_codes
        where code = v_code and active and (expires_at is null or expires_at > now()) and (usage_limit is null or used_count < usage_limit)
        for update;
        if not found then
            raise exception 'INVALID_PROMO';
        end if;
    end if;

    v_number := 'FL-' || to_char(now(), 'YYYY') || '-' || nextval('public.order_number_seq');

    insert into public.orders (number, user_id, first_name, last_name, email, phone, delivery_method, city, address, note,
                               payment_method, subtotal, shipping, total, promo_code)
    values (v_number, auth.uid(), trim(first_name), trim(last_name), trim(email), trim(phone), delivery_method,
            nullif(trim(city), ''), nullif(trim(address), ''), coalesce(note, ''), payment_method, 0, 0, 0, v_code)
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

    v_discount := round(v_subtotal * v_percent / 100.0, 2);
    -- Free delivery is decided on the books' price before the discount, as the storefront shows it.
    v_shipping := case when v_subtotal >= 40 then 0 else 4 end;
    update public.orders set subtotal = v_subtotal, discount = v_discount, shipping = v_shipping, total = v_subtotal - v_discount + v_shipping
    where id = v_order_id;
    if v_code is not null then
        update public.promo_codes set used_count = used_count + 1 where code = v_code;
    end if;

    if auth.uid() is not null then
        delete from public.cart_items where user_id = auth.uid();
    end if;

    return query select v_order_id, v_number, v_subtotal - v_discount + v_shipping;
end;
$$;

revoke all on function public.place_order(jsonb, text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.place_order(jsonb, text, text, text, text, text, text, text, text, text, text) to anon, authenticated;

-- ───────────────────────────── Customers (admin) ─────────────────────────────

create or replace function public.admin_customers()
returns table (id uuid, full_name text, email text, phone text, joined_at timestamptz, orders bigint, spent numeric, last_order_at timestamptz)
language plpgsql
stable
security definer set search_path = ''
as $$
begin
    if not public.is_admin() then
        raise exception 'FORBIDDEN';
    end if;
    return query
        select p.id, coalesce(p.full_name, ''), u.email::text, coalesce(p.phone, ''), u.created_at,
               count(o.id) filter (where o.status <> 'cancelled'),
               coalesce(sum(o.total) filter (where o.status <> 'cancelled'), 0),
               max(o.created_at)
        from public.profiles p
        join auth.users u on u.id = p.id
        left join public.orders o on o.user_id = p.id
        group by p.id, p.full_name, u.email, p.phone, u.created_at
        order by max(o.created_at) desc nulls last, u.created_at desc;
end;
$$;

revoke all on function public.admin_customers() from public;
grant execute on function public.admin_customers() to authenticated;

-- ───────────────────────────── Live orders ─────────────────────────────
-- New orders reach the admin panel without a reload. RLS still applies: only admins receive other people's orders.

do $$
begin
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders') then
        alter publication supabase_realtime add table public.orders;
    end if;
end $$;
