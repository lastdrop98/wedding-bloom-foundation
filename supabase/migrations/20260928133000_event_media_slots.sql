CREATE TABLE IF NOT EXISTS public.event_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  slot text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  storage_path text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT event_media_type_check CHECK (media_type IN ('image', 'video')),
  CONSTRAINT event_media_slot_check CHECK (
    slot IN (
      'cover',
      'groom',
      'bride',
      'section_1',
      'section_2',
      'background',
      'cover_video',
      'story_video'
    )
  ),
  CONSTRAINT event_media_event_slot_unique UNIQUE (event_id, slot)
);

CREATE INDEX IF NOT EXISTS event_media_event_id_idx ON public.event_media(event_id);

ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "event_media_public_read" ON public.event_media;
CREATE POLICY "event_media_public_read"
  ON public.event_media
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "event_media_admin_insert" ON public.event_media;
CREATE POLICY "event_media_admin_insert"
  ON public.event_media
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "event_media_admin_update" ON public.event_media;
CREATE POLICY "event_media_admin_update"
  ON public.event_media
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "event_media_admin_delete" ON public.event_media;
CREATE POLICY "event_media_admin_delete"
  ON public.event_media
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
