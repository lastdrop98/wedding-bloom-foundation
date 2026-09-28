import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  AUDIO_BUCKET,
  GALLERY_BUCKET,
  details as readDetails,
  type EventRow,
} from "@/lib/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TemplatePicker } from "@/components/TemplatePicker";

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
      { name: "welcome_message", label: "Mensagem de abertura", kind: "textarea", scope: "details" },
      { name: "dress_code", label: "Dress code", scope: "details" },
      { name: "rsvp_message", label: "Mensagem do RSVP", kind: "textarea", scope: "details" },
      { name: "closing_message", label: "Mensagem final", kind: "textarea", scope: "details" },
      { name: "story_intro", label: "Introdução da história", kind: "textarea", scope: "details" },
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

function SelectNative({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[][] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
      <option value="">Escolher…</option>
      {options.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}
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
}: {
  event: EventRow | null;
  eventType?: string;
  onSaved: () => void;
  onCancel: () => void;
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
    if (!event) base["template"] = "golden-classic";
    return base;
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

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

    const { error } = event
      ? await supabase.from("events").update(payload as never).eq("id", event.id)
      : await supabase.from("events").insert(payload as never);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Evento guardado.");
    onSaved();
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
    const { error: updateError } = await supabase
      .from("events")
      .update({ [column]: path } as never)
      .eq("id", event.id);
    setUploading(null);
    if (updateError) {
      toast.error(updateError.message);
      return;
    }
    toast.success(kind === "cover" ? "Foto de capa atualizada." : "Música atualizada.");
    onSaved();
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
                <div key={id} className={f.kind === "textarea" ? "space-y-2 sm:col-span-2" : "space-y-2"}>
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
                      <TemplatePicker value={values.template || "golden-classic"} onChange={(value) => set("template", value)} />
                    </div>
                  ) : (
                    <Input
                      id={id}
                      type={f.kind === "date" ? "date" : f.kind === "datetime" ? "datetime-local" : "text"}
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
            <SelectNative value={values.seal_enabled ?? ""} onChange={(v) => set("seal_enabled", v)} options={[
              ["true", "Sim"],
              ["false", "Não"],
            ]} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seal-mode">Quantidade</Label>
            <SelectNative value={values.seal_mode ?? ""} onChange={(v) => set("seal_mode", v)} options={[
              ["one", "1 selo"],
              ["two", "2 selos"],
            ]} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="seal-one-text">Selo 1</Label><Input id="seal-one-text" value={values.seal_one_text ?? ""} onChange={(e) => set("seal_one_text", e.target.value)} placeholder="Ex.: 1" /></div>
          <div className="space-y-2"><Label htmlFor="seal-two-text">Selo 2</Label><Input id="seal-two-text" value={values.seal_two_text ?? ""} onChange={(e) => set("seal_two_text", e.target.value)} placeholder="Ex.: 2" /></div>
          <div className="space-y-2"><Label htmlFor="seal-one-label">Etiqueta 1</Label><Input id="seal-one-label" value={values.seal_one_label ?? ""} onChange={(e) => set("seal_one_label", e.target.value)} placeholder="Convite válido" /></div>
          <div className="space-y-2"><Label htmlFor="seal-two-label">Etiqueta 2</Label><Input id="seal-two-label" value={values.seal_two_label ?? ""} onChange={(e) => set("seal_two_label", e.target.value)} placeholder="Convite válido" /></div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">Os selos podem ser usados para convites individuais, de casal ou para a versão tradicional/Xiguiane.</p>
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
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Guarde o evento primeiro para poder enviar a foto de capa e a música.
          </p>
        )}
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          Guardar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
