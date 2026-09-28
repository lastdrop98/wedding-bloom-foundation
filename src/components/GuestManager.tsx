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

function guestWhatsAppUrl(phone: string, link: string, name: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("258") ? digits : digits.startsWith("0") ? "258" + digits.slice(1) : "258" + digits;
  const message = `Olá ${name}! Aqui está o seu convite digital: ${link}`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function GuestManager({ eventId, slug }: { eventId: string; slug: string }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [count, setCount] = useState("1");
  const [phone, setPhone] = useState("");
  const [inviteType, setInviteType] = useState("individual");
  const [tableLabel, setTableLabel] = useState("");

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
        phone: phone.trim() || null,
        invite_type: inviteType,
        table_label: tableLabel.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setName("");
      setCount("1");
      setPhone("");
      setInviteType("individual");
      setTableLabel("");
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

      <div className="grid gap-3 rounded-xl border border-border bg-background/40 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2"><Label htmlFor="guest-name">Nome</Label><Input id="guest-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do convidado" /></div>
        <div className="space-y-2"><Label htmlFor="guest-phone">Telefone</Label><Input id="guest-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+258 …" /></div>
        <div className="space-y-2"><Label htmlFor="guest-count">Convidados</Label><Input id="guest-count" type="number" min={1} value={count} onChange={(e) => setCount(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="guest-type">Tipo</Label><select id="guest-type" value={inviteType} onChange={(e) => setInviteType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="individual">Individual</option><option value="casal">Casal</option></select></div>
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="guest-table">Mesa</Label><Input id="guest-table" value={tableLabel} onChange={(e) => setTableLabel(e.target.value)} placeholder="Mesa 4 / Família Silva" /></div>
        <div className="flex items-end sm:col-span-2"><Button type="button" disabled={!name.trim() || add.isPending} onClick={() => add.mutate()}>{add.isPending ? "A adicionar…" : "Adicionar convidado"}</Button></div>
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
                    {g.invited_count} convidado(s) · {g.invite_type === "casal" ? "casal" : "individual"} · {g.table_label || "sem mesa"} ·{" "}
                    <span className={status.className}>{status.label}</span>
                  </p>
                  {g.phone && <p className="text-xs text-muted-foreground">{g.phone}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => copyLink(g.token)}>
                    Copiar link
                  </Button>
                  {g.phone && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={guestWhatsAppUrl(
                          g.phone,
                          `${typeof window !== "undefined" ? window.location.origin : ""}/${slug}?g=${g.token}`,
                          g.name,
                        )}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp
                      </a>
                    </Button>
                  )}
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
