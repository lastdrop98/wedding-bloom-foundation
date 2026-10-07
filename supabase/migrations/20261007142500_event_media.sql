create table if not exists public.event_media (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  slot text not null,
  storage_path text not null,
  media_type text not null check (media_type in ('image','video')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists event_media_event_slot_order_idx
  on public.event_media(event_id, slot, sort_order, created_at);

alter table public.event_media enable row level security;

drop policy if exists "event media public read" on public.event_media;
create policy "event media public read"
  on public.event_media
  for select
  to public
  using (true);

drop policy if exists "event media admin insert" on public.event_media;
create policy "event media admin insert"
  on public.event_media
  for insert
  to authenticated
  with check (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "event media admin update" on public.event_media;
create policy "event media admin update"
  on public.event_media
  for update
  to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "event media admin delete" on public.event_media;
create policy "event media admin delete"
  on public.event_media
  for delete
  to authenticated
  using (has_role(auth.uid(), 'admin'::app_role));

grant select on public.event_media to anon, authenticated;
grant insert, update, delete on public.event_media to authenticated;
