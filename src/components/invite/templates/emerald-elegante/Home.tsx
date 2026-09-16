import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
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
import { Reveal } from "@/components/invite/Reveal";
import { FlipNumber } from "@/components/invite/FlipNumber";
import { GiftQr } from "@/components/invite/GiftQr";
import { Guestbook } from "@/components/invite/Guestbook";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function Section({
  title,
  eyebrow,
  children,
  wide,
  id,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  wide?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className="relative px-6 py-20 md:py-24">
      <Reveal className={wide ? "mx-auto max-w-5xl" : "mx-auto max-w-2xl"}>
        <div className="flex flex-col items-center text-center">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="text-[clamp(1.75rem,5vw,2.75rem)] leading-tight font-light tracking-wide text-foreground">
            {title}
          </h2>
          <span className="gold-rule mt-5" />
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
        <div key={c.label} className="card-emerald px-2 py-5 text-center">
          <FlipNumber
            value={String(c.value).padStart(2, "0")}
            className="text-3xl font-light text-primary tabular-nums md:text-4xl"
          />
          <p className="eyebrow mt-2 text-[0.6rem]">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

type ProgramLine = { key: string; time: string | null; title: string; sub: string | null };

function ProgramItem({ line }: { line: ProgramLine }) {
  const hasMap = Boolean(line.title || line.sub);
  return (
    <li className="card-emerald flex flex-wrap items-start justify-between gap-4 p-6">
      <div className="flex min-w-0 items-start gap-5">
        <span className="w-20 shrink-0 font-sans text-xs tracking-[0.2em] text-primary uppercase">
          {line.time}
        </span>
        <span className="min-w-0">
          <span className="block text-xl font-light">{line.title}</span>
          {line.sub && (
            <span className="mt-1 block font-sans text-sm text-muted-foreground">{line.sub}</span>
          )}
        </span>
      </div>
      {hasMap && (
        <a
          href={mapsUrl(line.sub, line.title)}
          target="_blank"
          rel="noreferrer"
          className="btn-emerald-outline shrink-0"
        >
          Mapa
        </a>
      )}
    </li>
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
  photo?: { url: string } | undefined;
}) {
  return (
    <div className="text-center">
      <div className="arch-frame card-emerald mx-auto aspect-[3/4] w-full max-w-[16rem] p-0">
        {photo ? (
          <img
            src={photo.url}
            alt={name ?? role}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent">
            <Heart className="size-10 text-gold/50" strokeWidth={1} />
          </div>
        )}
      </div>
      <p className="eyebrow mt-6">{role}</p>
      <p className="script-names mt-2 text-4xl text-primary">{name}</p>
      {parents && (
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">{parents}</p>
      )}
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
      <div className="card-emerald p-10 text-center">
        <Heart className="mx-auto size-8 text-gold" strokeWidth={1.25} />
        <p className="mt-6 text-xl font-light">A sua confirmação foi registada.</p>
        <p className="mt-2 font-sans text-sm text-muted-foreground">Muito obrigado!</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card-emerald space-y-5 p-7 font-sans md:p-9">
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
      <button type="submit" className="btn-emerald-solid w-full" disabled={busy}>
        Confirmar presença
      </button>
    </form>
  );
}

type GalleryImage = { url: string; caption: string | null; mediaType: string };

export function EmeraldHome({
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
      content.gallery.map(async (g) => {
        const url = await signedUrl(GALLERY_BUCKET, g.image_path);
        if (!url) return null;
        return { url, caption: g.caption, mediaType: g.media_type };
      }),
    ).then((items) => setGalleryUrls(items.filter((i): i is GalleryImage => i !== null)));
  }, [content]);

  useEffect(() => {
    if (!content?.gifts.length) return;
    Promise.all(
      content.gifts.map(
        async (g) => [g.id, await signedUrl(GALLERY_BUCKET, g.image_path)] as const,
      ),
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

  const program: ProgramLine[] =
    schedule.length > 0
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
        ].filter((r) => r.time || r.sub);

  const secondVerseBg = galleryUrls[2]?.url ?? cover;

  return (
    <main className="emerald-elegante pb-24">
      <header className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {cover ? (
            <img
              src={cover}
              alt={`Fotografia de ${eventTitle(event)}`}
              className="ken-burns h-full w-full object-cover will-change-transform"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(120%_100%_at_50%_0%,oklch(0.3_0.03_80)_0%,oklch(0.18_0.02_70)_55%,oklch(0.12_0.01_70)_100%)]" />
          )}
          <div className="veil-emerald absolute inset-0" />
        </div>

        <div className="relative mx-auto max-w-3xl animate-fade-in">
          <p className="eyebrow text-cream/70">A União Matrimonial De</p>
          <h1 className="script-names mt-5 text-[clamp(2.75rem,12vw,6rem)] text-gold">
            {eventTitle(event)}
          </h1>
          <span className="gold-rule mx-auto mt-8" />
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
              <p className="font-sans text-[0.7rem] tracking-[0.25em] text-gold uppercase">
                {badge}
              </p>
              <p className="mt-2 font-sans text-xs leading-relaxed text-cream/75">
                {inviteBadgeHint(inviteType)}
              </p>
            </div>
          )}

          {music && (
            <button type="button" onClick={toggleMusic} className="btn-emerald-outline mt-10">
              {playing ? "Pausar música" : "Tocar música"}
            </button>
          )}
          {music && <audio ref={audioRef} src={music} loop preload="auto" />}
        </div>

        <span className="breathe absolute bottom-8 left-1/2 block h-12 w-px -translate-x-1/2 bg-linear-to-b from-transparent to-gold/70" />
      </header>

      {d("verse_text") && (
        <Section title="Palavra" eyebrow="Sagrada Escritura">
          <blockquote className="mx-auto max-w-2xl text-center">
            <p className="text-xl leading-relaxed font-light text-foreground/85 italic">
              “{d("verse_text")}”
            </p>
            {d("verse_reference") && (
              <footer className="mt-5 font-sans text-[0.7rem] tracking-[0.3em] text-primary uppercase">
                {d("verse_reference")}
              </footer>
            )}
          </blockquote>
        </Section>
      )}

      {(d("bride_name") || d("groom_name")) && (
        <Section title="Os Noivos" wide>
          <div className="grid gap-10 sm:grid-cols-2">
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
                <PersonCard role={p.role} name={p.name} parents={p.parents} photo={p.photo} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <section className="px-6 py-16 text-center">
        <Reveal className="mx-auto max-w-md">
          <Heart className="mx-auto size-8 text-gold" strokeWidth={1.25} />
          <h2 className="mt-5 text-2xl font-light tracking-wide text-foreground">
            Com a Bênção de Deus
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">
            Unimos as nossas vidas sob o olhar d'Aquele que nos trouxe até aqui, e queremos celebrar
            este novo capítulo convosco, que sempre estiveram ao nosso lado.
          </p>
        </Reveal>
      </section>

      <Section title="Programa do Dia">
        <ol className="space-y-4">
          {program.map((line) => (
            <ProgramItem key={line.key} line={line} />
          ))}
        </ol>
      </Section>

      <section className="band-emerald relative overflow-hidden px-6 py-20 text-center">
        <Reveal className="mx-auto max-w-xl">
          <p className="font-sans text-xs tracking-[0.35em] uppercase opacity-80">
            Amigos e Família
          </p>
          <h2 className="script-names mt-4 text-4xl">A vossa presença é o nosso maior presente</h2>
          <p className="mt-5 font-sans text-sm leading-relaxed opacity-90">
            Contamos convosco para celebrar este dia tão especial. Por favor, confirmem a vossa
            presença para que possamos preparar tudo com todo o carinho.
          </p>
          <a
            href="#rsvp"
            className="mt-8 inline-flex items-center justify-center rounded-full border border-white/70 px-8 py-3.5 font-sans text-[0.68rem] tracking-[0.28em] uppercase transition-colors hover:bg-white/15"
          >
            Confirmar Presença
          </a>
        </Reveal>
      </section>

      <Section title="Finalmente Vamos Casar!" eyebrow="Falta pouco">
        <Countdown date={event.event_date} />
      </Section>

      <Section title="Confirmação de Presença" eyebrow="RSVP" id="rsvp">
        <RsvpForm event={event} defaultCount={inviteType === "casal" ? 2 : 1} />
      </Section>

      <Section title="Livro de Recados">
        <Guestbook eventId={event.id} />
      </Section>

      <Section title="Presentes">
        <div className="grid gap-6">
          <div className="card-emerald p-7">
            <p className="eyebrow">Dados bancários</p>
            <dl className="mt-4 space-y-2 font-sans text-sm text-muted-foreground">
              {d("bank_holder") && <div>Titular: {d("bank_holder")}</div>}
              {d("bank_name") && <div>Banco: {d("bank_name")}</div>}
              {d("bank_account") && <div>Conta: {d("bank_account")}</div>}
              {d("bank_nib") && <div>NIB/IBAN: {d("bank_nib")}</div>}
            </dl>
            {d("bank_nib") && (
              <GiftQr
                text={`Banco: ${d("bank_name") ?? ""}\nNIB: ${d("bank_nib")}\nTitular: ${d("bank_holder") ?? ""}`}
              />
            )}
          </div>
          {gifts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {gifts.map((g, i) => (
                <Reveal key={g.id} delay={i * 100}>
                  <div className="card-emerald h-full overflow-hidden">
                    {giftPhotos[g.id] && (
                      <img
                        src={giftPhotos[g.id]}
                        alt={g.title}
                        loading="lazy"
                        className="h-44 w-full object-cover"
                      />
                    )}
                    <div className="p-7">
                      <p className="text-xl font-light">{g.title}</p>
                      {g.description && (
                        <p className="mt-2 font-sans text-sm text-muted-foreground">
                          {g.description}
                        </p>
                      )}
                      {g.link_or_info && (
                        <p className="mt-3 font-sans text-sm break-words text-primary">
                          {g.link_or_info}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Section>

      {d("verse_2_text") && (
        <section className="relative overflow-hidden px-6 py-24 text-center">
          <div className="absolute inset-0 -z-10">
            {secondVerseBg ? (
              <img src={secondVerseBg} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[oklch(0.16_0.02_70)]" />
            )}
            <div className="veil-emerald absolute inset-0" />
          </div>
          <Reveal className="mx-auto max-w-2xl">
            <p className="text-xl leading-relaxed font-light text-cream/90 italic">
              “{d("verse_2_text")}”
            </p>
            {d("verse_2_reference") && (
              <footer className="mt-5 font-sans text-[0.7rem] tracking-[0.3em] text-gold uppercase">
                {d("verse_2_reference")}
              </footer>
            )}
          </Reveal>
        </section>
      )}

      {(event.contact_1_name || event.contact_2_name) && (
        <Section title="Contactos">
          <div className="grid gap-6 text-center sm:grid-cols-2">
            {[
              { n: event.contact_1_name, p: event.contact_1_phone },
              { n: event.contact_2_name, p: event.contact_2_phone },
            ]
              .filter((c) => c.n)
              .map((c) => (
                <div key={c.n} className="card-emerald p-7">
                  <p className="text-xl font-light">{c.n}</p>
                  <p className="mt-2 font-sans text-sm text-muted-foreground">{c.p}</p>
                </div>
              ))}
          </div>
        </Section>
      )}

      <footer className="relative mt-16 border-t border-gold/25 px-6 pt-14 pb-10 text-center">
        <Heart className="mx-auto size-6 text-gold" strokeWidth={1.25} />
        <p className="mt-6 font-sans text-sm leading-relaxed text-muted-foreground">
          Obrigado por fazerem parte da nossa história. Esperamos convosco de coração aberto.
        </p>
        <p className="mt-6 font-sans text-xs tracking-[0.25em] text-muted-foreground uppercase">
          Convite criado com ♡ por
        </p>
        <p className="mt-2 text-lg font-light tracking-[0.2em] text-primary">Solar Eclipse</p>
        <Link
          to="/$slug"
          params={{ slug }}
          search={{ tipo: inviteType ?? undefined }}
          className="btn-emerald-outline mt-8"
        >
          Voltar à capa
        </Link>
      </footer>
    </main>
  );
}
