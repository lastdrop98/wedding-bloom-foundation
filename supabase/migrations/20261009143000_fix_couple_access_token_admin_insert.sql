-- Self-contained repair for installations where the earlier private RSVP migration
-- was not applied by the hosted database. Safe to run more than once.

CREATE TABLE IF NOT EXISTS public.couple_access_tokens (
  event_id uuid PRIMARY KEY REFERENCES public.events(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.couple_access_tokens ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.couple_access_tokens FROM anon;
GRANT SELECT, INSERT ON public.couple_access_tokens TO authenticated;

DROP POLICY IF EXISTS "admins read couple access tokens" ON public.couple_access_tokens;
CREATE POLICY "admins read couple access tokens"
  ON public.couple_access_tokens
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins insert couple access tokens" ON public.couple_access_tokens;
CREATE POLICY "admins insert couple access tokens"
  ON public.couple_access_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- RSVP answers must never be directly readable by anonymous visitors.
DROP POLICY IF EXISTS "rsvps public read" ON public.rsvps;
REVOKE SELECT ON public.rsvps FROM anon;
GRANT SELECT ON public.rsvps TO authenticated;

CREATE OR REPLACE FUNCTION public.ensure_couple_access_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.couple_access_tokens (event_id)
  VALUES (NEW.id)
  ON CONFLICT (event_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS events_create_couple_access_token ON public.events;
CREATE TRIGGER events_create_couple_access_token
  AFTER INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_couple_access_token();

-- Ensure every existing event has a private token, without exposing the token list.
INSERT INTO public.couple_access_tokens (event_id)
SELECT id FROM public.events
ON CONFLICT (event_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.get_couple_rsvps(_token text)
RETURNS SETOF public.rsvps
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.*
  FROM public.rsvps r
  JOIN public.couple_access_tokens t ON t.event_id = r.event_id
  WHERE t.token = _token
  ORDER BY r.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_couple_rsvps(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_couple_rsvps(text) TO anon, authenticated;

-- The current editor supports semantic slots and repeatable gallery images.
ALTER TABLE public.event_media DROP CONSTRAINT IF EXISTS event_media_slot_check;
ALTER TABLE public.event_media DROP CONSTRAINT IF EXISTS event_media_event_slot_unique;
