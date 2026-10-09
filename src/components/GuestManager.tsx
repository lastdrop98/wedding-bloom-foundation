import { looseDb } from "@/lib/event";
import { getPublicSiteUrl } from "@/lib/publicUrl";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function guestStatus(value?: string | null) {
  return value === "sim" || value === "nao" ? value : "pending";
}

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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: guests, isLoading } = useQuery({
    queryKey: ["guests", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Array<(typeof data)[number] & { phone?: string | null; invite_type?: string | null; table_label?: string | null }>;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await looseDb.from("guests").insert({
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

  const totals = useMemo(() => {
    const rows = guests ?? [];
    return {
      total: rows.length,
      invited: rows.reduce((sum, guest) => sum + (guest.invited_count || 0), 0),
      confirmed: rows.filter((guest) => guestStatus(guest.rsvp_status) === "sim").reduce((sum, guest) => sum + (guest.invited_count || 0), 0),
      pending: rows.filter((guest) => guestStatus(guest.rsvp_status) === "pending").reduce((sum, guest) => sum + (guest.invited_count || 0), 0),
    };
  }, [guests]);

  const filteredGuests = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-PT");
    return (guests ?? []).filter((guest) => {
      const matchesSearch =
        !query ||
        guest.name.toLocaleLowerCase("pt-PT").includes(query) ||
        (guest.phone ?? "").toLocaleLowerCase("pt-PT").includes(query) ||
        (guest.table_label ?? "").toLocaleLowerCase("pt-PT").includes(query);
      const matchesStatus =
        statusFilter === "all" || guestStatus(guest.rsvp_status) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [guests, search, statusFilter]);

  function exportCsv() {
    if (!guests?.length) {
      toast.error("Ainda não há convidados para exportar.");
      return;
    }
    const origin = getPublicSiteUrl();
    const rows = [
      ["Nome", "Telefone", "Convidados", "Tipo", "Mesa", "Estado", "Link"],
      ...guests.map((g) => [
        g.name,
        g.phone ?? "",
        String(g.invited_count ?? 1),
        g.invite_type === "casal" ? "Casal" : "Individual",
        g.table_label ?? "",
        STATUS[guestStatus(g.rsvp_status)]?.label ?? g.rsvp_status,
        `${origin}/${slug}?g=${g.token}`,
      ]),
    ];
    const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = rows.map((row) => row.map(quote).join(";")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `convidados-${slug}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Lista de convidados exportada.");
  }

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
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Convidados</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Links personalizados, WhatsApp, mesas e estado de confirmação.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
          <Download className="mr-2 size-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Convidados", totals.total],
          ["Lugares", totals.invited],
          ["Confirmados", totals.confirmed],
          ["Pendentes", totals.pending],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-xl border border-border bg-background/40 px-4 py-4"
          >
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
        <div className="flex items-end sm:col-span-2">
          <Button
            type="button"
            disabled={!name.trim() || add.isPending}
            onClick={() => add.mutate()}
          >
            {add.isPending ? "A adicionar…" : "Adicionar convidado"}
          </Button>
        </div>
      </div>

      {!isLoading && guests?.length ? (
        <div className="grid gap-3 rounded-xl border border-border bg-background/40 p-4 sm:grid-cols-[1fr_180px]">
          <div className="space-y-2">
            <Label htmlFor="guest-search">Pesquisar convidados</Label>
            <Input
              id="guest-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nome, telefone ou mesa…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-status">Estado</Label>
            <select
              id="guest-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="sim">Confirmados</option>
              <option value="nao">Não vão</option>
            </select>
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            A mostrar {filteredGuests.length} de {guests.length} convidado(s).
          </p>
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">A carregar convidados…</p>
      ) : !guests?.length ? (
        <p className="text-sm text-muted-foreground">Ainda não há convidados.</p>
      ) : (
        <ul className="space-y-2">
          {filteredGuests.length ? filteredGuests.map((g) => {
            const status = STATUS[guestStatus(g.rsvp_status)] ?? STATUS["pending"]!;
            return (
              <li
                key={g.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border px-4 py-3"
              >
                <div>
                  <p>{g.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {g.invited_count} convidado(s) ·{" "}
                    {g.invite_type === "casal" ? "casal" : "individual"} ·{" "}
                    {g.table_label || "sem mesa"} ·{" "}
                    <span className={status.className}>{status.label}</span>
                  </p>
                  {g.phone && <p className="text-xs text-muted-foreground">{g.phone}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyLink(g.token)}
                  >
                    Copiar link
                  </Button>
                  {g.phone && (
                    <Button type="button" variant="outline" size="sm" asChild>
                      <a
                        href={guestWhatsAppUrl(
                          g.phone,
                          `${getPublicSiteUrl()}/${slug}?g=${g.token}`,
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
          }) : (
            <li className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhum convidado corresponde aos filtros.
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
