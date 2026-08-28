import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  AUDIO_BUCKET,
  GALLERY_BUCKET,
  detail,
  eventTitle,
  fetchEventBySlug,
  fetchEventContent,
  formatDatePt,
  inviteBadgeHint,
  inviteBadgeLabel,
  mapsUrl,
  parseInviteType,
  signedUrl,
  type EventRow,
} from "@/lib/event";
import { Lightbox } from "@/components/invite/Lightbox";
import { Ornament } from "@/components/invite/Ornament";
import { FlourishFrame } from "@/components/invite/Flourish";
import { FlipNumber } from "@/components/invite/FlipNumber";
import { Reveal } from "@/components/invite/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/$slug/home")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    tipo: parseInviteType(search["tipo"]) ?? undefined,
  }),
  component: HomePage,
});

type GalleryImage = { url: string; caption: string | null };

function Section({
  title,
  eyebrow,
  children,
  wide,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section className="px-6 py-20 md:py-24">
      <Reveal className={wide ? "mx-auto max-w-5xl" : "mx-auto max-w-2xl"}>
        <div className="flex flex-col items-center text-center">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="text-[clamp(1.75rem,5vw,2.75rem)] leading-tight font-light tracking-wide">
            {title}
          </h2>
          <span className="draw-rule mt-5" />
        </div>
        <div className="mt-12 text-left">{children}</div>
      </Reveal>
    </section>
  );
}

function Countdown({ date }: { date: string | null }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!date) return null;
  const diff = Math.max(0, new Date(date).getTime() - now);
  const cells = [
    { label: "Dias", value: Math.floor(diff / 86400000) },
    { label: "Horas", value: Math.floor((diff % 86400000) / 3600000) },
    { label: "Minutos", value: Math.floor((diff % 3600000) / 60000) },
    { label: "Segundos", value: Math.floor((diff % 60000) / 1000) },
  ];
  return (
    <div className="mx-auto grid max-w-lg grid-cols-4 gap-3 sm:gap-5">
      {cells.map((c) => (
        <div key={c.label} className="card-elegant px-2 py-5 text-center">
          <p className="text-3xl font-light text-primary tabular-nums md:text-4xl">
            {String(c.value).padStart(2, "0")}
          </p>
          <p className="eyebrow mt-2 text-[0.6rem]">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

function LocationCard({
  label,
  venue,
  address,
  time,
}: {
  label: string;
  venue?: string | null;
  address?: string | null;
  time?: string | null;
}) {
  if (!venue && !address) return null;
  return (
    <div className="card-elegant p-7 hover:-translate-y-0.5">
      <p className="eyebrow">{label}</p>
      {venue && <p className="mt-3 text-2xl font-light">{venue}</p>}
      {address && <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">{address}</p>}
      {time && (
        <p className="mt-3 font-sans text-xs tracking-[0.25em] text-primary uppercase">{time}</p>
      )}
      <a
        href={mapsUrl(address, venue)}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-block border-b border-gold/50 pb-1 font-sans text-[0.7rem] tracking-[0.25em] text-primary uppercase transition-colors hover:border-gold"
      >
        Ver no mapa
      </a>
    </div>
  );
}

function RsvpForm({ event, defaultCount }: { event: EventRow; defaultCount: number }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    guest_name: "",
    guest_phone: "",
    attending: "sim",
    guest_count: String(defaultCount),
    message: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("rsvps").insert({
      event_id: event.id,
      guest_name: form.guest_name,
      guest_phone: form.guest_phone || null,
      attending: form.attending === "sim",
      guest_count: Number(form.guest_count) || 1,
      message: form.message || null,
    });
    setBusy(false);
    if (error) {
      toast.error("Não foi possível enviar a confirmação.");
      return;
    }
    setDone(true);
    toast.success("Confirmação enviada. Obrigado!");
  }

  if (done) {
    return (
      <div className="card-elegant p-10 text-center">
        <Ornament />
        <p className="mt-6 text-xl font-light">A sua confirmação foi registada.</p>
        <p className="mt-2 font-sans text-sm text-muted-foreground">Muito obrigado!</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card-elegant space-y-5 p-7 font-sans md:p-9">
      <div className="space-y-2">
        <Label htmlFor="guest_name">Nome</Label>
        <Input
          id="guest_name"
          required
          value={form.guest_name}
          onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="guest_phone">Telefone</Label>
        <Input
          id="guest_phone"
          value={form.guest_phone}
          onChange={(e) => setForm({ ...form, guest_phone: e.target.value })}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="attending">Vai estar presente?</Label>
          <select
            id="attending"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.attending}
            onChange={(e) => setForm({ ...form, attending: e.target.value })}
          >
            <option value="sim">Sim, com muito gosto</option>
            <option value="nao">Infelizmente não poderei</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="guest_count">Número de convidados</Label>
          <Input
            id="guest_count"
            type="number"
            min={1}
            value={form.guest_count}
            onChange={(e) => setForm({ ...form, guest_count: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem para os anfitriões</Label>
        <Textarea
          id="message"
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>
      {event.rsvp_deadline && (
        <p className="text-xs tracking-wide text-muted-foreground">
          Confirme até {formatDatePt(event.rsvp_deadline)}.
        </p>
      )}
      <Button type="submit" className="w-full tracking-[0.2em] uppercase" disabled={busy}>
        Confirmar presença
      </Button>
    </form>
  );
}

function PersonCard({
  role,
  name,
  parents,
  photo,
}: {
  role: string;
  name: string | null;
  parents: string;
  photo?: GalleryImage | undefined;
}) {
  return (
    <div className="card-elegant overflow-hidden text-center">
      {photo && (
        <div className="overflow-hidden">
          <img
            src={photo.url}
            alt={name ?? role}
            loading="lazy"
            className="h-64 w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
          />
        </div>
      )}
      <div className="p-7">
        <p className="eyebrow">{role}</p>
        <p className="mt-3 text-2xl font-light">{name}</p>
        {parents && (
          <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">{parents}</p>
        )}
      </div>
    </div>
  );
}

function HomePage() {
  const { slug } = Route.useParams();
  const { tipo } = Route.useSearch();
  const inviteType = parseInviteType(tipo);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [music, setMusic] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cover, setCover] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEventBySlug(slug),
  });

  const { data: content } = useQuery({
    queryKey: ["event-content", event?.id],
    queryFn: () => fetchEventContent(event!.id),
    enabled: Boolean(event?.id),
  });

  useEffect(() => {
    if (!event) return;
    signedUrl(AUDIO_BUCKET, event.music_path).then(setMusic);
    signedUrl(GALLERY_BUCKET, event.cover_image_path).then(setCover);
  }, [event]);

  useEffect(() => {
    if (!content?.gallery.length) return;
    Promise.all(
      content.gallery.map(async (g) => ({
        url: await signedUrl(GALLERY_BUCKET, g.image_path),
        caption: g.caption,
      })),
    ).then((items) => setGalleryUrls(items.filter((i): i is GalleryImage => Boolean(i.url))));
  }, [content]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans text-xs tracking-[0.3em] text-muted-foreground uppercase">
        A carregar…
      </div>
    );
  }
  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-3xl font-light">Convite não encontrado</h1>
      </div>
    );
  }

  const badge = inviteBadgeLabel(inviteType);
  const schedule = content?.schedule ?? [];
  const gifts = content?.gifts ?? [];
  const d = (field: Parameters<typeof detail>[1]) => detail(event, field);

  function toggleMusic() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el
        .play()
        .then(() => setPlaying(true))
        .catch(() => undefined);
    }
  }

  return (
    <main className="pb-24">
      {/* Cabeçalho imersivo */}
      <header className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={`Fotografia de ${eventTitle(event)}`}
              className="ken-burns h-full w-full object-cover will-change-transform"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(120%_100%_at_50%_0%,oklch(0.32_0.05_150)_0%,oklch(0.22_0.03_140)_45%,oklch(0.16_0.02_90)_100%)]" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.16_0.02_70/0.35)_0%,oklch(0.16_0.02_70/0.6)_50%,oklch(0.14_0.02_70/0.92)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-3xl animate-fade-in">
          <p className="eyebrow text-cream/70">Convite</p>
          <h1 className="mt-7 text-[clamp(2.5rem,9vw,5rem)] leading-[1.05] font-light tracking-wide text-cream">
            {eventTitle(event)}
          </h1>
          <Ornament className="mt-9" />
          <p className="mt-8 font-sans text-sm tracking-[0.35em] text-cream/85 uppercase">
            {formatDatePt(event.event_date)}
          </p>
          {event.hashtag && (
            <p className="mt-3 font-sans text-xs tracking-[0.3em] text-gold uppercase">
              {event.hashtag}
            </p>
          )}

          {badge && (
            <div className="mx-auto mt-10 max-w-sm rounded-sm border border-gold/50 bg-[oklch(0.16_0.02_70/0.35)] px-6 py-5 backdrop-blur-sm">
              <p className="font-sans text-[0.7rem] tracking-[0.25em] text-gold uppercase">{badge}</p>
              <p className="mt-2 font-sans text-xs leading-relaxed text-cream/75">
                {inviteBadgeHint(inviteType)}
              </p>
            </div>
          )}

          {music && (
            <button
              type="button"
              onClick={toggleMusic}
              className="mt-10 border-b border-gold/40 pb-1 font-sans text-[0.7rem] tracking-[0.3em] text-gold uppercase transition-colors hover:border-gold"
            >
              {playing ? "Pausar música" : "Tocar música"}
            </button>
          )}
          {music && <audio ref={audioRef} src={music} loop preload="auto" />}
        </div>

        <span className="breathe absolute bottom-8 left-1/2 block h-12 w-px -translate-x-1/2 bg-linear-to-b from-transparent to-gold/80" />
      </header>

      <Section title="Contagem Decrescente" eyebrow="Falta pouco">
        <Countdown date={event.event_date} />
      </Section>

      <Ornament />

      {(d("verse_text") || d("verse_2_text")) && (
        <Section title="Palavra">
          <div className="grid gap-6">
            {[
              { text: d("verse_text"), ref: d("verse_reference") },
              { text: d("verse_2_text"), ref: d("verse_2_reference") },
            ]
              .filter((v) => v.text)
              .map((v) => (
                <blockquote key={v.text} className="card-elegant p-8 text-center md:p-10">
                  <p className="text-xl leading-relaxed font-light italic text-foreground/85">
                    “{v.text}”
                  </p>
                  {v.ref && (
                    <footer className="mt-5 font-sans text-[0.7rem] tracking-[0.3em] text-primary uppercase">
                      {v.ref}
                    </footer>
                  )}
                </blockquote>
              ))}
          </div>
        </Section>
      )}

      {(d("bride_name") || d("groom_name")) && (
        <>
          <Ornament />
          <Section title="Os Noivos" wide>
            <div className="grid gap-8 sm:grid-cols-2">
              <PersonCard
                role="A Noiva"
                name={d("bride_name")}
                parents={
                  [d("bride_father_name"), d("bride_mother_name")].filter(Boolean).length
                    ? `Filha de ${[d("bride_father_name"), d("bride_mother_name")].filter(Boolean).join(" e ")}`
                    : ""
                }
                photo={galleryUrls[0]}
              />
              <PersonCard
                role="O Noivo"
                name={d("groom_name")}
                parents={
                  [d("groom_father_name"), d("groom_mother_name")].filter(Boolean).length
                    ? `Filho de ${[d("groom_father_name"), d("groom_mother_name")].filter(Boolean).join(" e ")}`
                    : ""
                }
                photo={galleryUrls[1]}
              />
            </div>
          </Section>
        </>
      )}

      <Ornament />

      <Section title="Programa do Dia">
        <ol className="space-y-4">
          {(schedule.length > 0
            ? schedule.map((item) => ({
                key: item.id,
                time: item.time_label,
                title: item.title,
                sub: item.description,
              }))
            : [
                {
                  key: "civil",
                  time: d("civil_ceremony_time"),
                  title: "Cerimónia Civil",
                  sub: d("civil_ceremony_venue"),
                },
                {
                  key: "cerimonia",
                  time: d("ceremony_time"),
                  title: "Cerimónia",
                  sub: d("ceremony_venue"),
                },
                {
                  key: "rececao",
                  time: d("reception_time"),
                  title: "Receção",
                  sub: d("reception_venue"),
                },
              ].filter((r) => r.time || r.sub)
          ).map((r) => (
            <li key={r.key} className="card-elegant flex items-start gap-5 p-6">
              <span className="w-20 shrink-0 font-sans text-xs tracking-[0.2em] text-primary uppercase">
                {r.time}
              </span>
              <span className="min-w-0">
                <span className="block text-xl font-light">{r.title}</span>
                {r.sub && (
                  <span className="mt-1 block font-sans text-sm text-muted-foreground">{r.sub}</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Ornament />

      <Section title="Localização" wide>
        <div className="grid gap-6 md:grid-cols-3">
          <LocationCard
            label="Cerimónia Civil"
            venue={d("civil_ceremony_venue")}
            address={d("civil_ceremony_address")}
            time={d("civil_ceremony_time")}
          />
          <LocationCard
            label="Cerimónia"
            venue={d("ceremony_venue")}
            address={d("ceremony_address")}
            time={d("ceremony_time")}
          />
          <LocationCard
            label="Receção"
            venue={d("reception_venue")}
            address={d("reception_address")}
            time={d("reception_time")}
          />
        </div>
      </Section>

      {galleryUrls.length > 0 && (
        <>
          <Ornament />
          <Section title="Galeria" wide>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {galleryUrls.map((g) => (
                <button
                  key={g.url}
                  type="button"
                  onClick={() => setLightbox(g)}
                  className="group overflow-hidden rounded-sm border border-gold/30"
                >
                  <img
                    src={g.url}
                    alt={g.caption ?? `Fotografia de ${eventTitle(event)}`}
                    loading="lazy"
                    className="h-44 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 md:h-60"
                  />
                </button>
              ))}
            </div>
          </Section>
        </>
      )}

      <Ornament />

      <Section title="Presentes">
        <div className="grid gap-6">
          <div className="card-elegant p-7">
            <p className="eyebrow">Dados bancários</p>
            <dl className="mt-4 space-y-2 font-sans text-sm text-muted-foreground">
              {d("bank_holder") && <div>Titular: {d("bank_holder")}</div>}
              {d("bank_name") && <div>Banco: {d("bank_name")}</div>}
              {d("bank_account") && <div>Conta: {d("bank_account")}</div>}
              {d("bank_nib") && <div>NIB/IBAN: {d("bank_nib")}</div>}
            </dl>
          </div>
          {gifts.map((g) => (
            <div key={g.id} className="card-elegant p-7">
              <p className="text-xl font-light">{g.title}</p>
              {g.description && (
                <p className="mt-2 font-sans text-sm text-muted-foreground">{g.description}</p>
              )}
              {g.link_or_info && (
                <p className="mt-3 font-sans text-sm break-words text-primary">{g.link_or_info}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Ornament />

      <Section title="Confirmação de Presença" eyebrow="RSVP">
        <RsvpForm event={event} defaultCount={inviteType === "casal" ? 2 : 1} />
      </Section>

      {(event.contact_1_name || event.contact_2_name) && (
        <Section title="Contactos">
          <div className="grid gap-6 text-center sm:grid-cols-2">
            {[
              { n: event.contact_1_name, p: event.contact_1_phone },
              { n: event.contact_2_name, p: event.contact_2_phone },
            ]
              .filter((c) => c.n)
              .map((c) => (
                <div key={c.n} className="card-elegant p-7">
                  <p className="text-xl font-light">{c.n}</p>
                  <p className="mt-2 font-sans text-sm text-muted-foreground">{c.p}</p>
                </div>
              ))}
          </div>
        </Section>
      )}

      <footer className="relative mt-16 overflow-hidden border-t border-gold/25 px-6 pt-14 pb-4 text-center">
        <FlourishFrame size={80} />
        <Ornament />
        <p className="mt-6 font-sans text-xs tracking-[0.25em] text-muted-foreground uppercase">
          Convite criado com ♡ por
        </p>
        <p className="mt-2 text-lg font-light tracking-[0.2em] text-primary">Solar Eclipse</p>
        <Link
          to="/$slug"
          params={{ slug }}
          search={{ tipo: inviteType ?? undefined }}
          className="mt-8 inline-block border-b border-gold/40 pb-1 font-sans text-[0.7rem] tracking-[0.3em] text-primary uppercase transition-colors hover:border-gold"
        >
          Voltar à capa
        </Link>
      </footer>


      {lightbox && (
        <Lightbox src={lightbox.url} caption={lightbox.caption} onClose={() => setLightbox(null)} />
      )}
    </main>
  );
}
