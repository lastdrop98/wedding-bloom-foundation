ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS invite_type text NOT NULL DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS table_label text;

ALTER TABLE public.guests
  DROP CONSTRAINT IF EXISTS guests_invite_type_check;

ALTER TABLE public.guests
  ADD CONSTRAINT guests_invite_type_check CHECK (invite_type IN ('individual', 'casal'));
