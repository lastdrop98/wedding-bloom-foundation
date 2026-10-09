import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { AUDIO_BUCKET, GALLERY_BUCKET, details as readDetails, looseDb, type EventRow } from "@/lib/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TemplatePicker } from "@/components/TemplatePicker";
import { getTemplateDefinition } from "@/lib/templates";
import { getTemplateDirection } from "@/lib/templateDirections";

type FieldKind = "text" | "date" | "datetime" | "textarea";

type Field = { name: string; label: string; kind?: FieldKind; scope: "column" | "details" };

const GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "Identificação",
    fields: [
      { name: "slug", label: "Slug (endereço na URL)", scope: "column" },
      { name: "template", label: "Template", scope: "column" },
      { name: "groom_name", label: "Nome do noivo", scope: "details" },
      { name: "bride_name", label: "Nome da noiva", scope: "details" },
      { name: "display_names", label: "Nomes a mostrar", scope: "column" },
      { name: "event_date", label: "Data e hora do evento", kind: "datetime", scope: "column" },
      { name: "hashtag", label: "Hashtag", scope: "column" },
    ],
  },
  {
    title: "Pais",
    fields: [
      { name: "groom_father_name", label: "Pai do noivo", scope: "details" },
      { name: "groom_mother_name", label: "Mãe do noivo", scope: "details" },
      { name: "bride_father_name", label: "Pai da noiva", scope: "details" },
      { name: "bride_mother_name", label: "Mãe da noiva", scope: "details" },
    ],
  },
  {
    title: "Cerimónia",
    fields: [
      { name: "ceremony_venue", label: "Local", scope: "details" },
      { name: "ceremony_address", label: "Morada", scope: "details" },
      { name: "ceremony_time", label: "Hora", scope: "details" },
    ],
  },
  {
    title: "Cerimónia Civil (opcional)",
    fields: [
      { name: "civil_ceremony_venue", label: "Local", scope: "details" },
      { name: "civil_ceremony_address", label: "Morada", scope: "details" },
      { name: "civil_ceremony_time", label: "Hora", scope: "details" },
    ],
  },
  {
    title: "Receção",
    fields: [
      { name: "reception_venue", label: "Local", scope: "details" },
      { name: "reception_address", label: "Morada", scope: "details" },
      { name: "reception_time", label: "Hora", scope: "details" },
    ],
  },
  {
    title: "Pagamentos e presentes",
    fields: [
      { name: "mpesa_number", label: "M-Pesa", scope: "details" },
      { name: "emola_number", label: "e-Mola", scope: "details" },
      { name: "mkesh_number", label: "mKesh", scope: "details" },
      {
        name: "bank_payment_note",
        label: "Nota sobre pagamentos",
        kind: "textarea",
        scope: "details",
      },
    ],
  },
  {
    title: "Confirmações e presentes",
    fields: [
      { name: "rsvp_deadline", label: "Prazo de confirmação", kind: "date", scope: "column" },
      { name: "bank_holder", label: "Titular da conta", scope: "details" },
      { name: "bank_name", label: "Banco", scope: "details" },
      { name: "bank_account", label: "Conta", scope: "details" },
      { name: "bank_nib", label: "NIB / IBAN", scope: "details" },
    ],
  },
  {
    title: "Contactos",
    fields: [
      { name: "contact_1_name", label: "Contacto 1 — nome", scope: "column" },
      { name: "contact_1_phone", label: "Contacto 1 — telefone", scope: "column" },
      { name: "contact_2_name", label: "Contacto 2 — nome", scope: "column" },
      { name: "contact_2_phone", label: "Contacto 2 — telefone", scope: "column" },
    ],
  },
  {
    title: "Conteúdo do convite",
    fields: [
      {
        name: "welcome_message",
        label: "Mensagem de abertura",
        kind: "textarea",
        scope: "details",
      },
      { name: "dress_code", label: "Dress code", scope: "details" },
      { name: "rsvp_message", label: "Mensagem do RSVP", kind: "textarea", scope: "details" },
      { name: "closing_message", label: "Mensagem final", kind: "textarea", scope: "details" },
      { name: "story_intro", label: "Introdução da história", kind: "textarea", scope: "details" },
      { name: "bride_letter", label: "Carta da noiva", kind: "textarea", scope: "details" },
      { name: "groom_letter", label: "Carta do noivo", kind: "textarea", scope: "details" },
      { name: "story_1_date", label: "História 1 — data", scope: "details" },
      { name: "story_1_title", label: "História 1 — título", scope: "details" },
      { name: "story_1_text", label: "História 1 — texto", kind: "textarea", scope: "details" },
      { name: "story_2_date", label: "História 2 — data", scope: "details" },
      { name: "story_2_title", label: "História 2 — título", scope: "details" },
      { name: "story_2_text", label: "História 2 — texto", kind: "textarea", scope: "details" },
      { name: "story_3_date", label: "História 3 — data", scope: "details" },
      { name: "story_3_title", label: "História 3 — título", scope: "details" },
      { name: "story_3_text", label: "História 3 — texto", kind: "textarea", scope: "details" },
      { name: "story_4_date", label: "História 4 — data", scope: "details" },
      { name: "story_4_title", label: "História 4 — título", scope: "details" },
      { name: "story_4_text", label: "História 4 — texto", kind: "textarea", scope: "details" },
      { name: "party_1_name", label: "Padrinho/Dama 1 — nome", scope: "details" },
      { name: "party_1_role", label: "Padrinho/Dama 1 — função", scope: "details" },
      { name: "party_2_name", label: "Padrinho/Dama 2 — nome", scope: "details" },
      { name: "party_2_role", label: "Padrinho/Dama 2 — função", scope: "details" },
      { name: "party_3_name", label: "Padrinho/Dama 3 — nome", scope: "details" },
      { name: "party_3_role", label: "Padrinho/Dama 3 — função", scope: "details" },
      { name: "party_4_name", label: "Padrinho/Dama 4 — nome", scope: "details" },
      { name: "party_4_role", label: "Padrinho/Dama 4 — função", scope: "details" },
    ],
  },
  {
    title: "Versículos (opcional)",
    fields: [
      { name: "verse_text", label: "Versículo 1", kind: "textarea", scope: "details" },
      { name: "verse_reference", label: "Referência 1", scope: "details" },
      { name: "verse_2_text", label: "Versículo 2", kind: "textarea", scope: "details" },
      { name: "verse_2_reference", label: "Referência 2", scope: "details" },
    ],
  },
  {
    title: "Selos do convite",
    fields: [
      { name: "seal_enabled", label: "Ativar selos (true/false)", scope: "details" },
      { name: "seal_mode", label: "Modo (one/two)", scope: "details" },
      { name: "seal_one_text", label: "Selo 1 — texto", scope: "details" },
      { name: "seal_two_text", label: "Selo 2 — texto", scope: "details" },
      { name: "seal_one_label", label: "Selo 1 — etiqueta", scope: "details" },
      { name: "seal_two_label", label: "Selo 2 — etiqueta", scope: "details" },
      { name: "seal_one_color", label: "Selo 1 — cor", scope: "details" },
      { name: "seal_two_color", label: "Selo 2 — cor", scope: "details" },
    ],
  },
];

function SelectNative({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    >
      <option value="">Escolher…</option>
      {options.map(([optionValue, label]) => (
        <option key={optionValue} value={optionValue}>
          {label}
        </option>
      ))}
    </select>
  );
}

function toInputValue(value: unknown, kind?: FieldKind) {
  if (value == null) return "";
  if (kind === "datetime") return new Date(String(value)).toISOString().slice(0, 16);
  return String(value);
}

export function WeddingForm({
  event,
  eventType = "casamento",
  onSaved,
  onCancel,
  initialValues,
}: {
  event: EventRow | null;
  eventType?: string;
  onSaved: (event?: EventRow) => void;
  onCancel: () => void;
  initialValues?: Partial<Record<string, string>> | undefined;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const detailValues = event ? readDetails(event) : {};
    const base: Record<string, string> = { template: "golden-classic" };
    GROUPS.forEach((g) =>
      g.fields.forEach((f) => {
        const raw =
          f.scope === "details"
            ? (detailValues as Record<string, unknown>)[f.name]
            : event
              ? (event as unknown as Record<string, unknown>)[f.name]
              : null;
        base[f.name] = toInputValue(raw, f.kind);
      }),
    );
    if (!event) base["template"] = initialValues?.["template"] || "golden-classic";
    if (!event && initialValues) {
      Object.entries(initialValues).forEach(([key, value]) => {
        if (value != null) base[key] = value;
      });
    }
    return base;
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<Array<{ id: string; slot: string; media_type: string; storage_path: string; sort_order: number }>>([]);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [assetUrls, setAssetUrls] = useState<{ cover: string; music: string }>({ cover: "", music: "" });

  async function loadMedia() {
    if (!event) return;
    const { data, error } = await looseDb
      .from("event_media")
      .select("id,slot,media_type,storage_path,sort_order")
      .eq("event_id", event.id)
      .order("sort_order", { ascending: true });
    if (error) {
      toast.error(`Não foi possível carregar a media: ${error.message}`);
      return;
    }
    const items = data ?? [];
    setMediaItems(items);
    const urls: Record<string, string> = {};
    await Promise.all(items.map(async (item: { id: string; storage_path: string }) => {
      const { data: signed } = await supabase.storage.from(GALLERY_BUCKET).createSignedUrl(item.storage_path, 3600);
      if (signed?.signedUrl) urls[item.id] = signed.signedUrl;
    }));
    setMediaUrls(urls);
    const nextAssets = { cover: "", music: "" };
    if (event.cover_image_path) {
      const { data: cover } = await supabase.storage.from(GALLERY_BUCKET).createSignedUrl(event.cover_image_path, 3600);
      nextAssets.cover = cover?.signedUrl ?? "";
    }
    if (event.music_path) {
      const { data: music } = await supabase.storage.from(AUDIO_BUCKET).createSignedUrl(event.music_path, 3600);
      nextAssets.music = music?.signedUrl ?? "";
    }
    setAssetUrls(nextAssets);
  }

  useEffect(() => { void loadMedia(); }, [event?.id, event?.cover_image_path, event?.music_path]);

  function set(name: string, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!values["slug"]) {
      toast.error("O slug é obrigatório.");
      return;
    }
    setBusy(true);
    const payload: Record<string, unknown> = {};
    const detailPayload: Record<string, string | null> = event ? { ...readDetails(event) } : {};
    GROUPS.forEach((g) =>
      g.fields.forEach((f) => {
        const raw = values[f.name] ?? "";
        const value = raw === "" ? null : raw;
        if (f.scope === "details") detailPayload[f.name] = value;
        else payload[f.name] = value;
      }),
    );
    payload["template"] = values["template"] || "golden-classic";
    payload["slug"] = values["slug"];
    payload["event_type"] = event?.event_type ?? eventType;
    payload["details"] = detailPayload;

    const result = event
      ? await supabase
          .from("events")
          .update(payload as never)
          .eq("id", event.id)
          .select("*")
          .single()
      : await supabase.from("events").insert(payload as never).select("*").single();
    setBusy(false);
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    toast.success(event ? "Alterações guardadas." : "Evento criado.");
    onSaved(result.data as EventRow);
  }

  async function uploadMedia(slot: string, file: File) {
    if (!event) {
      toast.error("Guarde o evento primeiro.");
      return;
    }

    const isVideo = file.type.startsWith("video/") || /\.(mp4|mov|webm|m4v|avi|mkv)$/i.test(file.name);
    const expectsVideo = slot.endsWith("_video");
    const maxBytes = isVideo ? 120 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(isVideo ? "O vídeo ultrapassa o limite de 120 MB." : "A imagem ultrapassa o limite de 20 MB.");
      return;
    }
    if (expectsVideo && !isVideo) {
      toast.error("Este campo aceita apenas vídeo.");
      return;
    }
    if (!file.size) {
      toast.error("O ficheiro selecionado está vazio.");
      return;
    }

    setUploading(`media:${slot}`);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? (isVideo ? "mp4" : "jpg");
    const storagePath = `${event.id}/media/${slot}-${Date.now()}.${ext}`;
    let stored = false;
    let succeeded = false;

    try {
      const { error: uploadError } = await supabase.storage
        .from(GALLERY_BUCKET)
        .upload(storagePath, file, { upsert: false, cacheControl: "3600" });

      if (uploadError) throw new Error(`Não foi possível enviar o ficheiro: ${uploadError.message}`);
      stored = true;

      const current = mediaItems.filter((item) => item.slot === slot);
      const isRepeatable = slot === "gallery";
      const existing = isRepeatable ? null : current[0] ?? null;
      const sortOrder = existing?.sort_order ?? current.length;

      if (existing) {
        const { error: updateError } = await looseDb
          .from("event_media")
          .update({
            storage_path: storagePath,
            media_type: isVideo ? "video" : "image",
            sort_order: sortOrder,
          })
          .eq("id", existing.id)
          .eq("event_id", event.id);
        if (updateError) throw new Error(`A base de dados recusou a media: ${updateError.message}`);
      } else {
        const { error: insertError } = await looseDb.from("event_media").insert({
          event_id: event.id,
          slot,
          storage_path: storagePath,
          media_type: isVideo ? "video" : "image",
          sort_order: sortOrder,
        });
        if (insertError) throw new Error(`A base de dados recusou a media: ${insertError.message}`);
      }

      if (existing?.storage_path && existing.storage_path !== storagePath) {
        await supabase.storage.from(GALLERY_BUCKET).remove([existing.storage_path]);
      }

      await loadMedia();
      toast.success(existing ? "Media substituída no convite." : "Media adicionada ao convite.");
      succeeded = true;
    } catch (error) {
      if (stored) {
        await supabase.storage.from(GALLERY_BUCKET).remove([storagePath]);
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível guardar esta media. Tente novamente.",
      );
    } finally {
      setUploading(null);
    }

    // The media panel already refreshes itself with loadMedia().
    // Do not re-save/reload the parent editor here: its asynchronous refresh
    // used to surface a false failure after a successful upload.
    if (succeeded) return;
  }

  async function removeMedia(item: { id: string; storage_path: string }) {
    if (!event) return;
    const { error } = await looseDb.from("event_media").delete().eq("id", item.id).eq("event_id", event.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await supabase.storage.from(GALLERY_BUCKET).remove([item.storage_path]);
    await loadMedia();
    toast.success("Media removida.");
    onSaved(event);
  }

  async function upload(kind: "cover" | "music", file: File) {
    if (!event) {
      toast.error("Guarde o evento antes de enviar ficheiros.");
      return;
    }
    setUploading(kind);
    const bucket = kind === "cover" ? GALLERY_BUCKET : AUDIO_BUCKET;
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${event.id}/${kind}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      setUploading(null);
      toast.error(error.message);
      return;
    }
    const column = kind === "cover" ? "cover_image_path" : "music_path";
    const { data: updatedEvent, error: updateError } = await supabase
      .from("events")
      .update({ [column]: path } as never)
      .eq("id", event.id)
      .select("*")
      .single();
    setUploading(null);
    if (updateError || !updatedEvent) {
      await supabase.storage.from(bucket).remove([path]);
      toast.error(updateError?.message ?? "Não foi possível guardar o ficheiro no evento.");
      return;
    }
    const previousPath = kind === "cover" ? event.cover_image_path : event.music_path;
    if (previousPath && previousPath !== path) {
      await supabase.storage.from(bucket).remove([previousPath]);
    }
    toast.success(kind === "cover" ? "Foto de capa atualizada." : "Música atualizada.");
    onSaved(updatedEvent as EventRow);
  }

  return (
    <form onSubmit={save} className="space-y-10">
      {GROUPS.map((group) => (
        <fieldset key={group.title} className="space-y-4">
          <legend className="eyebrow">{group.title}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((f) => {
              const id = f.name;
              return (
                <div
                  key={id}
                  className={f.kind === "textarea" ? "space-y-2 sm:col-span-2" : "space-y-2"}
                >
                  <Label htmlFor={id}>{f.label}</Label>
                  {f.kind === "textarea" ? (
                    <Textarea
                      id={id}
                      rows={3}
                      value={values[id] ?? ""}
                      onChange={(e) => set(id, e.target.value)}
                    />
                  ) : f.name === "template" ? (
                    <div className="sm:col-span-2">
                      <TemplatePicker
                        value={values["template"] || "golden-classic"}
                        onChange={(value) => set("template", value)}
                      />
                    </div>
                  ) : (
                    <Input
                      id={id}
                      type={
                        f.kind === "date"
                          ? "date"
                          : f.kind === "datetime"
                            ? "datetime-local"
                            : "text"
                      }
                      value={values[id] ?? ""}
                      onChange={(e) => set(id, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      <fieldset className="space-y-4 rounded-xl border border-border bg-background/40 p-5">
        <legend className="eyebrow">Selos</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="seal-enabled">Ativar selos</Label>
            <SelectNative
              value={values["seal_enabled"] ?? ""}
              onChange={(v) => set("seal_enabled", v)}
              options={[
                ["true", "Sim"],
                ["false", "Não"],
              ]}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seal-mode">Quantidade</Label>
            <SelectNative
              value={values["seal_mode"] ?? ""}
              onChange={(v) => set("seal_mode", v)}
              options={[
                ["one", "1 selo"],
                ["two", "2 selos"],
              ]}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="seal-one-text">Selo 1</Label>
            <Input
              id="seal-one-text"
              value={values["seal_one_text"] ?? ""}
              onChange={(e) => set("seal_one_text", e.target.value)}
              placeholder="Ex.: 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seal-two-text">Selo 2</Label>
            <Input
              id="seal-two-text"
              value={values["seal_two_text"] ?? ""}
              onChange={(e) => set("seal_two_text", e.target.value)}
              placeholder="Ex.: 2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seal-one-label">Etiqueta 1</Label>
            <Input
              id="seal-one-label"
              value={values["seal_one_label"] ?? ""}
              onChange={(e) => set("seal_one_label", e.target.value)}
              placeholder="Convite válido"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seal-two-label">Etiqueta 2</Label>
            <Input
              id="seal-two-label"
              value={values["seal_two_label"] ?? ""}
              onChange={(e) => set("seal_two_label", e.target.value)}
              placeholder="Convite válido"
            />
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Os selos podem ser usados para convites individuais, de casal ou para a versão
          tradicional/Xiguiane.
        </p>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-border bg-background/40 p-5">
        <legend className="eyebrow">Direção do modelo</legend>
        {(() => {
          const selected = getTemplateDefinition(values["template"]);
          const direction = getTemplateDirection(selected);
          return (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Estrutura", direction.structure],
                ["Design", direction.design],
                ["Tipografia", direction.typography],
                ["Elementos", direction.motifs],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">{label}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          );
        })()}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="max-w-2xl text-xs leading-5 text-muted-foreground">
            Este é o modelo que será aplicado ao convite publicado. O conteúdo continua editável,
            mas a ordem, ritmo, tipografia e composição seguem a direção escolhida.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`/modelos/${getTemplateDefinition(values["template"]).value}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-border px-3.5 py-2 text-xs font-medium transition hover:border-primary hover:text-primary"
            >
              Ver modelo
            </a>
            {event && values["slug"] && (
              <a
                href={`/${values["slug"]}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90"
              >
                Ver convite atual
              </a>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="eyebrow">Ficheiros</legend>
        {event ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cover">Foto de capa</Label>
              <Input
                id="cover"
                type="file"
                accept="image/*"
                disabled={uploading !== null}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload("cover", file);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Atual: {event.cover_image_path ?? "nenhuma"}
              </p>
              {assetUrls.cover && <img src={assetUrls.cover} alt="Pré-visualização da capa" className="h-40 w-full rounded-xl object-cover" />}

            </div>
            <div className="space-y-2">
              <Label htmlFor="music">Música</Label>
              <Input
                id="music"
                type="file"
                accept="audio/*"
                disabled={uploading !== null}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload("music", file);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Atual: {event.music_path ?? "nenhuma"}
              </p>
              {assetUrls.music && <audio controls preload="metadata" src={assetUrls.music} className="w-full" />}

            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Guarde o evento primeiro para poder enviar a foto de capa e a música.
          </p>
        )}
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-border bg-background/40 p-5">
        <legend className="eyebrow">Galeria e media por secção</legend>
        <p className="text-sm leading-6 text-muted-foreground">
          Adicione fotos ou vídeos específicos para a capa, história, galeria e outros pontos do convite.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            ["hero", "Capa / abertura"],
            ["cover_video", "Vídeo de abertura"],
            ["background", "Fundo do convite"],
            ["bride", "Foto da noiva"],
            ["groom", "Foto do noivo"],
            ["story", "História do casal"],
            ["story_video", "Vídeo da história"],
            ["section_1", "Momento especial 1"],
            ["section_2", "Momento especial 2"],
            ["gallery", "Galeria / destaque"],
            ["closing", "Encerramento"],
          ] as const).map(([slot, label]) => (
            <div key={slot} className="rounded-xl border border-border p-4 space-y-3">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">
                  {mediaItems.filter((item) => item.slot === slot).length} ficheiro(s)
                </p>
              </div>
              <Input
                type="file"
                accept="image/*,video/*"
                disabled={!event || uploading !== null}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadMedia(slot, file);
                  e.currentTarget.value = "";
                }}
              />
              <div className="space-y-2">
                {mediaItems.filter((item) => item.slot === slot).map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2 text-xs">
                    <div className="min-w-0 flex-1">
                      <span className="block truncate">{item.media_type === "video" ? "Vídeo" : "Imagem"} · {item.storage_path.split("/").pop()}</span>
                      {mediaUrls[item.id] && (item.media_type === "video"
                        ? <video controls preload="metadata" src={mediaUrls[item.id]} className="mt-2 h-28 w-full rounded-lg object-cover" />
                        : <img src={mediaUrls[item.id]} alt={label} className="mt-2 h-28 w-full rounded-lg object-cover" />)}
                    </div>
                    <Button type="button" size="sm" variant="ghost" onClick={() => void removeMedia(item)}>
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={busy}>
          Guardar
        </Button>
        {values["slug"] && (
          <Button
            type="button"
            variant="outline"
            onClick={() => window.open(`/${values["slug"]}`, "_blank", "noopener,noreferrer")}
          >
            Pré-visualizar convite
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}