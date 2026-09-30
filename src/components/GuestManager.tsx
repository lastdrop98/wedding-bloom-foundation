import { useMemo, useState } from "react";
import { Download, MessageCircle, Pencil, Trash2 } from "lucide-react";
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
  const normalized = digits.startsWith("258")
    ? digits
    : digits.startsWith("0")
      ? "258" + digits.slice(1)
      : "258" + digits;
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
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const totals = useMemo(() => {
    const rows = guests ?? [];
    return {
      guests: rows.length,
      invited: rows.reduce((sum, g) => sum + (g.invited_count || 0), 0),
      confirmed: rows.filter((g) => g.rsvp_status === "sim").length,
      pending: rows.filter((g) => g.rsvp_status === "pending").length,
    };
  }, [guests]);

  const resetForm = () => {
    setName("");
    setCount("1");
    setPhone("");
    setInviteType("individual");
    setTableLabel("");
    setEditingId(null);
  };

  const save = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("O nome é obrigatório.");
      const payload = {
        name: name.trim(),
        invited_count: Math.max(1, Number(count) || 1),
        phone: phone.trim() || null,
        invite_type: inviteType,
        table_label: tableLabel.trim() || null,
      };
      if (editingId) {
        const { error } = await supabase
          .from("guests")
          .update(payload)
          .eq("id", editingId)
          .eq("event_id", eventId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("guests").insert({ ...payload, event_id: eventId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      resetForm();
      toast.success(editingId ? "Convidado atualizado." : "Convidado adicionado.");
      void queryClient.invalidateQueries({ queryKey: ["guests", eventId] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Não foi possível guardar o convidado."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("guests").delete().eq("id", id).eq("event_id", eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Convidado removido.");
      void queryClient.invalidateQueries({ queryKey: ["guests", eventId] });
    },
    onError: () => toast.error("Não foi possível remover o convidado."),
  });

  function editGuest(g: NonNullable<typeof guests>[number]) {
    setEditingId(g.id);
    setName(g.name);
    setCount(String(g.invited_count || 1));
    setPhone(g.phone ?? "");
    setInviteType(g.invite_type || "individual");
    setTableLabel(g.table_label ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

  function exportCsv() {
    const rows = guests ?? [];
    if (!rows.length) {
      toast.error("Ainda não há convidados para exportar.");
      return;
    }
    const header = ["Nome", "Telefone", "Convidados", "Tipo", "Mesa", "Estado", "Link"];
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const csvRows = rows.map((g) => [
      g.name,
      g.phone ?? "",
      String(g.invited_count ?? 1),
      g.invite_type === "casal" ? "Casal" : "Individual",
      g.table_label ?? "",
      STATUS[g.rsvp_status]?.label ?? g.rsvp_status,
      `${origin}/${slug}?g=${g.token}`,
    ]);
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [header, ...csvRows].map((row) => row.map(escape).join(";")).join("\\r\\n");
    const blob = new Blob(["\\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `convidados-${slug}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Lista de convidados exportada.");
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Convidados</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Links personalizados, WhatsApp, mesas e estado de confirmação num só lugar.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
          <Download className="mr-2 size-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Convidados", totals.guests],
          ["Lugares", totals.invited],
          ["Confirmados", totals.confirmed],
          ["Pendentes", totals.pending],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-border bg-background/40 px-4 py-4">
            <p className="text-2xl font-light text-primary">{value}</p>
            <p className="mt-1 font-sans text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 rounded-xl border border-border bg-background/40 p-5 sm:grid-cols-2 lg:grid-cols-4">
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
          <Label htmlFor="guest-phone">Telefone</Label>
          <Input
            id="guest-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+258 …"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guest-count">Convidados</Label>
          <Input
            id="guest-count"
            type="number"
            min={1}
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guest-type">Tipo</Label>
          <select
            id="guest-type"
            value={inviteType}
            onChange={(e) => setInviteType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="individual">Individual</option>
            <option value="casal">Casal</option>
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="guest-table">Mesa</Label>
          <Input
            id="guest-table"
            value={tableLabel}
            onChange={(e) => setTableLabel(e.target.value)}
            placeholder="Mesa 4 / Família Silva"
          />
        </div>
        <div className="flex items-end gap-2 sm:col-span-2">
          <Button
            type="button"
            disabled={!name.trim() || save.isPending}
            onClick={() => save.mutate()}
          >
            {save.isPending ? "A guardar…" : editingId ? "Guardar alterações" : "Adicionar convidado"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar edição
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">A carregar convidados…</p>
      ) : !guests?.length ? (
        <p className="text-sm text-muted-foreground">Ainda não há convidados.</p>
      ) : (
        <ul className="space-y-2">
          {guests.map((g) => {
            const status = STATUS[g.rsvp_status] ?? STATUS.pending;
            const origin = typeof window !== "undefined" ? window.location.origin : "";
            const link = `${origin}/${slug}?g=${g.token}`;
            return (
              <li
                key={g.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/30 px-4 py-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base">{g.name}</p>
                    <span className={`rounded-full border border-border px-2 py-0.5 font-sans text-[0.55rem] tracking-[0.12em] uppercase ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {g.invited_count} convidado(s) · {g.invite_type === "casal" ? "casal" : "individual"} ·{" "}
                    {g.table_label || "sem mesa"}
                  </p>
                  {g.phone && <p className="mt-1 text-xs text-muted-foreground">{g.phone}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => editGuest(g)}>
                    <Pencil className="mr-2 size-3.5" />
                    Editar
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => copyLink(g.token)}>
                    Copiar link
                  </Button>
                  {g.phone && (
                    <Button type="button" variant="outline" size="sm" asChild>
                      <a href={guestWhatsAppUrl(g.phone, link, g.name)} target="_blank" rel="noreferrer">
                        <MessageCircle className="mr-2 size-3.5" />
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
                    aria-label={`Remover ${g.name}`}
                  >
                    <Trash2 className="size-4" />
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
