-- Reconstructs the `guests` and `guestbook` tables, which exist in the live
-- database (see src/integrations/supabase/types.ts) but were never captured
-- by a migration file. Without this, `supabase/migrations` cannot recreate
-- the current schema from scratch.
--
-- Policies mirror this project's existing convention (weddings/events,
-- gallery, schedule, gifts, rsvps): public read/write where the public site
-- needs it, admin-only for management. This is a best-effort reconstruction
-- from how the frontend uses these tables — it has not been diffed against
-- the live database's actual policies, so verify before relying on it to
-- bootstrap a fresh environment.

CREATE TABLE IF NOT EXISTS public.guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  invited_count integer NOT NULL DEFAULT 1,
  rsvp_status text NOT NULL DEFAULT 'pending',
  token text NOT NULL DEFAULT gen_random_uuid()::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (token)
);
GRANT SELECT, UPDATE ON public.guests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guests TO authenticated;
GRANT ALL ON public.guests TO service_role;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Public read/update: the RSVP form looks up a guest by their personal
-- ?g=<token> link (guests.select) and marks it confirmed (guests.update).
CREATE POLICY "guests public read" ON public.guests FOR SELECT USING (true);
CREATE POLICY "guests public rsvp update" ON public.guests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "guests admin insert" ON public.guests FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "guests admin delete" ON public.guests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.guestbook (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.guestbook TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guestbook TO authenticated;
GRANT ALL ON public.guestbook TO service_role;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guestbook public read" ON public.guestbook FOR SELECT USING (true);
CREATE POLICY "guestbook public insert" ON public.guestbook FOR INSERT WITH CHECK (true);
CREATE POLICY "guestbook admin moderate" ON public.guestbook FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
