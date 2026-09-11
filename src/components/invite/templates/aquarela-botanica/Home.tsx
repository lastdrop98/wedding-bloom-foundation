import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  AUDIO_BUCKET,
  GALLERY_BUCKET,
  detail,
  eventTitle,
  fetchEventContent,
  formatDatePt,
  inviteBadgeHint,
  inviteBadgeLabel,
  mapsUrl,
  signedUrl,
  type EventRow,
  type InviteType,
} from "@/lib/event";
import { Lightbox } from "@/components/invite/Lightbox";
import { Reveal } from "@/components/invite/Reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BerrySprig, BotanicalFrame, EucalyptusSpray, FloralDivider, WatercolorRose } from "./Botanicals";
import { Petals } from "./Petals";
import { GiftQr } from "@/components/invite/GiftQr";
import { Guestbook } from "@/components/invite/Guestbook";

type GalleryImage = { url: string; caption: string | null; mediaType?: string };

function Section({
  title,
  eyebrow,
  children,
  wide,
  flora = "none",
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  wide?: boolean;
  flora?: "none" | "rose" | "eucalipto" | "bagas";
}) {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-24">
      {flora === "rose" && (
        <WatercolorRose className="pointer-events-none absolute -top-10 -left-12 opacity-50" size={200} />
      )}
      {flora === "eucalipto" && (
        <EucalyptusSpray className="text-sage pointer-events-none absolute -right-6 bottom-0 -scale-x-100 opacity-50" size={190} />
      )}
      {flora === "bagas" && (
        <BerrySprig className="text-rose pointer-events-none absolute top-4 right-4 opacity-50" size={150} />
      )}
      <Reveal className={wide ? "relative mx-auto max-w-5xl" : "relative mx-auto max-w-2xl"}>
        <div className="flex flex-col items-center text-center">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="text-[clamp(1.75rem,5vw,2.75rem)] leading-tight font-light tracking-wide text-primary">
            {title}
          </h2>
          <FloralDivider className="mt-5" />
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
        <div key={c.label} className="card-aquarela px-2 py-5 text-center">
          <span className="text-3xl font-light text-primary tabular-nums md:text-4xl">
            {String(c.value).padStart(2, "0")}
          </span>
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
    <div className="card-aquarela p-7">
      <p className="eyebrow">{label}</p>
      {venue && <p className="mt-3 text-2xl font-light">{venue}</p>}
      {address && (
        <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">{address}</p>
      )}
      {time && (
        <p className="mt-3 font-sans text-xs tracking-[0.25em] text-primary uppercase">{time}</p>
      )}
      <a href={mapsUrl(address, venue)} target="_blank" rel="noreferrer" className="btn-brush mt-6">
        Ver no mapa
      </a>
    </div>
  );
}

function RsvpForm({ event, defaultCount }: { event: EventRow; defaultCount: number }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [form, setForm] = useState({
    guest_name: "",
    guest_phone: "",
    attending: "sim",
    guest_count: String(defaultCount),
    message: "",
  });

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("g");
    if (!token) return;
    supabase
      .from("guests")
      .select("id, name, invited_count")
      .eq("token", token)
      .eq("event_id", event.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setGuestId(data.id);
          setForm((f) => ({
            ...f,
            guest_name: data.name,
            guest_count: String(data.invited_count ?? f.guest_count),
          }));
        }
      });
  }, [event.id]);

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
    if (!error && guestId) {
      await supabase
        .from("guests")
        .update({ rsvp_status: form.attending === "sim" ? "sim" : "nao" })
        .eq("id", guestId);
    }
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
      <div className="card-aquarela p-10 text-center">
        <FloralDivider />
        <p className="mt-6 text-xl font-light">A sua confirmação foi registada.</p>
        <p className="mt-2 font-sans text-sm text-muted-foreground">Muito obrigado!</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card-aquarela space-y-5 p-7 font-sans md:p-9">
      <div className="space-y-2">
        <Label htmlFor="guest_name">Nome</Label>
        <Input
          id="guest_name"
          required
          readOnly={Boolean(guestId)}
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
      <button type="submit" className="btn-brush w-full" disabled={busy}>
        Confirmar presença
      </button>
    </form>
  );
}

export function AquarelaHome({
  event,
  slug,
  inviteType,
}: {
  event: EventRow;
  slug: string;
  inviteType: InviteType;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [music, setMusic] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cover, setCover] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [giftPhotos, setGiftPhotos] = useState<Record<string, string>>({});

  const { data: content } = useQuery({
    queryKey: ["event-content", event.id],
    queryFn: () => fetchEventContent(event.id),
  });

  useEffect(() => {
    signedUrl(AUDIO_BUCKET, event.music_path).then(setMusic);
    signedUrl(GALLERY_BUCKET, event.cover_image_path).then(setCover);
  }, [event]);

  useEffect(() => {
    if (!content?.gallery.length) return;
    Promise.all(
      content.gallery.map(async (g) => ({
        url: await signedUrl(GALLERY_BUCKET, g.image_path),
        caption: g.caption,
        mediaType: g.media_type,
      })),
    ).then((items) => setGalleryUrls(items.filter((i): i is GalleryImage => Boolean(i.url))));
  }, [content]);

  useEffect(() => {
    if (!content?.gifts.length) return;
    Promise.all(
      content.gifts.map(async (g) => [g.id, await signedUrl(GALLERY_BUCKET, g.image_path)] as const),
    ).then((pairs) =>
      setGiftPhotos(Object.fromEntries(pairs.filter((p): p is [string, string] => Boolean(p[1])))),
    );
  }, [content]);

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
    <main className="aquarela pb-24">
      <header className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={`Fotografia de ${eventTitle(event)}`}
              className="ken-burns h-full w-full object-cover will-change-transform"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(120%_100%_at_50%_0%,oklch(0.98_0.02_20)_0%,oklch(0.95_0.03_150)_55%,oklch(0.99_0.01_60)_100%)]" />
          )}
          <div className="veil-rose absolute inset-0" />
        </div>

        <BotanicalFrame />
        <Petals />

        <div className="relative mx-auto max-w-3xl animate-fade-in">
          <p className="eyebrow text-foreground/60">Convite</p>
          <h1 className="script-names mt-5 text-[clamp(2.75rem,12vw,6rem)] text-primary">
            {eventTitle(event)}
          </h1>
          <FloralDivider className="mt-8" />
          <p className="mt-8 font-sans text-sm tracking-[0.35em] text-foreground/70 uppercase">
            {formatDatePt(event.event_date)}
          </p>
          {event.hashtag && (
            <p className="mt-3 font-sans text-xs tracking-[0.3em] text-primary uppercase">
              {event.hashtag}
            </p>
          )}

          {badge && (
            <div className="card-aquarela mx-auto mt-10 max-w-sm px-6 py-5">
              <p className="font-sans text-[0.7rem] tracking-[0.25em] text-primary uppercase">
                {badge}
              </p>
              <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground">
                {inviteBadgeHint(inviteType)}
              </p>
            </div>
          )}

          {music && (
            <button type="button" onClick={toggleMusic} className="btn-brush mt-10">
              {playing ? "Pausar música" : "Tocar música"}
            </button>
          )}
          {music && <audio ref={audioRef} src={music} loop preload="auto" />}
        </div>

        <span className="breathe absolute bottom-8 left-1/2 block h-12 w-px -translate-x-1/2 bg-linear-to-b from-transparent to-rose/70" />
      </header>

      <Section title="Contagem Decrescente" eyebrow="Falta pouco" flora="bagas">
        <Countdown date={event.event_date} />
      </Section>

      {(d("verse_text") || d("verse_2_text")) && (
        <Section title="Palavra" flora="rose">
          <div className="grid gap-6">
            {[
              { text: d("verse_text"), ref: d("verse_reference") },
              { text: d("verse_2_text"), ref: d("verse_2_reference") },
            ]
              .filter((v) => v.text)
              .map((v) => (
                <blockquote key={v.text} className="card-aquarela p-8 text-center md:p-10">
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
        <Section title="Os Noivos" wide flora="eucalipto">
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              {
                role: "A Noiva",
                name: d("bride_name"),
                parents: [d("bride_father_name"), d("bride_mother_name")].filter(Boolean).length
                  ? `Filha de ${[d("bride_father_name"), d("bride_mother_name")].filter(Boolean).join(" e ")}`
                  : "",
                photo: galleryUrls[0],
              },
              {
                role: "O Noivo",
                name: d("groom_name"),
                parents: [d("groom_father_name"), d("groom_mother_name")].filter(Boolean).length
                  ? `Filho de ${[d("groom_father_name"), d("groom_mother_name")].filter(Boolean).join(" e ")}`
                  : "",
                photo: galleryUrls[1],
              },
            ].map((p, i) => (
              <Reveal key={p.role} delay={i * 100}>
                <div className="card-aquarela overflow-hidden text-center">
                  {p.photo && (
                    <div className="overflow-hidden">
                      <img
                        src={p.photo.url}
                        alt={p.name ?? p.role}
                        loading="lazy"
                        className="h-64 w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <p className="eyebrow">{p.role}</p>
                    <p className="script-names mt-2 text-4xl text-primary">{p.name}</p>
                    {p.parents && (
                      <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">
                        {p.parents}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section title="Programa do Dia" flora="bagas">
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
            <li key={r.key} className="card-aquarela flex items-start gap-5 p-6">
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

      <Section title="Localização" wide flora="rose">
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
        <Section title="Galeria" wide flora="eucalipto">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {galleryUrls.map((g, i) => (
              <Reveal key={g.url} delay={i * 100}>
                <button
                  type="button"
                  onClick={() => setLightbox(g)}
                  className="group w-full overflow-hidden rounded-tl-2xl rounded-br-2xl border border-sage/40"
                >
                  <img
                    src={g.url}
                    alt={g.caption ?? `Fotografia de ${eventTitle(event)}`}
                    loading="lazy"
                    className="h-44 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 md:h-60"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section title="Presentes" flora="bagas">
        <div className="grid gap-6">
          <div className="card-aquarela p-7">
            <p className="eyebrow">Dados bancários</p>
            <dl className="mt-4 space-y-2 font-sans text-sm text-muted-foreground">
              {d("bank_holder") && <div>Titular: {d("bank_holder")}</div>}
              {d("bank_name") && <div>Banco: {d("bank_name")}</div>}
              {d("bank_account") && <div>Conta: {d("bank_account")}</div>}
              {d("bank_nib") && <div>NIB/IBAN: {d("bank_nib")}</div>}
            </dl>
          </div>
          {gifts.map((g, i) => (
            <Reveal key={g.id} delay={i * 100}>
              <div className="card-aquarela p-7">
                <p className="text-xl font-light">{g.title}</p>
                {g.description && (
                  <p className="mt-2 font-sans text-sm text-muted-foreground">{g.description}</p>
                )}
                {g.link_or_info && (
                  <p className="mt-3 font-sans text-sm break-words text-primary">{g.link_or_info}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section title="Confirmação de Presença" eyebrow="RSVP" flora="rose">
        <RsvpForm event={event} defaultCount={inviteType === "casal" ? 2 : 1} />
      </Section>

      {(event.contact_1_name || event.contact_2_name) && (
        <Section title="Contactos" flora="eucalipto">
          <div className="grid gap-6 text-center sm:grid-cols-2">
            {[
              { n: event.contact_1_name, p: event.contact_1_phone },
              { n: event.contact_2_name, p: event.contact_2_phone },
            ]
              .filter((c) => c.n)
              .map((c) => (
                <div key={c.n} className="card-aquarela p-7">
                  <p className="text-xl font-light">{c.n}</p>
                  <p className="mt-2 font-sans text-sm text-muted-foreground">{c.p}</p>
                </div>
              ))}
          </div>
        </Section>
      )}

      <footer className="relative mt-16 overflow-hidden border-t border-sage/40 px-6 pt-14 pb-10 text-center">
        <EucalyptusSpray className="text-sage pointer-events-none absolute -bottom-6 -left-6 opacity-50" size={150} />
        <FloralDivider />
        <p className="mt-6 font-sans text-xs tracking-[0.25em] text-muted-foreground uppercase">
          Convite criado com ♡ por
        </p>
        <p className="mt-2 text-lg font-light tracking-[0.2em] text-primary">Solar Eclipse</p>
        <Link
          to="/$slug"
          params={{ slug }}
          search={{ tipo: inviteType ?? undefined }}
          className="btn-brush mt-8"
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
