-- Keep RSVP answers private while allowing the couple to view them through a secret access token.
DROP POLICY IF EXISTS "rsvps public read" ON public.rsvps;
REVOKE SELECT ON public.rsvps FROM anon;

CREATE TABLE IF NOT EXISTS public.couple_access_tokens (
  event_id uuid PRIMARY KEY REFERENCES public.events(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.couple_access_tokens ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.couple_access_tokens TO authenticated;
CREATE POLICY "admins read couple access tokens"
  ON public.couple_access_tokens
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

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

GRANT EXECUTE ON FUNCTION public.get_couple_rsvps(text) TO anon, authenticated;
