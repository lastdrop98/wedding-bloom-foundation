CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.weddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  template text NOT NULL DEFAULT 'golden-classic',
  groom_name text,
  bride_name text,
  display_names text,
  wedding_date timestamptz,
  hashtag text,
  groom_mother_name text,
  groom_father_name text,
  bride_mother_name text,
  bride_father_name text,
  ceremony_venue text,
  ceremony_address text,
  ceremony_time text,
  civil_ceremony_venue text,
  civil_ceremony_address text,
  civil_ceremony_time text,
  reception_venue text,
  reception_address text,
  reception_time text,
  rsvp_deadline date,
  bank_name text,
  bank_account text,
  bank_nib text,
  bank_holder text,
  contact_1_name text,
  contact_1_phone text,
  contact_2_name text,
  contact_2_phone text,
  verse_text text,
  verse_reference text,
  verse_2_text text,
  verse_2_reference text,
  cover_image_path text,
  music_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.weddings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weddings TO authenticated;
GRANT ALL ON public.weddings TO service_role;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weddings public read" ON public.weddings FOR SELECT USING (true);
CREATE POLICY "weddings admin write" ON public.weddings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  image_path text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery TO authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery public read" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "gallery admin write" ON public.gallery FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  time_label text,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.schedule TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedule TO authenticated;
GRANT ALL ON public.schedule TO service_role;
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "schedule public read" ON public.schedule FOR SELECT USING (true);
CREATE POLICY "schedule admin write" ON public.schedule FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  link_or_info text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gifts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gifts TO authenticated;
GRANT ALL ON public.gifts TO service_role;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gifts public read" ON public.gifts FOR SELECT USING (true);
CREATE POLICY "gifts admin write" ON public.gifts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_phone text,
  attending boolean NOT NULL DEFAULT true,
  guest_count integer NOT NULL DEFAULT 1,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.rsvps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rsvps public insert" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "rsvps admin read" ON public.rsvps FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "rsvps admin update" ON public.rsvps FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "rsvps admin delete" ON public.rsvps FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "wedding files public read" ON storage.objects FOR SELECT USING (bucket_id IN ('wedding-gallery','wedding-audio'));
CREATE POLICY "wedding files admin insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('wedding-gallery','wedding-audio') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "wedding files admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('wedding-gallery','wedding-audio') AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "wedding files admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('wedding-gallery','wedding-audio') AND public.has_role(auth.uid(), 'admin'));