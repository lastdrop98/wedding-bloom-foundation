-- Allow authenticated Solar Eclipse admins to create a private couple token
-- for older events when the existing token is missing.
ALTER TABLE public.couple_access_tokens ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.couple_access_tokens TO authenticated;

DROP POLICY IF EXISTS "admins insert couple access tokens" ON public.couple_access_tokens;
CREATE POLICY "admins insert couple access tokens"
  ON public.couple_access_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Repair older events if a previous migration was only partially applied.
INSERT INTO public.couple_access_tokens (event_id)
SELECT e.id
FROM public.events e
ON CONFLICT (event_id) DO NOTHING;
