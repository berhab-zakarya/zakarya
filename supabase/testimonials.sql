-- Run this once in the Supabase SQL editor.
-- Public visitors can insert testimonials, but only published rows are readable.
-- Approve a row with:
--   update public.testimonials set published = true where id = '<uuid>';

create extension if not exists pgcrypto;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  role text check (role is null or char_length(role) <= 60),
  quote text not null check (char_length(quote) between 20 and 600),
  avatar_url text,
  direction text not null default 'ltr' check (direction in ('ltr', 'rtl')),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists testimonials_published_created_idx
  on public.testimonials (published, created_at desc);

alter table public.testimonials enable row level security;

drop policy if exists "Published testimonials are public" on public.testimonials;
create policy "Published testimonials are public"
  on public.testimonials for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Anyone can submit a testimonial" on public.testimonials;
create policy "Anyone can submit a testimonial"
  on public.testimonials for insert
  to anon, authenticated
  with check (published = false);

-- Avatar storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatar images are public" on storage.objects;
create policy "Avatar images are public"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'avatars');

drop policy if exists "Anyone can upload a testimonial avatar" on storage.objects;
create policy "Anyone can upload a testimonial avatar"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'avatars' and name like 'testimonials/%');
