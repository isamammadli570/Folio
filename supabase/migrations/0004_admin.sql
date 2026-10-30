-- Folio: the admin panel. A role on profiles, write access to the catalogue and orders for admins only, and a public
-- `media` bucket for covers, busts and scenes. Safe to re-run.

-- ───────────────────────────── Roles ─────────────────────────────

alter table public.profiles add column if not exists role text not null default 'customer';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('customer', 'admin'));

-- Readers may edit their name and phone, never their role: column privileges leave `role` to the SQL Editor only.
revoke insert, update on public.profiles from anon, authenticated;
grant insert (id, full_name, phone, updated_at) on public.profiles to authenticated;
grant update (full_name, phone, updated_at) on public.profiles to authenticated;

-- True when the signed-in user is an admin. Security definer, so policies can call it without recursing into RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
    select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ───────────────────────────── Admin policies ─────────────────────────────

drop policy if exists "admins write authors" on public.authors;
create policy "admins write authors" on public.authors for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins write books" on public.books;
create policy "admins write books" on public.books for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins read profiles" on public.profiles;
create policy "admins read profiles" on public.profiles for select using (public.is_admin());

drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders" on public.orders for select using (public.is_admin());

-- Admins move an order through its statuses; nothing else on an order can change after it is placed.
drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());
revoke update on public.orders from anon, authenticated;
grant update (status) on public.orders to authenticated;

drop policy if exists "admins read order items" on public.order_items;
create policy "admins read order items" on public.order_items for select using (public.is_admin());

-- ───────────────────────────── Media storage ─────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 3145728, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media is public" on storage.objects;
create policy "media is public" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins change media" on storage.objects;
create policy "admins change media" on storage.objects for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

-- ───────────────────────────── Making yourself an admin ─────────────────────────────
-- Run once, with the email you registered on the site:
--   update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
