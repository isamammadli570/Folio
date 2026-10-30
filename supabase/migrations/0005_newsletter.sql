-- Folio: the footer's "quote of the week" newsletter. Anyone may subscribe; only admins can read or remove the list.
-- Safe to re-run.

create table if not exists public.newsletter_subscribers (
    id          uuid primary key default gen_random_uuid(),
    email       text not null check (length(email) <= 254 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
    language    text not null default 'az' check (language in ('az', 'en', 'ru')),
    created_at  timestamptz not null default now()
);

-- One row per address, whatever its capitals.
create unique index if not exists newsletter_subscribers_email_idx on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "anyone subscribes" on public.newsletter_subscribers;
create policy "anyone subscribes" on public.newsletter_subscribers for insert to anon, authenticated with check (true);

drop policy if exists "admins read subscribers" on public.newsletter_subscribers;
create policy "admins read subscribers" on public.newsletter_subscribers for select using (public.is_admin());

drop policy if exists "admins remove subscribers" on public.newsletter_subscribers;
create policy "admins remove subscribers" on public.newsletter_subscribers for delete using (public.is_admin());
