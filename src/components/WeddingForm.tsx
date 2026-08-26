import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { AUDIO_BUCKET, GALLERY_BUCKET, type Wedding } from "@/lib/wedding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FieldKind = "text" | "date" | "datetime" | "textarea";

const GROUPS: { title: string; fields: { name: keyof Wedding; label: string; kind?: FieldKind }[] }[] =
  [
    {
      title: "Identificação",
      fields: [
        { name: "slug", label: "Slug (endereço na URL)" },
        { name: "template", label: "Template" },
        { name: "groom_name", label: "Nome do noivo" },
        { name: "bride_name", label: "Nome da noiva" },
        { name: "display_names", label: "Nomes a mostrar" },
        { name: "wedding_date", label: "Data e hora do casamento", kind: "datetime" },
        { name: "hashtag", label: "Hashtag" },
      ],
    },
    {
      title: "Pais",
      fields: [
        { name: "groom_father_name", label: "Pai do noivo" },
        { name: "groom_mother_name", label: "Mãe do noivo" },
        { name: "bride_father_name", label: "Pai da noiva" },
        { name: "bride_mother_name", label: "Mãe da noiva" },
      ],
    },
    {
      title: "Cerimónia",
      fields: [
        { name: "ceremony_venue", label: "Local" },
        { name: "ceremony_address", label: "Morada" },
        { name: "ceremony_time", label: "Hora" },
      ],
    },
    {
      title: "Cerimónia Civil (opcional)",
      fields: [
        { name: "civil_ceremony_venue", label: "Local" },
        { name: "civil_ceremony_address", label: "Morada" },
        { name: "civil_ceremony_time", label: "Hora" },
      ],
    },
    {
      title: "Receção",
      fields: [
        { name: "reception_venue", label: "Local" },
        { name: "reception_address", label: "Morada" },
        { name: "reception_time", label: "Hora" },
      ],
    },
    {
      title: "Confirmações e presentes",
      fields: [
        { name: "rsvp_deadline", label: "Prazo de confirmação", kind: "date" },
        { name: "bank_holder", label: "Titular da conta" },
        { name: "bank_name", label: "Banco" },
        { name: "bank_account", label: "Conta" },
        { name: "bank_nib", label: "NIB / IBAN" },
      ],
    },
    {
      title: "Contactos",
      fields: [
        { name: "contact_1_name", label: "Contacto 1 — nome" },
        { name: "contact_1_phone", label: "Contacto 1 — telefone" },
        { name: "contact_2_name", label: "Contacto 2 — nome" },
        { name: "contact_2_phone", label: "Contacto 2 — telefone" },
      ],
    },
    {
      title: "Versículos (opcional)",
      fields: [
        { name: "verse_text", label: "Versículo 1", kind: "textarea" },
        { name: "verse_reference", label: "Referência 1" },
        { name: "verse_2_text", label: "Versículo 2", kind: "textarea" },
        { name: "verse_2_reference", label: "Referência 2" },
      ],
    },
  ];

function toInputValue(value: unknown, kind?: FieldKind) {
  if (value == null) return "";
  if (kind === "datetime") return new Date(String(value)).toISOString().slice(0, 16);
  return String(value);
}

export function WeddingForm({
  wedding,
  onSaved,
  onCancel,
}: {
  wedding: Wedding | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = { template: "golden-classic" };
    GROUPS.forEach((g) =>
      g.fields.forEach((f) => {
        base[f.name as string] = toInputValue(wedding?.[f.name], f.kind);
      }),
    );
    if (!wedding) base["template"] = "golden-classic";
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
    const payload: Record<string, string | null> = {};
    GROUPS.forEach((g) =>
      g.fields.forEach((f) => {
        const raw = values[f.name as string] ?? "";
        payload[f.name as string] = raw === "" ? null : raw;
      }),
    );
    payload["template"] = values["template"] || "golden-classic";
    payload["slug"] = values["slug"];

    const { error } = wedding
      ? await supabase.from("weddings").update(payload).eq("id", wedding.id)
      : await supabase.from("weddings").insert(payload as never);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Casamento guardado.");
    onSaved();
  }

  async function upload(kind: "cover" | "music", file: File) {
    if (!wedding) {
      toast.error("Guarde o casamento antes de enviar ficheiros.");
      return;
    }
    setUploading(kind);
    const bucket = kind === "cover" ? GALLERY_BUCKET : AUDIO_BUCKET;
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${wedding.id}/${kind}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      setUploading(null);
      toast.error(error.message);
      return;
    }
    const column = kind === "cover" ? "cover_image_path" : "music_path";
    const { error: updateError } = await supabase
      .from("weddings")
      .update({ [column]: path })
      .eq("id", wedding.id);
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
              const id = String(f.name);
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
        {wedding ? (
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
                Atual: {wedding.cover_image_path ?? "nenhuma"}
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
                Atual: {wedding.music_path ?? "nenhuma"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Guarde o casamento primeiro para poder enviar a foto de capa e a música.
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
