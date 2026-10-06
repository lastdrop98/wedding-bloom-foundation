import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Coffee, Gem, Heart, Sparkles, type LucideIcon } from "lucide-react";
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
import { GiftQr } from "@/components/invite/GiftQr";
import { Guestbook } from "@/components/invite/Guestbook";
import { Ornament } from "@/components/invite/Ornament";
import { FlourishFrame } from "@/components/invite/Flourish";
import { FlipNumber } from "@/components/invite/FlipNumber";
import { SectionVines, VineDivider } from "@/components/invite/Vines";
import { Reveal } from "@/components/invite/Reveal";
import { EventSeals } from "@/components/invite/InvitationSeal";
import { TemplateAtmosphere } from "@/components/invite/TemplateAtmosphere";
import { getTemplateDefinition, templateToneClass } from "@/lib/templates";
import { AquarelaHome } from "@/components/invite/templates/aquarela-botanica/Home";
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

type GalleryImage = { url: string; caption: string | null; mediaType: string };

function GalleryCarousel({
  items,
  eventName,
  onOpen,
}: {
  items: GalleryImage[];
  eventName: string;
  onOpen: (item: GalleryImage) => void;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => {
      setActive((value) => (value + 1) % items.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;
  const visible = [0, 1, 2].map((offset) => items[(active + offset) % items.length]!);

  return (
    <div className="invite-carousel">
      <div className="invite-carousel-track">
        {visible.map((item, index) => (
          <div
            key={`${item.url}-${active}-${index}`}
            className={
              `invite-carousel-card ${index === 0 ? "is-active" : ""} ` +
              (item.mediaType === "video" ? "is-video" : "")
            }
          >
            {item.mediaType === "video" ? (
              <video src={item.url} muted autoPlay loop playsInline preload="metadata" />
            ) : (
              <button type="button" onClick={() => onOpen(item)} aria-label="Abrir fotografia">
                <img src={item.url} alt={item.caption ?? `Fotografia de ${eventName}`} loading="lazy" />
              </button>
            )}
            {item.caption && <span>{item.caption}</span>}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div className="invite-carousel-dots" aria-label="Navegação da galeria">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ir para fotografia ${index + 1}`}
              aria-current={index === active}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SolarEclipseBrandMark() {
  return (
    <div className="solar-eclipse-brand" aria-label="Solar Eclipse">
      <span className="solar-eclipse-brand-orbit" />
      <img src="/favicon.svg" alt="" aria-hidden="true" />
      <span className="solar-eclipse-brand-name">Solar Eclipse</span>
    </div>
  );
}

function Section({
  title,
  eyebrow,
  children,
  wide,
  dark,
  vines,
  sectionKey,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  wide?: boolean;
  dark?: boolean;
  vines?: "a" | "b" | "c";
  sectionKey?: string;
}) {
  return (
    <section data-template-section={sectionKey} className={`relative px-6 py-20 md:py-24 ${dark ? "section-dark" : ""}`}>
      {vines && <SectionVines variant={vines} />}
      {dark && <FlourishFrame size={80} />}
      <Reveal className={wide ? "relative mx-auto max-w-5xl" : "relative mx-auto max-w-2xl"}>
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
      {address && (
        <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">{address}</p>
      )}
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

function RsvpForm({
  event,
  defaultCount,
  message,
}: {
  event: EventRow;
  defaultCount: number;
  message?: string | null;
}) {
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
      <div className="card-elegant p-10 text-center">
        <Ornament />
        <p className="mt-6 text-xl font-light">A sua confirmação foi registada.</p>
        <p className="mt-2 font-sans text-sm text-muted-foreground">Muito obrigado!</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card-elegant space-y-5 p-7 font-sans md:p-9">
      {message && (
        <p className="text-center text-sm leading-relaxed text-muted-foreground">{message}</p>
      )}
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

type StoryMilestone = { icon: LucideIcon; date: string; title: string; text: string };

const STORY: StoryMilestone[] = [];

/** Timeline vertical com linha dourada que se desenha com o scroll. */
function StoryTimeline({ milestones = STORY }: { milestones?: StoryMilestone[] | undefined }) {
  const ref = useRef<HTMLOListElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const passed = vh * 0.7 - rect.top;
      setProgress(Math.min(1, Math.max(0, passed / (rect.height * 0.9))));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <ol ref={ref} className="relative mx-auto max-w-3xl">
      {/* Linha vertical central */}
      <span className="absolute top-0 bottom-0 left-4 w-px bg-gold/15 md:left-1/2 md:-translate-x-1/2" />
      <span
        className="absolute top-0 bottom-0 left-4 w-px origin-top bg-gold/70 transition-transform duration-300 ease-out md:left-1/2 md:-translate-x-1/2"
        style={{ transform: `scaleY(${progress})` }}
      />
      {milestones.map((m, i) => {
        const Icon = m.icon;
        const left = i % 2 === 0;
        return (
          <li
            key={m.title}
            className="relative pb-12 pl-14 last:pb-0 md:w-1/2 md:pl-0"
            style={{ marginLeft: left ? undefined : "auto" }}
          >
            {/* Nó na linha */}
            <span
              className="absolute top-6 left-4 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-gold/60 bg-background md:left-auto md:right-0 md:translate-x-1/2"
              style={left ? undefined : { left: 0, right: "auto", transform: "translateX(-50%)" }}
            >
              <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </span>
            <Reveal delay={i * 100} className={left ? "md:pr-14 md:text-right" : "md:pl-14"}>
              <div className="card-elegant p-6">
                <p className="font-sans text-[0.65rem] tracking-[0.3em] text-primary uppercase">
                  {m.date}
                </p>
                <p className="mt-2 text-xl font-light">{m.title}</p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                  {m.text}
                </p>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}

type PartyMember = { name: string; role: string };

const PARTY: PartyMember[] = [];

function TemplateHeroAccent({ template }: { template?: string | null }) {
  const family = getTemplateDefinition(template).family;
  const isHeritage = template === "xiguiane-tradicional" || template === "african-heritage";
  const isEditorial =
    template?.includes("minimalist") ||
    template === "editorial-dark" ||
    template === "cinematic-charcoal" ||
    template === "sapphire-editorial";
  const isGarden =
    template?.startsWith("garden-") ||
    template?.startsWith("romantic-") ||
    template === "floral-pearl" ||
    template === "aquarela-botanica";
  const isCeremonial =
    template?.startsWith("royal-") ||
    template === "baroque-gold" ||
    template?.startsWith("oriental-") ||
    template === "nikah-emerald" ||
    template === "traditional-bronze";

  if (isHeritage) {
    return (
      <div className="template-hero-accent template-hero-accent-heritage" aria-hidden="true">
        <span className="template-textile-band" />
        <span className="template-heritage-word">União · Família · Tradição</span>
        <span className="template-textile-band" />
      </div>
    );
  }

  if (isEditorial) {
    return (
      <div className="template-hero-accent template-hero-accent-editorial" aria-hidden="true">
        <span>01</span>
        <i />
        <span>WEDDING INVITATION</span>
      </div>
    );
  }

  if (isGarden) {
    return (
      <div className="template-hero-accent template-hero-accent-garden" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    );
  }

  if (isCeremonial) {
    return (
      <div className="template-hero-accent template-hero-accent-ceremonial" aria-hidden="true">
        <span>✦</span>
        <i />
        <span>{family}</span>
        <i />
        <span>✦</span>
      </div>
    );
  }

  return (
    <div className="template-hero-accent template-hero-accent-classic" aria-hidden="true">
      <span />
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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
  const [giftPhotos, setGiftPhotos] = useState<Record<string, string>>({});
  const [slotMedia, setSlotMedia] = useState<Record<string, string>>({});

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
    if (!content?.media.length) return;
    Promise.all(
      content.media.map(
        async (m) => [m.slot, await signedUrl(GALLERY_BUCKET, m.storage_path)] as const,
      ),
    ).then((pairs) => {
      const next = Object.fromEntries(pairs.filter((p): p is [string, string] => Boolean(p[1])));
      setSlotMedia(next);
      if (!event?.cover_image_path && next["cover"]) setCover(next["cover"]);
    });
  }, [content, event?.cover_image_path]);

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

  if (event.template === "aquarela-botanica") {
    return <AquarelaHome event={event} slug={slug} inviteType={inviteType} />;
  }

  const badge = inviteBadgeLabel(inviteType);
  const schedule = content?.schedule ?? [];
  const gifts = content?.gifts ?? [];
  const d = (field: Parameters<typeof detail>[1]) => detail(event, field);

  const storyMilestones = [1, 2, 3, 4]
    .map((n, index) => ({
      icon: [Coffee, Heart, Gem, Sparkles][index]!,
      date: d(`story_${n}_date` as Parameters<typeof detail>[1]) ?? "",
      title: d(`story_${n}_title` as Parameters<typeof detail>[1]) ?? "",
      text: d(`story_${n}_text` as Parameters<typeof detail>[1]) ?? "",
    }))
    .filter((item) => item.date || item.title || item.text);

  const partyMembers = [1, 2, 3, 4]
    .map((n) => ({
      name: d(`party_${n}_name` as Parameters<typeof detail>[1]) ?? "",
      role: d(`party_${n}_role` as Parameters<typeof detail>[1]) ?? "",
    }))
    .filter((m) => m.name || m.role);

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
    <main
      className={`${templateToneClass(event.template)} template-design-${event.template} pb-24`}
    >
      <TemplateAtmosphere template={event.template} />
      {slotMedia["background"] && (
        <div
          aria-hidden="true"
          className="template-background-media pointer-events-none fixed inset-0 -z-20"
          style={{
            backgroundImage: `linear-gradient(to bottom, color-mix(in oklab, var(--color-background) 88%, transparent), color-mix(in oklab, var(--color-background) 96%, transparent)), url(${slotMedia["background"]})`,
          }}
        />
      )}
      {/* Cabeçalho imersivo — a estrutura mantém os mesmos dados, mas cada família ganha uma direção de arte própria. */}
      <header className="template-hero relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {slotMedia["cover_video"] ? (
            <video
              src={slotMedia["cover_video"]}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={cover ?? undefined}
              aria-label={`Vídeo de abertura de ${eventTitle(event)}`}
              className="h-full w-full object-cover"
            />
          ) : cover ? (
            <img
              src={cover}
              alt={`Fotografia de ${eventTitle(event)}`}
              className="ken-burns h-full w-full object-cover will-change-transform"
            />
          ) : (
            <div className="template-hero-fallback h-full w-full" />
          )}
          <div className="template-hero-veil absolute inset-0" />
        </div>

        <div className="template-hero-content relative mx-auto max-w-3xl animate-fade-in">
          <SolarEclipseBrandMark />
          <TemplateHeroAccent template={event.template} />
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
              <p className="font-sans text-[0.7rem] tracking-[0.25em] text-gold uppercase">
                {badge}
              </p>
              <p className="mt-2 font-sans text-xs leading-relaxed text-cream/75">
                {inviteBadgeHint(inviteType)}
              </p>
            </div>
          )}

          <div className="mt-8">
            <EventSeals
              tipo={inviteType}
              enabled={d("seal_enabled")}
              mode={d("seal_mode")}
              oneText={d("seal_one_text")}
              twoText={d("seal_two_text")}
              oneLabel={d("seal_one_label")}
              twoLabel={d("seal_two_label")}
              oneColor={d("seal_one_color")}
              twoColor={d("seal_two_color")}
            />
          </div>

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

      {d("welcome_message") && (
        <Section sectionKey="welcome" title="Uma mensagem para vocês" eyebrow="Com carinho" vines="b">
          <div className="card-elegant mx-auto max-w-2xl p-8 text-center md:p-10">
            <p className="text-lg leading-relaxed font-light whitespace-pre-line">
              {d("welcome_message")}
            </p>
          </div>
        </Section>
      )}

      <Section sectionKey="countdown" title="Contagem Decrescente" eyebrow="Falta pouco" vines="c">
        <Countdown date={event.event_date} />
      </Section>

      <VineDivider className="my-6" />

      {(d("verse_text") || d("verse_2_text")) && (
        <Section sectionKey="word" title="Palavra" dark vines="a">
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
          <VineDivider className="my-6" />
          <Section sectionKey="couple" title="Os Noivos" wide vines="b">
            <div className="grid gap-8 sm:grid-cols-2">
              {[
                {
                  role: "A Noiva",
                  name: d("bride_name"),
                  parents: [d("bride_father_name"), d("bride_mother_name")].filter(Boolean).length
                    ? `Filha de ${[d("bride_father_name"), d("bride_mother_name")].filter(Boolean).join(" e ")}`
                    : "",
                  photo: slotMedia["bride"]
                    ? { url: slotMedia["bride"], caption: null, mediaType: "image" }
                    : galleryUrls[0],
                },
                {
                  role: "O Noivo",
                  name: d("groom_name"),
                  parents: [d("groom_father_name"), d("groom_mother_name")].filter(Boolean).length
                    ? `Filho de ${[d("groom_father_name"), d("groom_mother_name")].filter(Boolean).join(" e ")}`
                    : "",
                  photo: slotMedia["groom"]
                    ? { url: slotMedia["groom"], caption: null, mediaType: "image" }
                    : galleryUrls[1],
                },
              ].map((p, i) => (
                <Reveal key={p.role} delay={i * 100}>
                  <PersonCard role={p.role} name={p.name} parents={p.parents} photo={p.photo} />
                </Reveal>
              ))}
            </div>
          </Section>
        </>
      )}

      {event.event_type === "casamento" && (
        <Section
          sectionKey="story"
          title="A Nossa História"
          eyebrow={d("story_intro") || "O caminho até aqui"}
          wide
          dark
          vines="b"
        >
          {storyMilestones.length > 0 ? (
            <StoryTimeline milestones={storyMilestones} />
          ) : (
            <div className="card-elegant mx-auto max-w-2xl p-8 text-center md:p-10">
              <p className="font-sans text-sm leading-7 text-muted-foreground">
                A história do casal será apresentada aqui quando os momentos forem adicionados no editor.
              </p>
            </div>
          )}
        </Section>
      )}

      {slotMedia["story_video"] && (
        <Section sectionKey="story-video" title="Uma história em movimento" eyebrow="Vídeo" wide dark vines="b">
          <div className="overflow-hidden rounded-2xl border border-gold/30 bg-black shadow-2xl">
            <video
              src={slotMedia["story_video"]}
              controls
              playsInline
              preload="metadata"
              className="max-h-[70vh] w-full object-contain"
            />
          </div>
        </Section>
      )}

      {(slotMedia["section_1"] || slotMedia["section_2"]) && (
        <Section sectionKey="moments" title="Momentos especiais" eyebrow="Para guardar na memória" wide vines="c">
          <div className="grid gap-6 md:grid-cols-2">
            {[slotMedia["section_1"], slotMedia["section_2"]].filter(Boolean).map((url, index) => (
              <div key={url} className="card-elegant overflow-hidden">
                <img
                  src={url}
                  alt={`Momento especial ${index + 1} de ${eventTitle(event)}`}
                  loading="lazy"
                  className="h-72 w-full object-cover md:h-96"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {event.event_type === "casamento" && partyMembers.length > 0 && (
        <Section sectionKey="party" title="Padrinhos e Damas" eyebrow="Quem nos acompanha" wide vines="c">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partyMembers.map((m, i) => {
              const photo = galleryUrls[2 + i];
              return (
                <Reveal key={m.name || m.role} delay={i * 100}>
                  <div className="card-elegant p-6 text-center">
                    {photo ? (
                      <img
                        src={photo.url}
                        alt={m.name || m.role}
                        loading="lazy"
                        className="mx-auto h-24 w-24 rounded-full border border-gold/50 object-cover"
                      />
                    ) : (
                      <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-gold/60 bg-gold/10 text-2xl font-light text-primary">
                        {m.name ? initials(m.name) : "♡"}
                      </span>
                    )}
                    {m.name && <p className="mt-4 text-lg font-light">{m.name}</p>}
                    {m.role && (
                      <p className="mt-1 font-sans text-[0.65rem] tracking-[0.3em] text-primary uppercase">
                        {m.role}
                      </p>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Section>
      )}

      <Ornament />

      <Section sectionKey="schedule" title="Programa do Dia" dark vines="a">
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
                  <span className="mt-1 block font-sans text-sm text-muted-foreground">
                    {r.sub}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Ornament />

      {d("dress_code") && (
        <Section sectionKey="dress-code" title="Dress Code" eyebrow="Para o grande dia" vines="c">
          <div className="card-elegant mx-auto max-w-xl p-8 text-center">
            <p className="text-lg font-light whitespace-pre-line">{d("dress_code")}</p>
          </div>
        </Section>
      )}

      <Section sectionKey="location" title="Localização" wide vines="b">
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
          <VineDivider className="my-6" />
          <Section sectionKey="gallery" title="Galeria" wide dark vines="c">
            <GalleryCarousel
              items={galleryUrls}
              eventName={eventTitle(event)}
              onOpen={setLightbox}
            />
          </Section>
        </>
      )}

      <Ornament />

      <Section sectionKey="gifts" title="Presentes" vines="b">
        <div className="grid gap-6">
          <div className="card-elegant p-7">
            <p className="eyebrow">Dados bancários</p>
            <dl className="mt-4 space-y-2 font-sans text-sm text-muted-foreground">
              {d("bank_holder") && <div>Titular: {d("bank_holder")}</div>}
              {d("bank_name") && <div>Banco: {d("bank_name")}</div>}
              {d("bank_account") && <div>Conta: {d("bank_account")}</div>}
              {d("bank_nib") && <div>NIB/IBAN: {d("bank_nib")}</div>}
              {d("mpesa_number") && <div>M-Pesa: {d("mpesa_number")}</div>}
              {d("emola_number") && <div>e-Mola: {d("emola_number")}</div>}
              {d("mkesh_number") && <div>mKesh: {d("mkesh_number")}</div>}
            </dl>
            {d("bank_payment_note") && (
              <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">
                {d("bank_payment_note")}
              </p>
            )}
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
                  <div className="card-elegant h-full overflow-hidden">
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

      <Ornament />

      <Section sectionKey="guestbook" title="Livro de Recados" vines="c">
        <Guestbook eventId={event.id} />
      </Section>

      <Ornament />

      <Section sectionKey="rsvp" title="Confirmação de Presença" eyebrow="RSVP" dark vines="a">
        <RsvpForm
          event={event}
          defaultCount={inviteType === "casal" ? 2 : 1}
          message={d("rsvp_message")}
        />
      </Section>

      {(event.contact_1_name || event.contact_2_name) && (
        <Section sectionKey="contacts" title="Contactos" vines="c">
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

      {d("closing_message") && (
        <section className="mx-auto max-w-2xl px-6 py-12 text-center">
          <Ornament />
          <p className="mt-6 text-xl font-light leading-relaxed whitespace-pre-line">
            {d("closing_message")}
          </p>
        </section>
      )}

      <footer className="section-dark relative mt-16 overflow-hidden border-t border-gold/25 px-6 pt-14 pb-10 text-center">
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
