import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Wedding = Tables<"weddings">;
export type GalleryItem = Tables<"gallery">;
export type ScheduleItem = Tables<"schedule">;
export type GiftItem = Tables<"gifts">;

export const GALLERY_BUCKET = "wedding-gallery";
export const AUDIO_BUCKET = "wedding-audio";

/** Buckets são privados: geramos um link assinado de leitura (permitido a qualquer visitante). */
export async function signedUrl(bucket: string, path?: string | null) {
  if (!path) return null;
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

export async function fetchWeddingBySlug(slug: string) {
  const { data, error } = await supabase
    .from("weddings")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchWeddingContent(weddingId: string) {
  const [gallery, schedule, gifts] = await Promise.all([
    supabase
      .from("gallery")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("schedule")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("gifts")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("sort_order", { ascending: true }),
  ]);
  return {
    gallery: gallery.data ?? [],
    schedule: schedule.data ?? [],
    gifts: gifts.data ?? [],
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

export function coupleTitle(w: Pick<Wedding, "display_names" | "groom_name" | "bride_name">) {
  return (
    w.display_names ||
    [w.bride_name, w.groom_name].filter(Boolean).join(" & ") ||
    "Os Noivos"
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
