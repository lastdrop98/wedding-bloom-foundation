import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type EventRow = Tables<"events">;
export type GalleryItem = Tables<"gallery">;
export type EventMediaItem = Tables<"event_media">;
export type ScheduleItem = Tables<"schedule">;
export type GiftItem = Tables<"gifts">;

export const GALLERY_BUCKET = "wedding-gallery";
export const AUDIO_BUCKET = "wedding-audio";

/** Campos guardados dentro de `details` para eventos do tipo casamento. */
export const WEDDING_DETAIL_FIELDS = [
  "groom_name",
  "bride_name",
  "groom_mother_name",
  "groom_father_name",
  "bride_mother_name",
  "bride_father_name",
  "ceremony_venue",
  "ceremony_address",
  "ceremony_time",
  "civil_ceremony_venue",
  "civil_ceremony_address",
  "civil_ceremony_time",
  "reception_venue",
  "reception_address",
  "reception_time",
  "bank_name",
  "bank_account",
  "bank_nib",
  "bank_holder",
  "mpesa_number",
  "emola_number",
  "mkesh_number",
  "bank_payment_note",
  "verse_text",
  "verse_reference",
  "verse_2_text",
  "verse_2_reference",
  "seal_enabled",
  "seal_mode",
  "seal_one_text",
  "seal_two_text",
  "seal_one_label",
  "seal_two_label",
  "seal_one_color",
  "seal_two_color",
  "music_title",
  "welcome_message",
  "dress_code",
  "rsvp_message",
  "closing_message",
  "story_intro",
  "story_1_date",
  "story_1_title",
  "story_1_text",
  "story_2_date",
  "story_2_title",
  "story_2_text",
  "story_3_date",
  "story_3_title",
  "story_3_text",
  "story_4_date",
  "story_4_title",
  "story_4_text",
  "party_1_name",
  "party_1_role",
  "party_2_name",
  "party_2_role",
  "party_3_name",
  "party_3_role",
  "party_4_name",
  "party_4_role",
] as const;

export type WeddingDetailField = (typeof WEDDING_DETAIL_FIELDS)[number];

export type EventDetails = Partial<Record<WeddingDetailField, string | null>>;

export function details(event: Pick<EventRow, "details">): EventDetails {
  const value = event.details;
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as EventDetails)
    : {};
}

/** Lê um campo específico de `details`. */
export function detail(event: Pick<EventRow, "details">, field: WeddingDetailField) {
  const value = details(event)[field];
  return value == null || value === "" ? null : String(value);
}

export const EVENT_TYPES = [
  { value: "casamento", label: "Casamento", available: true },
  { value: "aniversario", label: "Aniversário", available: false },
  { value: "baptizado", label: "Baptizado", available: false },
] as const;

export function eventTypeLabel(type?: string | null) {
  return EVENT_TYPES.find((t) => t.value === type)?.label ?? "Evento";
}

/** Buckets são privados: geramos um link assinado de leitura (permitido a qualquer visitante). */
 export async function signedUrl(bucket: string, path?: string | null) { if (!path) return null; if (/^https?:\/\//i.test(path)) return path; const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60); return data?.signedUrl ?? null; }

export async function fetchEventBySlug(slug: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchEventContent(eventId: string) {
  const [gallery, schedule, gifts, media] = await Promise.all([
    supabase
      .from("gallery")
      .select("*")
      .eq("event_id", eventId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("schedule")
      .select("*")
      .eq("event_id", eventId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("gifts")
      .select("*")
      .eq("event_id", eventId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("event_media")
      .select("*")
      .eq("event_id", eventId)
      .order("sort_order", { ascending: true }),
  ]);
  return {
    gallery: gallery.data ?? [],
    schedule: schedule.data ?? [],
    gifts: gifts.data ?? [],
    media: media.data ?? [],
  };
}

export type InviteType = "individual" | "casal" | null;

export function parseInviteType(value: unknown): InviteType {
  return value === "individual" || value === "casal" ? value : null;
}

export function inviteBadgeLabel(tipo: InviteType) {
  if (tipo === "individual") return "Convite válido para 1 pessoa";
  if (tipo === "casal") return "Convite válido para 2 pessoas";
  return null;
}

export function inviteBadgeHint(tipo: InviteType) {
  if (!tipo) return null;
  const n = tipo === "individual" ? "1" : "2";
  return `Ao confirmar presença, escreva "${n}" no campo "Número de convidados"`;
}

export function eventTitle(event: Pick<EventRow, "display_names" | "details">) {
  return (
    event.display_names ||
    [detail(event, "bride_name"), detail(event, "groom_name")].filter(Boolean).join(" & ") ||
    "O Evento"
  );
}

export function formatDatePt(value?: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function mapsUrl(address?: string | null, venue?: string | null) {
  const q = [venue, address].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
