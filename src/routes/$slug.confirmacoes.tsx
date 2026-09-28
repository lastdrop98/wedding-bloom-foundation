import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

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
      { name: "description", content: "Painel do casal com as confirmações de presença em tempo real." },
      { property: "og:title", content: "Confirmações de presença — Solar Eclipse" },
      { property: "og:description", content: "Painel do casal com as confirmações de presença em tempo real." },
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
      const { data, error } = await supabase.rpc("get_couple_rsvps", { _token: acesso! });
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="eyebrow">Painel privado</p>
        <h1 className="text-3xl font-light">Acesso reservado ao casal</h1>
        <p className="max-w-md font-sans text-sm text-muted-foreground">
          Use o link privado entregue pela Solar Eclipse para consultar as confirmações.
        </p>
      </div>
    );
  }

  const yes = rsvps.filter((r) => r.attending);
  const no = rsvps.filter((r) => !r.attending);
  const people = yes.reduce((sum, r) => sum + (r.guest_count || 0), 0);

  const stats = [
    { label: "Respostas", value: rsvps.length },
    { label: "Vão", value: yes.length },
    { label: "Não vão", value: no.length },
    { label: "Pessoas confirmadas", value: people },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-14">
      <p className="eyebrow">Painel do casal</p>
      <h1 className="mt-2 text-3xl font-light">{eventTitle(event)}</h1>
      <p className="mt-2 font-sans text-sm text-muted-foreground">
        {formatDatePt(event.event_date)} · atualiza automaticamente quando chegam novas confirmações
      </p>

      <span className="gold-rule mt-8" />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border border-border bg-card px-4 py-5 text-center">
            <p className="text-3xl font-light text-primary">{s.value}</p>
            <p className="mt-1 font-sans text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-light">Confirmações</h2>
      {rsvps.length === 0 ? (
        <p className="mt-4 font-sans text-sm text-muted-foreground">Ainda não há confirmações.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rsvps.map((r) => (
            <li key={r.id} className="rounded-md border border-border bg-card px-5 py-4">
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
    </main>
  );
}
