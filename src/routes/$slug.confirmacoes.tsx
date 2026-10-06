import { looseDb } from "@/lib/event";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Copy,
  ExternalLink,
  Heart,
  Link2,
  MessageCircle,
  Printer,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { whatsappUrl } from "@/lib/whatsapp";

import { supabase } from "@/integrations/supabase/client";
import { eventTitle, fetchEventBySlug, formatDatePt } from "@/lib/event";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/$slug/confirmacoes")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    acesso: typeof search["acesso"] === "string" ? search["acesso"] : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `Confirmações — ${params.slug}` },
      {
        name: "description",
        content: "Painel do casal com as confirmações de presença em tempo real.",
      },
      { property: "og:title", content: "Confirmações de presença — Solar Eclipse" },
      {
        property: "og:description",
        content: "Painel do casal com as confirmações de presença em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationsPage,
});

type Rsvp = Tables<"rsvps">;

function ConfirmationsPage() {
  const { slug } = Route.useParams();
  const { acesso } = Route.useSearch();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const e = await fetchEventBySlug(slug);
      if (!e) throw notFound();
      return e;
    },
  });

  const eventId = event?.id;
  const { data: rsvps = [] } = useQuery({
    queryKey: ["rsvps", eventId, acesso],
    enabled: !!eventId && !!acesso,
    queryFn: async () => {
      if (!acesso) return [];
      const { data, error } = await looseDb.rpc("get_couple_rsvps", { _token: acesso });
      if (error) throw error;
      return (data ?? []) as Rsvp[];
    },
  });

  useEffect(() => {
    if (!eventId || !acesso) return;
    const channel = supabase
      .channel(`rsvps-${eventId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvps", filter: `event_id=eq.${eventId}` },
        () => void queryClient.invalidateQueries({ queryKey: ["rsvps", eventId, acesso] }),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [eventId, acesso, queryClient]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans text-xs tracking-[0.3em] text-muted-foreground uppercase">
        A carregar…
      </div>
    );
  }
  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-light">Evento não encontrado</h1>
      </div>
    );
  }

  if (!acesso) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted px-6 py-16">
        <div className="w-full max-w-md border border-border bg-background px-7 py-10 text-center shadow-xl sm:px-10">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-primary/30 text-primary">
            <Heart className="size-4" />
          </div>
          <p className="eyebrow mt-6">Solar Eclipse · Painel privado</p>
          <h1 className="mt-4 text-3xl font-light">Acesso reservado ao casal</h1>
          <p className="mt-4 font-sans text-sm leading-6 text-muted-foreground">
            Use o link privado entregue pela Solar Eclipse para consultar as confirmações.
          </p>
        </div>
      </main>
    );
  }

  const yes = rsvps.filter((r) => r.attending);
  const no = rsvps.filter((r) => !r.attending);
  const people = yes.reduce((sum, r) => sum + (r.guest_count || 0), 0);

  const stats = [
    { label: "Respostas", value: rsvps.length, icon: Users },
    { label: "Vão", value: yes.length, icon: CheckCircle2 },
    { label: "Não vão", value: no.length, icon: XCircle },
    { label: "Pessoas", value: people, icon: Heart },
  ];

  const inviteLink =
    typeof window !== "undefined" ? `${window.location.origin}/${slug}` : `/${slug}`;
  const printLink =
    typeof window !== "undefined" ? `${window.location.origin}/${slug}/imprimir` : `/${slug}/imprimir`;
  const privatePanelLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}/confirmacoes?acesso=${encodeURIComponent(acesso)}`
      : `/${slug}/confirmacoes?acesso=${encodeURIComponent(acesso)}`;

  async function copyLink(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(label);
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  const shareText = [
    `Convite de ${eventTitle(event)}`,
    inviteLink,
    event.event_date ? `Data: ${formatDatePt(event.event_date)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <main className="min-h-screen bg-muted/40 pb-16">
      <header className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-full border border-primary/30 text-primary"><Heart className="size-3.5" /></span>
            <div>
              <p className="font-sans text-xs font-medium">Solar Eclipse</p>
              <p className="font-sans text-[10px] text-muted-foreground">Painel do Casal</p>
            </div>
          </div>
          <span className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">Acesso privado</span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 pt-10 sm:px-8 sm:pt-14">
        <section className="grid gap-8 border-b border-border pb-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">Visão geral</p>
            <h1 className="mt-3 text-4xl font-light sm:text-5xl">{eventTitle(event)}</h1>
            <p className="mt-4 flex items-center gap-2 font-sans text-sm text-muted-foreground">
              <CalendarDays className="size-4 text-primary" /> {formatDatePt(event.event_date) || "Data por definir"}
            </p>
          </div>
          <p className="max-w-xs font-sans text-xs leading-5 text-muted-foreground">
            Os dados são atualizados automaticamente quando chegam novas confirmações.
          </p>
        </section>

        <section aria-label="Resumo das confirmações" className="grid grid-cols-2 gap-3 py-8 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="border border-border bg-card px-4 py-5 shadow-sm">
                <div className="flex items-center justify-between"><Icon className="size-4 text-primary" /><span className="font-sans text-3xl font-light">{stat.value}</span></div>
                <p className="mt-5 font-sans text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </section>

        <section aria-label="Entrega e partilha" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a href={inviteLink} target="_blank" rel="noreferrer" className="group flex items-center justify-between border border-border bg-background px-5 py-4 font-sans text-sm transition hover:border-primary/50">
            Convite Digital <ExternalLink className="size-4 text-muted-foreground transition group-hover:text-primary" />
          </a>
          <a href={printLink} target="_blank" rel="noreferrer" className="group flex items-center justify-between border border-border bg-background px-5 py-4 font-sans text-sm transition hover:border-primary/50">
            Versão para Impressão <Printer className="size-4 text-muted-foreground transition group-hover:text-primary" />
          </a>
          <button type="button" onClick={() => void copyLink(inviteLink, "Link do convite copiado.")} className="group flex items-center justify-between border border-border bg-background px-5 py-4 text-left font-sans text-sm transition hover:border-primary/50">
            Copiar convite <Copy className="size-4 text-muted-foreground transition group-hover:text-primary" />
          </button>
          <a href={whatsappUrl(shareText)} target="_blank" rel="noreferrer" className="group flex items-center justify-between border border-primary/40 bg-background px-5 py-4 font-sans text-sm transition hover:border-primary">
            Partilhar no WhatsApp <MessageCircle className="size-4 text-primary" />
          </a>
        </section>

        <section aria-label="Links do casal" className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              <Link2 className="size-4 text-primary" />
              <p className="font-sans text-xs font-medium uppercase tracking-[0.18em]">Link público</p>
            </div>
            <p className="mt-3 break-all font-mono text-xs text-muted-foreground">{inviteLink}</p>
            <button type="button" onClick={() => void copyLink(inviteLink, "Link público copiado.")} className="mt-4 inline-flex items-center gap-2 border border-border px-3 py-2 font-sans text-xs hover:border-primary/50">
              <Copy className="size-3.5" /> Copiar
            </button>
          </div>
          <div className="border border-primary/25 bg-primary/[0.03] p-5">
            <div className="flex items-center gap-2">
              <Heart className="size-4 text-primary" />
              <p className="font-sans text-xs font-medium uppercase tracking-[0.18em]">Acesso privado</p>
            </div>
            <p className="mt-3 break-all font-mono text-xs text-muted-foreground">{privatePanelLink}</p>
            <button type="button" onClick={() => void copyLink(privatePanelLink, "Link privado do casal copiado.")} className="mt-4 inline-flex items-center gap-2 border border-primary/25 px-3 py-2 font-sans text-xs text-primary hover:border-primary/60">
              <Copy className="size-3.5" /> Copiar acesso
            </button>
          </div>
        </section>

        <section id="confirmacoes" className="scroll-mt-6 pt-12">
          <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
            <div><p className="eyebrow">Lista em tempo real</p><h2 className="mt-2 text-2xl font-light">Confirmações</h2></div>
            <span className="font-sans text-xs text-muted-foreground">{rsvps.length} respostas</span>
          </div>
      {rsvps.length === 0 ? (
        <div className="mt-4 border border-dashed border-border bg-background px-6 py-12 text-center font-sans text-sm text-muted-foreground">Ainda não há confirmações.</div>
      ) : (
        <ul className="mt-4 space-y-3">
          {rsvps.map((r) => (
            <li key={r.id} className="border border-border bg-card px-5 py-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-lg">{r.guest_name}</p>
                <span
                  className={`rounded-full border px-3 py-1 font-sans text-[0.65rem] tracking-[0.2em] uppercase ${
                    r.attending
                      ? "border-emerald-500/40 text-emerald-500"
                      : "border-red-500/40 text-red-500"
                  }`}
                >
                  {r.attending ? "Vai" : "Não vai"}
                </span>
              </div>
              <p className="mt-1 font-sans text-sm text-muted-foreground">
                {r.guest_count} pessoa(s)
                {r.guest_phone ? ` · ${r.guest_phone}` : ""} ·{" "}
                {new Date(r.created_at).toLocaleString("pt-PT", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {r.message && (
                <p className="mt-3 font-sans text-sm whitespace-pre-line italic">“{r.message}”</p>
              )}
            </li>
          ))}
        </ul>
      )}
        </section>
      </div>
    </main>
  );
}
