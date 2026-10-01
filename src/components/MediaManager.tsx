import { looseDb } from "@/lib/event";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { AUDIO_BUCKET, GALLERY_BUCKET, details, signedUrl, type EventRow } from "@/lib/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type MediaSlot =
  | "cover"
  | "groom"
  | "bride"
  | "section_1"
  | "section_2"
  | "background"
  | "cover_video"
  | "story_video";

type MediaItem = {
  id: string;
  event_id: string;
  slot: MediaSlot;
  media_type: "image" | "video";
  storage_path: string;
  caption: string | null;
  sort_order: number;
};

const IMAGE_SLOTS: { value: MediaSlot; label: string; hint: string }[] = [
  { value: "cover", label: "Capa principal", hint: "Imagem de abertura do convite." },
  { value: "groom", label: "Foto do noivo", hint: "Retrato ou fotografia individual." },
  { value: "bride", label: "Foto da noiva", hint: "Retrato ou fotografia individual." },
  { value: "section_1", label: "Imagem de secção 1", hint: "Ex.: história do casal." },
  { value: "section_2", label: "Imagem de secção 2", hint: "Ex.: família, cerimónia ou receção." },
  { value: "background", label: "Fundo", hint: "Imagem de fundo para uma secção ou template." },
];

const VIDEO_SLOTS: { value: MediaSlot; label: string; hint: string }[] = [
  {
    value: "cover_video",
    label: "Vídeo de abertura",
    hint: "Vídeo curto usado na capa quando o template suportar.",
  },
  { value: "story_video", label: "Vídeo da história", hint: "Vídeo especial dentro do convite." },
];

function SlotPreview({ item }: { item: MediaItem }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    signedUrl(GALLERY_BUCKET, item.storage_path).then((next) => {
      if (active) setUrl(next);
    });
    return () => {
      active = false;
    };
  }, [item.storage_path]);

  if (item.media_type === "video") {
    return url ? (
      <video
        src={url}
        className="h-24 w-32 rounded-md object-cover"
        muted
        playsInline
        preload="metadata"
      />
    ) : (
      <div className="flex h-24 w-32 items-center justify-center rounded-md border border-border text-xs text-muted-foreground">
        Vídeo
      </div>
    );
  }

  return url ? (
    <img
      src={url}
      alt={item.caption ?? "Media do convite"}
      className="h-24 w-32 rounded-md object-cover"
    />
  ) : (
    <div className="h-24 w-32 rounded-md border border-border" />
  );
}

export function MediaManager({ event }: { event: EventRow }) {
  const queryClient = useQueryClient();
  const [fileBySlot, setFileBySlot] = useState<Record<string, File | null>>({});
  const [captionBySlot, setCaptionBySlot] = useState<Record<string, string>>({});
  const [orderBySlot, setOrderBySlot] = useState<Record<string, string>>({});
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [musicTitle, setMusicTitle] = useState(() => details(event).music_title ?? "");
  const [musicEnabled, setMusicEnabled] = useState(Boolean(event.music_path));

  const key = ["admin-event-media", event.id];

  const { data: media, isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await looseDb
        .from("event_media")
        .select("*")
        .eq("event_id", event.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as MediaItem[];
    },
  });

  const uploadSlot = useMutation({
    mutationFn: async ({ slot, file }: { slot: MediaSlot; file: File }) => {
      const mediaType = file.type.startsWith("video/") ? "video" : "image";
      const expectsVideo = slot.includes("video");
      if (expectsVideo && mediaType !== "video")
        throw new Error("Escolha um vídeo para este campo.");
      if (!expectsVideo && mediaType !== "image")
        throw new Error("Escolha uma imagem para este campo.");

      const ext = file.name.split(".").pop() ?? (mediaType === "video" ? "mp4" : "jpg");
      const path = event.id + "/slots/" + slot + "-" + Date.now() + "." + ext;
      const { error: uploadError } = await supabase.storage
        .from(GALLERY_BUCKET)
        .upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;

      const existing = media?.find((item) => item.slot === slot);
      const order = Number(orderBySlot[slot] ?? existing?.sort_order ?? (media?.length ?? 0) + 1);
      const { error: upsertError } = await looseDb.from("event_media").upsert(
        {
          event_id: event.id,
          slot,
          media_type: mediaType,
          storage_path: path,
          caption: captionBySlot[slot]?.trim() || null,
          sort_order: Number.isFinite(order) ? order : 1,
        },
        { onConflict: "event_id,slot" },
      );
      if (upsertError) {
        await supabase.storage.from(GALLERY_BUCKET).remove([path]);
        throw upsertError;
      }

      if (slot === "cover") {
        const { error: coverError } = await supabase
          .from("events")
          .update({ cover_image_path: path })
          .eq("id", event.id);
        if (coverError) throw coverError;
      }
      if (existing?.storage_path && existing.storage_path !== path) {
        await supabase.storage.from(GALLERY_BUCKET).remove([existing.storage_path]);
      }
    },
    onSuccess: (_, variables) => {
      setFileBySlot((current) => ({ ...current, [variables.slot]: null }));
      void queryClient.invalidateQueries({ queryKey: key });
      toast.success("Media atualizada.");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar a media."),
  });

  const updateSlot = useMutation({
    mutationFn: async ({
      item,
      caption,
      sortOrder,
    }: {
      item: MediaItem;
      caption: string;
      sortOrder: number;
    }) => {
      const { error } = await looseDb
        .from("event_media")
        .update({ caption: caption.trim() || null, sort_order: sortOrder })
        .eq("id", item.id)
        .eq("event_id", event.id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: key });
      toast.success("Posição atualizada.");
    },
    onError: () => toast.error("Não foi possível atualizar a posição."),
  });

  const removeSlot = useMutation({
    mutationFn: async (item: MediaItem) => {
      const { error } = await looseDb
        .from("event_media")
        .delete()
        .eq("id", item.id)
        .eq("event_id", event.id);
      if (error) throw error;
      if (item.slot === "cover") {
        const { error: coverError } = await supabase
          .from("events")
          .update({ cover_image_path: null })
          .eq("id", event.id);
        if (coverError) throw coverError;
      }
      await supabase.storage.from(GALLERY_BUCKET).remove([item.storage_path]);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: key });
      toast.success("Media removida.");
    },
    onError: () => toast.error("Não foi possível remover a media."),
  });

  const saveMusic = useMutation({
    mutationFn: async () => {
      let musicPath = event.music_path;
      const previousPath = event.music_path;

      if (musicFile) {
        const ext = musicFile.name.split(".").pop() ?? "mp3";
        musicPath = event.id + "/music-" + Date.now() + "." + ext;
        const { error } = await supabase.storage
          .from(AUDIO_BUCKET)
          .upload(musicPath, musicFile, { upsert: false });
        if (error) throw error;
      }

      const currentDetails = details(event);
      const { error } = await supabase
        .from("events")
        .update({
          music_path: musicEnabled ? musicPath : null,
          details: { ...currentDetails, music_title: musicTitle.trim() || null },
        })
        .eq("id", event.id);
      if (error) throw error;

      if (previousPath && previousPath !== musicPath) {
        await supabase.storage.from(AUDIO_BUCKET).remove([previousPath]);
      }
    },
    onSuccess: () => {
      setMusicFile(null);
      toast.success(musicEnabled ? "Música guardada." : "Música desativada.");
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Não foi possível guardar a música."),
  });

  const renderSlot = (
    definition: { value: MediaSlot; label: string; hint: string },
    accept: string,
  ) => {
    const item = media?.find((entry) => entry.slot === definition.value);
    const file = fileBySlot[definition.value] ?? null;
    const order = orderBySlot[definition.value] ?? String(item?.sort_order ?? "");

    return (
      <div key={definition.value} className="space-y-3 rounded-lg border border-border p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-medium">{definition.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{definition.hint}</p>
          </div>
          {item && <SlotPreview item={item} />}
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_110px_auto] sm:items-end">
          <div className="space-y-2">
            <Label>Substituir ficheiro</Label>
            <Input
              type="file"
              accept={accept}
              onChange={(e) =>
                setFileBySlot((current) => ({
                  ...current,
                  [definition.value]: e.target.files?.[0] ?? null,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Legenda opcional</Label>
            <Input
              value={captionBySlot[definition.value] ?? item?.caption ?? ""}
              onChange={(e) =>
                setCaptionBySlot((current) => ({ ...current, [definition.value]: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Ordem</Label>
            <Input
              type="number"
              min={0}
              value={order}
              onChange={(e) =>
                setOrderBySlot((current) => ({ ...current, [definition.value]: e.target.value }))
              }
            />
          </div>
          <Button
            type="button"
            disabled={!file || uploadSlot.isPending}
            onClick={() => file && uploadSlot.mutate({ slot: definition.value, file })}
          >
            {uploadSlot.isPending ? "A enviar…" : item ? "Substituir" : "Adicionar"}
          </Button>
        </div>

        {item && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={updateSlot.isPending}
              onClick={() =>
                updateSlot.mutate({
                  item,
                  caption: captionBySlot[definition.value] ?? item.caption ?? "",
                  sortOrder: Math.max(0, Number(order) || 0),
                })
              }
            >
              Guardar legenda/ordem
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeSlot.mutate(item)}
              disabled={removeSlot.isPending}
            >
              Remover este media
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="space-y-8">
      <div>
        <p className="eyebrow">Editor de media</p>
        <h3 className="mt-2 text-2xl font-light">Imagens, vídeos e música</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Cada posição tem uma função própria. O conteúdo fica ligado ao evento, não ao template,
          para que possa trocar o design sem perder as fotografias e vídeos.
        </p>
      </div>

      <div className="space-y-4">
        <p className="eyebrow">Fotografias</p>
        {IMAGE_SLOTS.map((slot) => renderSlot(slot, "image/*"))}
      </div>

      <div className="space-y-4">
        <p className="eyebrow">Vídeos</p>
        {VIDEO_SLOTS.map((slot) => renderSlot(slot, "video/*"))}
      </div>

      <div className="space-y-4 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">Música de fundo</p>
            <p className="mt-1 text-xs text-muted-foreground">
              O navegador pode exigir uma interação do convidado antes de iniciar o áudio.
            </p>
          </div>
          <Switch checked={musicEnabled} onCheckedChange={setMusicEnabled} />
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-2">
            <Label>Substituir música</Label>
            <Input
              type="file"
              accept="audio/*"
              onChange={(e) => setMusicFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button type="button" onClick={() => saveMusic.mutate()} disabled={saveMusic.isPending}>
            {saveMusic.isPending ? "A guardar…" : "Guardar música"}
          </Button>
        </div>
        <Input
          placeholder="Título da música (opcional)"
          value={musicTitle}
          onChange={(e) => setMusicTitle(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {event.music_path
            ? "Existe uma música configurada."
            : "Ainda não existe música configurada."}
          {musicTitle ? " — " + musicTitle : ""}
        </p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">A carregar media…</p>}
    </section>
  );
}
