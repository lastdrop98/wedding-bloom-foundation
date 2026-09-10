import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import {
  EVENT_TYPES,
  eventTitle,
  eventTypeLabel,
  formatDatePt,
  type EventRow,
} from "@/lib/event";
import { WeddingForm } from "@/components/WeddingForm";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel — Solar Eclipse" },
      { name: "description", content: "Gestão de convites de eventos Solar Eclipse." },
      { property: "og:title", content: "Painel — Solar Eclipse" },
      { property: "og:description", content: "Gestão de convites de eventos Solar Eclipse." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Mode =
  | { kind: "list" }
  | { kind: "choose-type" }
  | { kind: "form"; event: EventRow | null; eventType: string };

function AdminPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>({ kind: "list" });

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function closeForm() {
    setMode({ kind: "list" });
    void queryClient.invalidateQueries({ queryKey: ["admin-events"] });
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Solar Eclipse</p>
          <h1 className="mt-2 text-3xl font-light">Painel de eventos</h1>
        </div>
        <div className="flex gap-2">
          {mode.kind === "list" && (
            <Button onClick={() => setMode({ kind: "choose-type" })}>Novo Evento</Button>
          )}
          <Button variant="outline" onClick={signOut}>
            Sair
          </Button>
        </div>
      </div>

      <span className="gold-rule mt-8" />

      {mode.kind === "choose-type" ? (
        <div className="mt-10 rounded-md border border-border bg-card p-6">
          <h2 className="text-xl font-light">Que tipo de evento?</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {EVENT_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                disabled={!t.available}
                onClick={() => setMode({ kind: "form", event: null, eventType: t.value })}
                className="rounded-md border border-border px-5 py-6 text-center transition-colors enabled:hover:border-primary enabled:hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="block text-lg">{t.label}</span>
                {!t.available && <span className="eyebrow mt-2 block">Brevemente</span>}
              </button>
            ))}
          </div>
          <Button variant="outline" className="mt-6" onClick={() => setMode({ kind: "list" })}>
            Cancelar
          </Button>
        </div>
      ) : mode.kind === "form" ? (
        <div className="mt-10 rounded-md border border-border bg-card p-6">
          <h2 className="mb-6 text-xl font-light">
            {mode.event
              ? `Editar — ${eventTitle(mode.event)}`
              : `Novo evento — ${eventTypeLabel(mode.eventType)}`}
          </h2>
          <WeddingForm
            event={mode.event}
            eventType={mode.eventType}
            onSaved={closeForm}
            onCancel={() => setMode({ kind: "list" })}
          />

          {mode.event && (
            <div className="mt-12 space-y-12 border-t border-border pt-10">
              <GalleryManager eventId={mode.event.id} />
              <GiftManager eventId={mode.event.id} />
              <GuestManager eventId={mode.event.id} slug={mode.event.slug} />
            </div>
          )}
        </div>
      ) : isLoading ? (
        <p className="mt-10 text-muted-foreground">A carregar…</p>
      ) : !events?.length ? (
        <p className="mt-10 text-muted-foreground">Ainda não existem eventos.</p>
      ) : (
        <ul className="mt-10 space-y-3">
          {events.map((e) => (
            <li
              key={e.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card px-5 py-4"
            >
              <div>
                <p className="text-lg">{eventTitle(e)}</p>
                <p className="text-sm text-muted-foreground">
                  {eventTypeLabel(e.event_type)} · {formatDatePt(e.event_date)} · /{e.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/$slug" params={{ slug: e.slug }} search={{ tipo: undefined }}>
                    Ver convite
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMode({ kind: "form", event: e, eventType: e.event_type })}
                >
                  Editar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
