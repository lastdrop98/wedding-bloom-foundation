import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "text-muted-foreground" },
  sim: { label: "Confirmado", className: "text-emerald-500" },
  nao: { label: "Não vai", className: "text-red-500" },
};

export function GuestManager({ eventId, slug }: { eventId: string; slug: string }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [count, setCount] = useState("1");

  const { data: guests, isLoading } = useQuery({
    queryKey: ["guests", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("guests").insert({
        event_id: eventId,
        name: name.trim(),
        invited_count: Math.max(1, Number(count) || 1),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      setCount("1");
      toast.success("Convidado adicionado.");
      void queryClient.invalidateQueries({ queryKey: ["guests", eventId] });
    },
    onError: () => toast.error("Não foi possível adicionar o convidado."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("guests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Convidado removido.");
      void queryClient.invalidateQueries({ queryKey: ["guests", eventId] });
    },
    onError: () => toast.error("Não foi possível remover o convidado."),
  });

  async function copyLink(token: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}/${slug}?g=${token}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link pessoal copiado.");
    } catch {
      toast.error(link);
    }
  }

  return (
    <section className="space-y-4">
      <p className="eyebrow">Convidados</p>

      <div className="grid gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="guest-name">Nome</Label>
          <Input
            id="guest-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do convidado"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guest-count">Número de convidados</Label>
          <Input
            id="guest-count"
            type="number"
            min={1}
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
        <Button
          type="button"
          disabled={!name.trim() || add.isPending}
          onClick={() => add.mutate()}
        >
          Adicionar
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">A carregar convidados…</p>
      ) : !guests?.length ? (
        <p className="text-sm text-muted-foreground">Ainda não há convidados.</p>
      ) : (
        <ul className="space-y-2">
          {guests.map((g) => {
            const status = STATUS[g.rsvp_status] ?? STATUS["pending"]!;
            return (
              <li
                key={g.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border px-4 py-3"
              >
                <div>
                  <p>{g.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {g.invited_count} convidado(s) ·{" "}
                    <span className={status.className}>{status.label}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => copyLink(g.token)}>
                    Copiar link
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove.mutate(g.id)}
                    disabled={remove.isPending}
                  >
                    Remover
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
