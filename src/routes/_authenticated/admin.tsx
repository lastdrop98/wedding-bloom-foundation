import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileImage,
  Clock3,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  PackageCheck,
  Palette,
  Plus,
  Printer,
  Settings2,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { EVENT_TYPES, eventTitle, eventTypeLabel, type EventRow } from "@/lib/event";
import { WeddingForm } from "@/components/WeddingForm";
import { GalleryManager } from "@/components/GalleryManager";
import { MediaManager } from "@/components/MediaManager";
import { GiftManager } from "@/components/GiftManager";
import { GuestManager } from "@/components/GuestManager";
import { DeliveryPackage } from "@/components/DeliveryPackage";
import { ScheduleManager } from "@/components/ScheduleManager";
import { Button } from "@/components/ui/button";
import { EclipseMark } from "@/components/EclipseMark";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Solar Eclipse" },
      { name: "description", content: "Workspace de gestão Solar Eclipse." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type AdminMessage = {
  id: string;
  event_id: string;
  guest_name: string;
  message: string | null;
  attending: boolean | null;
  guest_count: number | null;
  created_at: string;
};

function formatAdminDateTime(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-MZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAdminTime(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-MZ", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatAdminDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-MZ", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

type Mode =
  | { kind: "dashboard" }
  | { kind: "choose-type" }
  | { kind: "form"; event: EventRow | null; eventType: string };


const NAV = [
  ["dashboard", "Visão geral", LayoutDashboard],
  ["dados", "Dados & Design", Palette],
  ["media", "Media", FileImage],
  ["programa", "Programa", CalendarDays],
  ["presentes", "Presentes", Gift],
  ["convidados", "Convidados", Users],
  ["entrega", "Entrega", PackageCheck],
] as const;

function AdminPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>({ kind: "dashboard" });
  const [activeSection, setActiveSection] = useState("dados");
  const [mobileNav, setMobileNav] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

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

  const { data: messages = [] } = useQuery({
    queryKey: ["admin-rsvp-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rsvps")
        .select("id,event_id,guest_name,message,attending,guest_count,created_at")
        .not("message", "is", null)
        .neq("message", "")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as AdminMessage[];
    },
  });

  const stats = useMemo(() => {
    const rows = events ?? [];
    return {
      total: rows.length,
      weddings: rows.filter((e) => e.event_type === "casamento").length,
      latest: rows[0],
    };
  }, [events]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function openEvent(event: EventRow, section = "dados") {
    setActiveSection(section);
    setMode({ kind: "form", event, eventType: event.event_type });
  }

  function closeForm() {
    setMode({ kind: "dashboard" });
    void queryClient.invalidateQueries({ queryKey: ["admin-events"] });
  }

  function handleSaved(savedEvent?: EventRow) {
    void queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    if (savedEvent) {
      setMode((current) =>
        current.kind === "form"
          ? { ...current, event: savedEvent, eventType: savedEvent.event_type }
          : current,
      );
    }
  }

  const currentEvent = mode.kind === "form" ? mode.event : null;

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-[248px] border-r border-black/[0.06] bg-white lg:flex lg:flex-col">
          <div className="flex h-16 items-center border-b border-black/[0.06] px-6">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center" aria-hidden="true"><EclipseMark className="size-7" /></span>
              <span className="text-sm font-semibold tracking-[-0.02em]">Solar Eclipse</span>
            </Link>
          </div>
          <div className="px-4 py-6">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">Workspace</p>
            <nav className="mt-3 space-y-1">
              <button
                type="button"
                onClick={() => setMode({ kind: "dashboard" })}
                className={navClass(mode.kind === "dashboard")}
              >
                <LayoutDashboard className="size-4" />
                Visão geral
              </button>
              {currentEvent && (
                <>
                  <p className="px-3 pt-6 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30">
                    {eventTitle(currentEvent)}
                  </p>
                  {NAV.filter(([value]) => value !== "dashboard").map(([value, label, Icon]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setActiveSection(value)}
                      className={navClass(activeSection === value)}
                    >
                      <Icon className="size-4" />
                      {label}
                    </button>
                  ))}
                </>
              )}
            </nav>
          </div>
          <div className="mt-auto border-t border-black/[0.06] p-4">
            <button type="button" onClick={signOut} className={navClass(false)}>
              <LogOut className="size-4" />
              Terminar sessão
            </button>
          </div>
        </aside>

        {mobileNav && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <button aria-label="Fechar menu" className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileNav(false)} />
            <aside className="relative flex h-full w-[290px] flex-col bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileNav(false)}>
                  <span className="flex size-7 items-center justify-center" aria-hidden="true"><EclipseMark className="size-7" /></span>
                  <span className="text-sm font-semibold">Solar Eclipse</span>
                </Link>
                <button type="button" onClick={() => setMobileNav(false)}><X className="size-5 text-black/50" /></button>
              </div>
              <nav className="mt-8 space-y-1">
                <button type="button" onClick={() => { setMode({ kind: "dashboard" }); setMobileNav(false); }} className={navClass(mode.kind === "dashboard")}>
                  <LayoutDashboard className="size-4" /> Visão geral
                </button>
                {currentEvent && NAV.filter(([value]) => value !== "dashboard").map(([value, label, Icon]) => (
                  <button key={value} type="button" onClick={() => { setActiveSection(value); setMobileNav(false); }} className={navClass(activeSection === value)}>
                    <Icon className="size-4" /> {label}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        <div className="w-full lg:pl-[248px]">
          <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-2xl">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button type="button" className="lg:hidden" onClick={() => setMobileNav(true)} aria-label="Abrir menu">
                  <Menu className="size-5" />
                </button>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">
                    {mode.kind === "dashboard" ? "Workspace" : "Editor"}
                  </p>
                  <p className="truncate text-sm font-medium">
                    {currentEvent ? eventTitle(currentEvent) : "Eventos"}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                <a href="/" target="_blank" rel="noreferrer" className="hidden rounded-full px-3 py-2 text-xs text-black/50 hover:bg-black/[0.04] sm:inline-flex">
                  Ver site
                </a>
                <Button
                  size="sm"
                  className="rounded-full bg-black px-4 text-white hover:bg-black/85"
                  onClick={() => setMode({ kind: "choose-type" })}
                >
                  <Plus className="mr-1.5 size-4" /> Novo evento
                </Button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">
            {mode.kind === "choose-type" ? (
              <ChooseEvent onCancel={() => setMode({ kind: "dashboard" })} onChoose={(eventType) => {
                setActiveSection("dados");
                setMode({ kind: "form", event: null, eventType });
              }} />
            ) : mode.kind === "dashboard" ? (
              <Dashboard
                events={events ?? []}
                isLoading={isLoading}
                stats={stats}
                messages={messages}
                now={now}
                onNew={() => setMode({ kind: "choose-type" })}
                onOpen={openEvent}
              />
            ) : (
              <EditorShell
                event={currentEvent}
                eventType={mode.eventType}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                onClose={closeForm}
                onSaved={handleSaved}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function navClass(active: boolean) {
  return `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors ${active ? "bg-black text-white" : "text-black/55 hover:bg-black/[0.045] hover:text-black"}`;
}

function ChooseEvent({ onCancel, onChoose }: { onCancel: () => void; onChoose: (value: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <button type="button" onClick={onCancel} className="text-xs text-black/45 hover:text-black">← Voltar</button>
      <div className="mt-8 max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">Novo projeto</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Comece com a ocasião.</h1>
        <p className="mt-5 text-base leading-7 text-black/50">Escolha a estrutura do evento. O conteúdo e o design podem ser refinados depois.</p>
      </div>
      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        {EVENT_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            disabled={!type.available}
            onClick={() => onChoose(type.value)}
            className="group rounded-[28px] border border-black/[0.08] bg-white p-6 text-left transition-all enabled:hover:-translate-y-1 enabled:hover:border-black/20 enabled:hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-[#f5f5f7]">
              <Sparkles className="size-4" />
            </span>
            <h2 className="mt-10 text-xl font-semibold tracking-[-0.025em]">{type.label}</h2>
            <p className="mt-2 text-sm text-black/45">{type.available ? "Criar novo evento" : "Disponível em breve"}</p>
            <ChevronRight className="mt-8 size-5 text-black/30 transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Dashboard({
  events,
  isLoading,
  stats,
  messages,
  onNew,
  onOpen,
}: {
  events: EventRow[];
  isLoading: boolean;
  stats: { total: number; weddings: number; latest?: EventRow | undefined };
  messages: AdminMessage[];
  now: Date;
  onNew: () => void;
  onOpen: (event: EventRow, section?: string) => void;
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (messageIndex >= messages.length && messages.length > 0) {
      setMessageIndex(0);
    }
  }, [messageIndex, messages.length]);

  useEffect(() => {
    if (messages.length < 2) return;
    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [messages.length]);

  const activeMessage = messages[messageIndex];
  const messageEvent = activeMessage ? events.find((event) => event.id === activeMessage.event_id) : undefined;

  return (
    <div className="admin-workspace space-y-10">
      <section className="admin-hero">
        <div className="admin-hero-image" aria-hidden="true" />
        <div className="admin-hero-glow admin-hero-glow-one" aria-hidden="true" />
        <div className="admin-hero-glow admin-hero-glow-two" aria-hidden="true" />
        <div className="admin-hero-content">
          <div className="admin-hero-copy">
            <div className="admin-eyebrow"><span className="admin-live-dot" /> Workspace</div>
            <h1>Bom trabalho.</h1>
            <p>O centro de comando do Solar Eclipse para criar, acompanhar e entregar experiências memoráveis.</p>
            <div className="admin-hero-actions">
              <Button onClick={onNew} className="h-11 rounded-full bg-black px-5 text-white shadow-lg shadow-black/15 hover:bg-black/85">
                <Plus className="mr-2 size-4" /> Criar evento
              </Button>
              <span className="admin-hero-note">Tudo num só espaço</span>
            </div>
          </div>
          <div className="admin-hero-clock">
            <div className="admin-clock-orbit" aria-hidden="true"><span /><span /><span /></div>
            <div className="admin-clock-top"><span>Agora</span><Clock3 className="size-4" /></div>
            <span className="admin-clock-time tabular-nums">{formatAdminTime(now)}</span>
            <span className="admin-clock-date">{formatAdminDate(now)}</span>
            <div className="admin-clock-rule" />
            <span className="admin-clock-caption">Horário local do workspace</span>
          </div>
        </div>
        <div className="admin-hero-decor" aria-hidden="true">
          <span className="admin-hero-ring ring-one" />
          <span className="admin-hero-ring ring-two" />
          <span className="admin-hero-star">✦</span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={LayoutDashboard} label="Projetos" value={stats.total} />
        <StatCard icon={Sparkles} label="Casamentos" value={stats.weddings} />
        <StatCard icon={BarChart3} label="Último projeto" value={stats.latest ? eventTitle(stats.latest) : "—"} compact />
      </section>

      <section className="rounded-[30px] border border-black/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.03)] sm:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">Projetos</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">Os seus eventos</h2>
          </div>
          <span className="text-xs text-black/35">{events.length} total</span>
        </div>

        {isLoading ? (
          <div className="mt-8 h-24 animate-pulse rounded-2xl bg-[#f5f5f7]" />
        ) : !events.length ? (
          <div className="mt-8 rounded-2xl bg-[#f5f5f7] px-6 py-12 text-center">
            <Sparkles className="mx-auto size-7 text-black/25" />
            <p className="mt-4 font-medium">O seu primeiro projeto começa aqui.</p>
            <p className="mt-1 text-sm text-black/45">Crie um evento para abrir o editor completo.</p>
            <Button onClick={onNew} className="mt-5 rounded-full bg-black text-white hover:bg-black/85">Criar evento</Button>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {events.map((event) => (
              <article key={event.id} className="group flex flex-col gap-4 rounded-2xl border border-transparent px-3 py-4 transition-colors hover:border-black/[0.07] hover:bg-[#f5f5f7] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{eventTitle(event)}</p>
                    <p className="mt-1 truncate text-xs text-black/40">{eventTypeLabel(event.event_type)} · {formatAdminDateTime(event.event_date)} · /{event.slug}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link to="/$slug" params={{ slug: event.slug }} search={{ tipo: undefined }} target="_blank">
                      <ExternalLink className="mr-1.5 size-3.5" /> Abrir
                    </Link>
                  </Button>
                  <Button size="sm" className="rounded-full bg-black text-white hover:bg-black/85" onClick={() => onOpen(event)}>
                    Editar <ChevronRight className="ml-1 size-3.5" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-message-panel relative overflow-hidden rounded-[30px] border border-black/[0.07] bg-[#111] p-6 text-white shadow-[0_24px_70px_-45px_rgba(0,0,0,.55)] sm:p-8">
        <div className="absolute -right-20 -top-20 size-56 rounded-full bg-[#d7b56d]/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 size-64 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
                <MessageCircle className="size-4 text-[#d7b56d]" />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Feedback dos convidados</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">Mensagens recentes</h2>
              </div>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/45">
              {messages.length} mensagens
            </span>
          </div>

          {activeMessage ? (
            <div className="mt-7">
              <div className="admin-message-card min-h-[170px] rounded-[24px] border border-white/10 bg-white/[0.055] p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-medium">{activeMessage.guest_name || "Convidado"}</p>
                    <p className="mt-1 text-xs text-white/40">
                      {messageEvent ? eventTitle(messageEvent) : "Evento"} · {activeMessage.attending ? "Presença confirmada" : "Não vai"}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-white/40">
                    <p>{formatAdminDateTime(activeMessage.created_at)}</p>
                    {activeMessage.guest_count ? <p className="mt-1">{activeMessage.guest_count} convidado(s)</p> : null}
                  </div>
                </div>
                <p className="mt-7 max-w-3xl text-base leading-7 text-white/80">
                  “{activeMessage.message}”
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5" aria-label="Mensagens">
                  {messages.slice(0, 12).map((message, index) => (
                    <button
                      key={message.id}
                      type="button"
                      aria-label={`Ver mensagem ${index + 1}`}
                      aria-current={index === messageIndex}
                      onClick={() => setMessageIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${index === messageIndex ? "w-7 bg-[#d7b56d]" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
                    />
                  ))}
                </div>
                {messages.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button type="button" aria-label="Mensagem anterior" onClick={() => setMessageIndex((messageIndex - 1 + messages.length) % messages.length)} className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition hover:bg-white/10">
                      <ChevronLeft className="size-4" />
                    </button>
                    <button type="button" aria-label="Próxima mensagem" onClick={() => setMessageIndex((messageIndex + 1) % messages.length)} className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition hover:bg-white/10">
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-7 flex min-h-[150px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.035] text-center">
              <div>
                <MessageCircle className="mx-auto size-7 text-white/20" />
                <p className="mt-3 text-sm text-white/55">Ainda não existem mensagens de convidados.</p>
                <p className="mt-1 text-xs text-white/30">As mensagens aparecerão aqui automaticamente após os primeiros RSVP.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, compact }: { icon: typeof LayoutDashboard; label: string; value: string | number; compact?: boolean }) {
  return (
    <div className="rounded-[26px] border border-black/[0.07] bg-white p-6">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/35">{label}</span>
        <Icon className="size-4 text-black/25" />
      </div>
      <p className={`mt-8 font-semibold tracking-[-0.04em] ${compact ? "truncate text-lg" : "text-4xl"}`}>{value}</p>
    </div>
  );
}

function EditorShell({
  event,
  eventType,
  activeSection,
  onSectionChange,
  onClose,
  onSaved,
}: {
  event: EventRow | null;
  eventType: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onClose: () => void;
  onSaved: () => void;
}) {
  const title = event ? eventTitle(event) : `Novo — ${eventTypeLabel(eventType)}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <button type="button" onClick={onClose} className="text-xs text-black/40 hover:text-black">← Todos os eventos</button>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-black/45">{event ? `/${event.slug}` : "O conteúdo será guardado no evento."}</p>
        </div>
        {event && (
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <a href={`/${event.slug}`} target="_blank" rel="noreferrer"><ExternalLink className="mr-1.5 size-3.5" /> Abrir convite</a>
            </Button>
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <a href={`/${event.slug}/imprimir?formato=a5`} target="_blank" rel="noreferrer"><Printer className="mr-1.5 size-3.5" /> Impressão</a>
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-black/[0.07] bg-white p-1.5 lg:hidden">
        {NAV.filter(([value]) => value !== "dashboard").map(([value, label, Icon]) => (
          <button key={value} type="button" onClick={() => onSectionChange(value)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs ${activeSection === value ? "bg-black text-white" : "text-black/45"}`}>
            <Icon className="size-3.5" /> {label}
          </button>
        ))}
      </div>

      <section className="min-h-[600px] rounded-[30px] border border-black/[0.07] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,.03)] sm:p-8">
        {activeSection === "dados" && <WeddingForm event={event} eventType={eventType} onSaved={onSaved} onCancel={onClose} />}
        {event && activeSection === "media" && (
          <div className="space-y-12">
            <MediaManager event={event} />
            <div className="border-t border-black/[0.07] pt-10"><GalleryManager eventId={event.id} /></div>
          </div>
        )}
        {event && activeSection === "programa" && <ScheduleManager eventId={event.id} />}
        {event && activeSection === "presentes" && <GiftManager eventId={event.id} />}
        {event && activeSection === "convidados" && <GuestManager eventId={event.id} slug={event.slug} />}
        {event && activeSection === "entrega" && <DeliveryPackage slug={event.slug} />}
        {!event && activeSection !== "dados" && (
          <div className="flex min-h-[500px] items-center justify-center text-center">
            <div><Settings2 className="mx-auto size-8 text-black/20" /><p className="mt-4 font-medium">Primeiro guarde o evento.</p><p className="mt-1 text-sm text-black/40">Depois poderá configurar esta área.</p></div>
          </div>
        )}
      </section>
    </div>
  );
}
