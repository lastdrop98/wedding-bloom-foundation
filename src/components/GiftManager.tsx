import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { GALLERY_BUCKET, signedUrl, type GiftItem } from "@/lib/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function GiftThumb({ path }: { path: string | null }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    if (!path) return;
    signedUrl(GALLERY_BUCKET, path).then((u) => {
      if (active) setUrl(u);
    });
    return () => {
      active = false;
    };
  }, [path]);

  return url ? (
    <img src={url} alt="Presente" className="h-16 w-16 shrink-0 rounded-md object-cover" />
  ) : (
    <div className="h-16 w-16 shrink-0 rounded-md border border-border" />
  );
}

export function GiftManager({ eventId }: { eventId: string }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ title: "", description: "", link: "" });
  const key = ["admin-gifts", eventId];

  const { data: items, isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gifts")
        .select("*")
        .eq("event_id", eventId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: key });

  const add = useMutation({
    mutationFn: async () => {
      let imagePath: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop() ?? "bin";
        const path = `${eventId}/gift-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(GALLERY_BUCKET)
          .upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        imagePath = path;
      }
      const { error } = await supabase.from("gifts").insert({
        event_id: eventId,
        title: title.trim(),
        description: description.trim() || null,
        link_or_info: link.trim() || null,
        image_path: imagePath,
        sort_order: (items?.length ?? 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setLink("");
      setFile(null);
      setFileKey((k) => k + 1);
      toast.success("Presente adicionado.");
      void refresh();
    },
    onError: () => toast.error("Não foi possível adicionar o presente."),
  });

  const remove = useMutation({
    mutationFn: async (item: GiftItem) => {
      const { error } = await supabase.from("gifts").delete().eq("id", item.id);
      if (error) throw error;
      if (item.image_path) await supabase.storage.from(GALLERY_BUCKET).remove([item.image_path]);
    },
    onSuccess: () => {
      toast.success("Presente removido.");
      void refresh();
    },
    onError: () => toast.error("Não foi possível remover o presente."),
  });

  const update = useMutation({
    mutationFn: async (payload: {
      id: string;
      title?: string;
      description?: string | null;
      link_or_info?: string | null;
    }) => {
      const { id, ...rest } = payload;
      const { error } = await supabase.from("gifts").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Presente atualizado.");
      void refresh();
    },
    onError: () => toast.error("Não foi possível guardar a alteração."),
  });

  function startEdit(item: GiftItem) {
    setEditingId(item.id);
    setEditValues({
      title: item.title,
      description: item.description ?? "",
      link: item.link_or_info ?? "",
    });
  }

  function saveEdit() {
    if (!editingId || !editValues.title.trim()) return;
    update.mutate({
      id: editingId,
      title: editValues.title.trim(),
      description: editValues.description.trim() || null,
      link_or_info: editValues.link.trim() || null,
    });
    setEditingId(null);
  }

  async function replacePhoto(item: GiftItem, newFile: File) {
    const ext = newFile.name.split(".").pop() ?? "bin";
    const path = `${eventId}/gift-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(path, newFile, { upsert: true });
    if (uploadError) {
      toast.error("Não foi possível enviar a foto.");
      return;
    }
    const { error } = await supabase.from("gifts").update({ image_path: path }).eq("id", item.id);
    if (error) {
      toast.error("Não foi possível guardar a foto.");
      return;
    }
    toast.success("Foto atualizada.");
    void refresh();
  }

  return (
    <section className="space-y-4">
      <p className="eyebrow">Lista de Presentes</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gift-title">Título</Label>
          <Input id="gift-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gift-link">Link ou informação (opcional)</Label>
          <Input id="gift-link" value={link} onChange={(e) => setLink(e.target.value)} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="gift-description">Descrição (opcional)</Label>
          <Textarea
            id="gift-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gift-file">Foto (opcional)</Label>
          <Input
            key={fileKey}
            id="gift-file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            disabled={!title.trim() || add.isPending}
            onClick={() => add.mutate()}
          >
            {add.isPending ? "A guardar…" : "Adicionar presente"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">A carregar presentes…</p>
      ) : !items?.length ? (
        <p className="text-sm text-muted-foreground">Ainda não há presentes na lista.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-md border border-border px-4 py-3"
            >
              <GiftThumb path={item.image_path} />
              {editingId === item.id ? (
                <div className="min-w-60 flex-1 space-y-3">
                  <Input
                    value={editValues.title}
                    onChange={(e) => setEditValues((v) => ({ ...v, title: e.target.value }))}
                    placeholder="Título"
                  />
                  <Textarea
                    rows={2}
                    value={editValues.description}
                    onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))}
                    placeholder="Descrição"
                  />
                  <Input
                    value={editValues.link}
                    onChange={(e) => setEditValues((v) => ({ ...v, link: e.target.value }))}
                    placeholder="Link ou informação"
                  />
                  <div className="flex gap-2">
                    <Button type="button" size="sm" onClick={saveEdit} disabled={update.isPending}>
                      Guardar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-w-40 flex-1">
                  <p>{item.title}</p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                  {item.link_or_info && (
                    <p className="text-xs break-words text-muted-foreground">{item.link_or_info}</p>
                  )}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer rounded-md border border-border px-3 py-1.5 text-sm">
                  Foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void replacePhoto(item, f);
                    }}
                  />
                </label>
                <Button type="button" variant="outline" size="sm" onClick={() => startEdit(item)}>
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove.mutate(item)}
                  disabled={remove.isPending}
                >
                  Remover
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
