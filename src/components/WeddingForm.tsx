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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const TEMPLATE_OPTIONS = [
  { value: "golden-classic", label: "Noir & Ouro" },
  { value: "aquarela-botanica", label: "Aguarela Botânica" },
];

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
    title: "Versículos (opcional)",
    fields: [
      { name: "verse_text", label: "Versículo 1", kind: "textarea", scope: "details" },
      { name: "verse_reference", label: "Referência 1", scope: "details" },
      { name: "verse_2_text", label: "Versículo 2", kind: "textarea", scope: "details" },
      { name: "verse_2_reference", label: "Referência 2", scope: "details" },
    ],
  },
];

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
