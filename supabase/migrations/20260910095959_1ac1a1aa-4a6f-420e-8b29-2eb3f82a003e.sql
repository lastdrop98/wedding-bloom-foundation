ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image';
ALTER TABLE public.gifts ADD COLUMN IF NOT EXISTS image_path text;