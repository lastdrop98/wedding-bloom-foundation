import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { ScheduleItem } from "@/lib/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ScheduleManager({ eventId }: { eventId: string }) {
  const queryClient = useQueryClient();
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const key = ["admin-schedule", eventId];
  const { data: items = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("schedule").select("*").eq("event_id", eventId).order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ScheduleItem[];
    },
  });

  const refresh = () => void queryClient.invalidateQueries({ queryKey: key });

  const add = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("O título é obrigatório.");
      const { error } = await supabase.from("schedule").insert({
        event_id: eventId,
        time_label: time.trim() || null,
        title: title.trim(),
        description: description.trim() || null,
        sort_order: items.length,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setTime(""); setTitle(""); setDescription("");
      toast.success("Momento adicionado ao programa.");
      refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("schedule").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Momento removido."); refresh(); },
    onError: (error) => toast.error(error.message),
  });

  async function move(index: number, direction: -1 | 1) {
    const current = items[index];
    const other = items[index + direction];
    if (!current || !other) return;
    await Promise.all([
      supabase.from("schedule").update({ sort_order: other.sort_order }).eq("id", current.id),
      supabase.from("schedule").update({ sort_order: current.sort_order }).eq("id", other.id),
    ]);
    refresh();
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="eyebrow">Programa do evento</p>
        <p className="mt-1 text-sm text-muted-foreground">Cerimónia, receção, jantar, festa e outros momentos.</p>
      </div>

      <div className="grid gap-3 rounded-xl border border-border bg-background/40 p-5 sm:grid-cols-2">
        <div className="space-y-2"><Label>Hora</Label><Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="16:00" /></div>
        <div className="space-y-2"><Label>Título</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Cerimónia" /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Descrição</Label><Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Local, notas ou instruções…" /></div>
        <div className="sm:col-span-2"><Button type="button" disabled={!title.trim() || add.isPending} onClick={() => add.mutate()}>{add.isPending ? "A guardar…" : "Adicionar momento"}</Button></div>
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">A carregar programa…</p> : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border px-4 py-3">
              <div className="min-w-14 font-sans text-xs tracking-[0.15em] text-primary uppercase">{item.time_label || "—"}</div>
              <div className="min-w-40 flex-1"><p>{item.title}</p>{item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}</div>
              <div className="flex gap-1">
                <Button type="button" variant="outline" size="sm" disabled={index === 0} onClick={() => void move(index, -1)}>↑</Button>
                <Button type="button" variant="outline" size="sm" disabled={index === items.length - 1} onClick={() => void move(index, 1)}>↓</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove.mutate(item.id)}>Remover</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
