-- Harden admin media access so uploads and replacements are deterministic.
alter table if exists public.event_media enable row level security;

drop policy if exists "event media public read" on public.event_media;
create policy "event media public read"
  on public.event_media for select
  to public
  using (true);

drop policy if exists "event media admin insert" on public.event_media;
create policy "event media admin insert"
  on public.event_media for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

drop policy if exists "event media admin update" on public.event_media;
create policy "event media admin update"
  on public.event_media for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

drop policy if exists "event media admin delete" on public.event_media;
create policy "event media admin delete"
  on public.event_media for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

grant select on public.event_media to anon, authenticated;
grant insert, update, delete on public.event_media to authenticated;

drop policy if exists "wedding files public read" on storage.objects;
create policy "wedding files public read"
  on storage.objects for select
  using (bucket_id in ('wedding-gallery','wedding-audio'));

drop policy if exists "wedding files admin insert" on storage.objects;
create policy "wedding files admin insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('wedding-gallery','wedding-audio')
    and public.has_role(auth.uid(), 'admin'::public.app_role)
  );

drop policy if exists "wedding files admin update" on storage.objects;
create policy "wedding files admin update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('wedding-gallery','wedding-audio')
    and public.has_role(auth.uid(), 'admin'::public.app_role)
  )
  with check (
    bucket_id in ('wedding-gallery','wedding-audio')
    and public.has_role(auth.uid(), 'admin'::public.app_role)
  );

drop policy if exists "wedding files admin delete" on storage.objects;
create policy "wedding files admin delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('wedding-gallery','wedding-audio')
    and public.has_role(auth.uid(), 'admin'::public.app_role)
  );
