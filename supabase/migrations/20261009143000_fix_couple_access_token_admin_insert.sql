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

-- Older installations used a restrictive slot check and a unique event/slot constraint.
-- The current editor supports repeatable gallery media and additional semantic slots.
ALTER TABLE public.event_media DROP CONSTRAINT IF EXISTS event_media_slot_check;
ALTER TABLE public.event_media DROP CONSTRAINT IF EXISTS event_media_event_slot_unique;

-- Repair older events if a previous migration was only partially applied.
INSERT INTO public.couple_access_tokens (event_id)
SELECT e.id
FROM public.events e
ON CONFLICT (event_id) DO NOTHING;
