create table if not exists public.template_requests (
  id uuid primary key default gen_random_uuid(),
  template_value text not null,
  template_label text not null,
  couple_name text not null,
  phone text not null,
  wedding_date date,
  message text,
  status text not null default 'new' check (status in ('new','in_progress','completed','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.template_requests enable row level security;

revoke all on table public.template_requests from anon, authenticated;
grant insert on table public.template_requests to anon, authenticated;
grant select, update on table public.template_requests to authenticated;

create policy "Public can create template requests"
  on public.template_requests
  for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read template requests"
  on public.template_requests
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.user_roles
      where user_roles.user_id = (select auth.uid())
        and user_roles.role = 'admin'
    )
  );

create policy "Admins can update template requests"
  on public.template_requests
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.user_roles
      where user_roles.user_id = (select auth.uid())
        and user_roles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.user_roles
      where user_roles.user_id = (select auth.uid())
        and user_roles.role = 'admin'
    )
  );

create index if not exists template_requests_created_at_idx
  on public.template_requests (created_at desc);
