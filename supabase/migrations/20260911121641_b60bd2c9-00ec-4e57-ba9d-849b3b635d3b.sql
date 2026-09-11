DROP POLICY IF EXISTS "rsvps admin read" ON public.rsvps;
CREATE POLICY "rsvps public read" ON public.rsvps FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.rsvps TO anon;
GRANT SELECT ON public.rsvps TO authenticated;
ALTER TABLE public.rsvps REPLICA IDENTITY FULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'rsvps') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvps;
  END IF;
END $$;