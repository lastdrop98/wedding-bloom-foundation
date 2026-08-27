ALTER TABLE public.weddings RENAME TO events;
ALTER TABLE public.events RENAME COLUMN wedding_date TO event_date;
ALTER TABLE public.events ADD COLUMN event_type text NOT NULL DEFAULT 'casamento';
ALTER TABLE public.events ADD COLUMN details jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.events SET details = jsonb_strip_nulls(jsonb_build_object(
  'groom_name', groom_name,
  'bride_name', bride_name,
  'groom_mother_name', groom_mother_name,
  'groom_father_name', groom_father_name,
  'bride_mother_name', bride_mother_name,
  'bride_father_name', bride_father_name,
  'ceremony_venue', ceremony_venue,
  'ceremony_address', ceremony_address,
  'ceremony_time', ceremony_time,
  'civil_ceremony_venue', civil_ceremony_venue,
  'civil_ceremony_address', civil_ceremony_address,
  'civil_ceremony_time', civil_ceremony_time,
  'reception_venue', reception_venue,
  'reception_address', reception_address,
  'reception_time', reception_time,
  'bank_name', bank_name,
  'bank_account', bank_account,
  'bank_nib', bank_nib,
  'bank_holder', bank_holder,
  'verse_text', verse_text,
  'verse_reference', verse_reference,
  'verse_2_text', verse_2_text,
  'verse_2_reference', verse_2_reference
));

ALTER TABLE public.events
  DROP COLUMN groom_name,
  DROP COLUMN bride_name,
  DROP COLUMN groom_mother_name,
  DROP COLUMN groom_father_name,
  DROP COLUMN bride_mother_name,
  DROP COLUMN bride_father_name,
  DROP COLUMN ceremony_venue,
  DROP COLUMN ceremony_address,
  DROP COLUMN ceremony_time,
  DROP COLUMN civil_ceremony_venue,
  DROP COLUMN civil_ceremony_address,
  DROP COLUMN civil_ceremony_time,
  DROP COLUMN reception_venue,
  DROP COLUMN reception_address,
  DROP COLUMN reception_time,
  DROP COLUMN bank_name,
  DROP COLUMN bank_account,
  DROP COLUMN bank_nib,
  DROP COLUMN bank_holder,
  DROP COLUMN verse_text,
  DROP COLUMN verse_reference,
  DROP COLUMN verse_2_text,
  DROP COLUMN verse_2_reference;

ALTER TABLE public.gallery RENAME COLUMN wedding_id TO event_id;
ALTER TABLE public.schedule RENAME COLUMN wedding_id TO event_id;
ALTER TABLE public.gifts RENAME COLUMN wedding_id TO event_id;
ALTER TABLE public.rsvps RENAME COLUMN wedding_id TO event_id;

GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;