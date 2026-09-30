import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { GALLERY_BUCKET, signedUrl, type GalleryItem } from "@/lib/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function isVideoFile(file: File) {
  if (file.type.startsWith("video/")) return true;
  return /\.(mp4|mov|webm|m4v|avi|mkv)$/i.test(file.name);
}

function Thumb({ item }: { item: GalleryItem }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    if (item.media_type === "video") return;
    signedUrl(GALLERY_BUCKET, item.image_path).then((u) => {
      if (active) setUrl(u);
    });
    return () => {
      active = false;
    };
  }, [item.image_path, item.media_type]);

  if (item.media_type === "video") {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-border text-xs tracking-widest text-muted-foreground uppercase">
        Vídeo
      </div>
    );
  }
  return url ? (
    <img
      src={url}
      alt={item.caption ?? "Item da galeria"}
      className="h-16 w-16 shrink-0 rounded-md object-cover"
    />
  ) : (
    <div className="h-16 w-16 shrink-0 rounded-md border border-border" />
  );
}

export function GalleryManager({ eventId }: { eventId: string }) {
  const queryClient = useQueryClient();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const key = ["admin-gallery", eventId];

  const { data: items, isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery")
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
      if (!file) throw new Error("sem ficheiro");
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${eventId}/gallery-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(GALLERY_BUCKET)
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const nextOrder = (items?.length ?? 0) + 1;
      const { error } = await supabase.from("gallery").insert({
        event_id: eventId,
        image_path: path,
        caption: caption.trim() || null,
        media_type: isVideoFile(file) ? "video" : "image",
        sort_order: nextOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setCaption("");
      setFile(null);
      setFileKey((k) => k + 1);
      toast.success("Item adicionado à galeria.");
      void refresh();
    },
    onError: () => toast.error("Não foi possível adicionar o item."),
  });

  const remove = useMutation({
    mutationFn: async (item: GalleryItem) => {
      const { error } = await supabase.from("gallery").delete().eq("id", item.id);
      if (error) throw error;
      await supabase.storage.from(GALLERY_BUCKET).remove([item.image_path]);
    },
    onSuccess: () => {
      toast.success("Item removido.");
      void refresh();
    },
    onError: () => toast.error("Não foi possível remover o item."),
  });

  const updateItem = useMutation({
    mutationFn: async (payload: { id: string; caption?: string | null; sort_order?: number }) => {
      const { id, ...rest } = payload;
      const { error } = await supabase.from("gallery").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void refresh(),
    onError: () => toast.error("Não foi possível guardar a alteração."),
  });

  async function move(index: number, direction: -1 | 1) {
    if (!items) return;
    const current = items[index];
    const other = items[index + direction];
    if (!current || !other) return;
    await Promise.all([
      supabase.from("gallery").update({ sort_order: other.sort_order }).eq("id", current.id),
      supabase.from("gallery").update({ sort_order: current.sort_order }).eq("id", other.id),
    ]);
    void refresh();
  }

  function startCaptionEdit(item: GalleryItem) {
    setEditingId(item.id);
    setEditCaption(item.caption ?? "");
  }

  function saveCaption() {
    if (!editingId) return;
    updateItem.mutate({ id: editingId, caption: editCaption.trim() || null });
    setEditingId(null);
  }

  return (
    <section className="space-y-4">
      <p className="eyebrow">Galeria (fotos e vídeos)</p>

      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="gallery-file">Ficheiro</Label>
          <Input
            key={fileKey}
            id="gallery-file"
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gallery-caption">Legenda (opcional)</Label>
          <Input
            id="gallery-caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <Button type="button" disabled={!file || add.isPending} onClick={() => add.mutate()}>
          {add.isPending ? "A enviar…" : "Adicionar"}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">A carregar galeria…</p>
      ) : !items?.length ? (
        <p className="text-sm text-muted-foreground">Ainda não há itens na galeria.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-md border border-border px-4 py-3"
            >
              <Thumb item={item} />
              <div className="min-w-40 flex-1">
                {editingId === item.id ? (
                  <div className="flex flex-wrap gap-2">
                    <Input
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      placeholder="Legenda"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={saveCaption}
                      disabled={updateItem.isPending}
                    >
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
                ) : (
                  <>
                    <p className="text-sm">{item.caption || "Sem legenda"}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.media_type === "video" ? "Vídeo" : "Foto"} · ordem {index + 1}
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => void move(index, -1)}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={index === items.length - 1}
                  onClick={() => void move(index, 1)}
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => startCaptionEdit(item)}
                >
                  Legenda
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
