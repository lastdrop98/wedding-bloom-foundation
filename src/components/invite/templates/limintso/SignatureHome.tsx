import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown, Gift, Heart, Home, MapPin, Menu, Pause, Play, Share2, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { GiftQr } from "@/components/invite/GiftQr";
import { Guestbook } from "@/components/invite/Guestbook";
import { detail, eventTitle, formatDatePt, mapsUrl, type EventRow } from "@/lib/event";
import { getTemplateVisualFamily } from "@/lib/templates";
import { EclipseMark } from "@/components/EclipseMark";

type MediaItem = { url: string; mediaType: string };

const DEMO_BRIDE_IMAGE = "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85";
const DEMO_GROOM_IMAGE = "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=85";
type GalleryItem = { url: string; caption?: string | null; mediaType?: string };

type SignatureContent = {
  schedule?: Array<{ id: string; time_label?: string | null; title: string; description?: string | null }>;
  gifts?: Array<{ id: string; title: string; description?: string | null; link_or_info?: string | null; image_path?: string | null }>;
};

type Props = {
  preview?: boolean | undefined;
  event: EventRow;
  inviteType?: "individual" | "casal" | null | undefined;
  content?: SignatureContent | null | undefined;
  cover?: string | null | undefined;
  music?: string | null | undefined;
  slotMedia: Record<string, MediaItem>;
  galleryUrls: GalleryItem[];
  galleryMediaUrls: GalleryItem[];
  giftPhotos: Record<string, string>;
};

export function LimintsoSignatureHome({
  event,
  preview = false,
  inviteType,
  content,
  cover,
  music,
  slotMedia,
  galleryUrls,
  galleryMediaUrls,
  giftPhotos,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [liked, setLiked] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpBusy, setRsvpBusy] = useState(false);
  const [rsvp, setRsvp] = useState({ name: "", phone: "", attending: "sim", count: inviteType === "casal" ? "2" : "1", message: "" });
  const rootRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [coverPlaying, setCoverPlaying] = useState(true);
  const [activeSection, setActiveSection] = useState("capa");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestLimit, setGuestLimit] = useState<number | null>(null);

  useEffect(() => {
    if (preview) return;
    const token = new URLSearchParams(window.location.search).get("g");
    if (!token) return;
    setRsvpSent(window.localStorage.getItem(`solar-rsvp:${event.id}:${token}`) === "1");
    let active = true;
    void supabase.from("guests").select("id,name,invited_count").eq("token", token).eq("event_id", event.id).maybeSingle().then(({ data }) => {
      if (!active || !data) return;
      setGuestId(data.id);
      setGuestLimit(data.invited_count);
      setRsvp((form) => ({ ...form, name: data.name, count: String(data.invited_count ?? form.count) }));
    });
    return () => { active = false; };
  }, [event.id, preview]);

  function goTo(id: string) {
    const root = rootRef.current;
    const target = root?.querySelector<HTMLElement>(`[data-signature-section="${id}"]`);
    if (!root || !target) return;
    const scroller = root.closest<HTMLElement>("[data-signature-scroll], [data-model-demo-scroll]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (scroller) {
      scroller.scrollTo({ top: target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 76, behavior: reduced ? "instant" : "smooth" });
    } else {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 76, behavior: reduced ? "instant" : "smooth" });
    }
    setActiveSection(id);
    setMenuOpen(false);
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scroller = root.closest<HTMLElement>("[data-signature-scroll], [data-model-demo-scroll]");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.getAttribute("data-signature-section") ?? "capa");
    }, { root: scroller, rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    root.querySelectorAll("[data-signature-section]").forEach((section) => observer.observe(section));
    const closeMenu = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", closeMenu);
    return () => { observer.disconnect(); window.removeEventListener("keydown", closeMenu); };
  }, []);

  const d = (field: Parameters<typeof detail>[1]) => detail(event, field);
  const title = eventTitle(event);
  const schedule = content?.schedule ?? [];
  const gifts = content?.gifts ?? [];
  const media = useMemo(
    () => [...galleryUrls, ...galleryMediaUrls].filter((item, index, list) => list.findIndex((x) => x.url === item.url) === index),
    [galleryUrls, galleryMediaUrls],
  );

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio || !music) return;
    if (musicOn) { audio.pause(); setMusicOn(false); }
    else void audio.play().then(() => setMusicOn(true)).catch(() => toast.info("Toque novamente para iniciar a música."));
  }

  function toggleCover() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().then(() => setCoverPlaying(true)).catch(() => setCoverPlaying(false));
    else { video.pause(); setCoverPlaying(false); }
  }

  async function submitRsvp(e: React.FormEvent) {
    e.preventDefault();
    if (rsvpBusy || rsvpSent) return;
    if (!rsvp.name.trim()) { toast.error("Indique o seu nome."); return; }
    if (preview) { setRsvpSent(true); return; }
    setRsvpBusy(true);
    const { error } = await supabase.from("rsvps").insert({
      event_id: event.id,
      guest_name: rsvp.name.trim(),
      guest_phone: rsvp.phone.trim() || null,
      attending: rsvp.attending === "sim",
      guest_count: Math.max(1, Math.min(guestLimit ?? (inviteType === "individual" ? 1 : inviteType === "casal" ? 2 : 20), Number(rsvp.count) || 1)),
      message: rsvp.message.trim() || null,
    });
    setRsvpBusy(false);
    if (error) {
      toast.error("Não foi possível enviar a confirmação.");
      return;
    }
    if (guestId) await supabase.from("guests").update({ rsvp_status: rsvp.attending === "sim" ? "sim" : "nao" }).eq("id", guestId).eq("event_id", event.id);
    const token = new URLSearchParams(window.location.search).get("g");
    if (token) window.localStorage.setItem(`solar-rsvp:${event.id}:${token}`, "1");
    setRsvpSent(true);
    toast.success("Confirmação enviada. Obrigado!");
  }

  const share = async () => {
    const data = { title, text: "Convite de casamento", url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard?.writeText(window.location.href);
      toast.success("Link copiado.");
    }
  };

  const coverMedia = slotMedia["cover_video"]?.url ? (
    <video ref={videoRef} onPause={() => setCoverPlaying(false)} onPlay={() => setCoverPlaying(true)} src={slotMedia["cover_video"].url} autoPlay muted loop playsInline poster={cover ?? undefined} className="size-full object-cover" />
  ) : cover ? (
    <img src={cover} alt={title} className="size-full object-cover" />
  ) : (
    <div className="signature-empty-cover" />
  );

  const family: string = getTemplateVisualFamily(event.template);
  const structureClass =
    event.template.startsWith("limintso-") || event.template === "premium-emerald" || event.template === "diamond-signature"
      ? "signature-structure-cards"
      : family === "cinema"
        ? "signature-structure-cinema"
        : family === "editorial"
          ? "signature-structure-editorial"
          : family === "heritage" || family === "mozambique"
            ? "signature-structure-ceremony"
            : family === "pearl" || family === "botanical"
              ? "signature-structure-organic"
              : family === "coastal" || family === "sunset"
                ? "signature-structure-destination"
                : "signature-structure-classic";

  const variantClass =
    event.template === "premium-emerald" || event.template === "limintso-emerald" || event.template === "limintso-premium" ? "variant-premium-emerald" :
    event.template === "limintso-mozambique" || family === "mozambique" ? "variant-mozambique" :
    event.template === "limintso-black" || family === "paper" ? "variant-black" :
    event.template === "limintso-sapphire" || family === "coastal" ? "variant-sapphire" :
    event.template === "limintso-forest" || family === "olive" ? "variant-forest" :
    event.template === "limintso-rose" || family === "atelier" ? "variant-rose" :
    family === "cinema" ? "variant-cinematic" :
    family === "portrait" ? "variant-portrait" :
    family === "heritage" ? "variant-heritage" :
    family === "sunset" ? "variant-sunset" :
    family === "pearl-editorial" || family === "pearl" ? "variant-pearl" :
    family === "editorial" ? "variant-editorial" :
    family === "royal" ? "variant-royal" :
    family === "botanical" ? "variant-botanical" :
    family === "celestial" ? "variant-celestial" :
    family === "coastal" ? "variant-coastal" :
    "variant-ivory";

  return (
    <main ref={rootRef} className={`limintso-signature ${variantClass} ${structureClass} ${preview ? "signature-preview" : ""}`} data-signature-template={event.template}>
      {music && <audio ref={audioRef} src={music} loop preload="none" onPause={() => setMusicOn(false)} />}
      <header className="limintso-header sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Button type="button" variant="ghost" onClick={() => goTo("capa")} className="signature-brand">
            <span className="limintso-mark">SE</span>
            <span>{"Solar Eclipse"}</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" type="button" onClick={share} className="limintso-icon-button signature-header-control" aria-label="Partilhar"><Share2 className="size-4" /></Button>
            <Button variant="ghost" type="button" onClick={() => setMenuOpen((v) => !v)} className="limintso-menu-button signature-header-control" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen}><Menu className="size-4" /></Button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mx-auto grid max-w-3xl grid-cols-2 gap-2 border-t border-border bg-card p-4 text-[10px] uppercase tracking-[.16em]">
            {[
              ["capa", "Início"], ["historia", "História"], ["programa", "Programa"], ["local", "Local"],
              ["rsvp", "RSVP"], ["presentes", "Presentes"], ["galeria", "Galeria"], ["felicitacoes", "Mensagens"],
            ].map(([id, label]) => (
              <Button type="button" variant="ghost" key={id} onClick={() => { if (id) goTo(id); }} className="rounded-xl border border-border bg-card px-3 py-3 text-center transition hover:border-primary/50 hover:-translate-y-px">{label}</Button>
            ))}
          </nav>
        )}
      </header>

      <section id={preview ? undefined : "capa"} data-signature-section="capa" className="limintso-section limintso-cover relative mx-auto max-w-3xl px-4 py-6 sm:px-6" data-signature-cover>
        <div className="limintso-cover-card">
          <div className="limintso-cover-media">{coverMedia}<div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/5 to-transparent" />{slotMedia["cover_video"]?.url && <Button type="button" variant="ghost" className="limintso-play-badge" onClick={toggleCover} aria-label={coverPlaying ? "Pausar vídeo de capa" : "Reproduzir vídeo de capa"}>{coverPlaying ? <Pause /> : <Play />}</Button>}</div>
          <div className="signature-cover-copy absolute inset-x-7 bottom-8 text-center sm:bottom-10">
            <p className="text-[9px] uppercase tracking-[.32em] text-primary-foreground/75">A união matrimonial de</p>
            <h1 className="mt-3 font-serif text-[clamp(3.3rem,13vw,6.8rem)] leading-[.8] tracking-[-.055em]">{title}</h1>
            <p className="mt-6 text-[10px] uppercase tracking-[.3em] text-primary-foreground/85">{formatDatePt(event.event_date)}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between px-2">
          <Button variant="ghost" type="button" onClick={toggleMusic} disabled={!music} className="limintso-round-action" aria-label={musicOn ? "Pausar música" : "Reproduzir música"} aria-pressed={musicOn}>
            {musicOn ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </Button>
          <Button variant="ghost" type="button" onClick={() => setLiked((v) => !v)} className={`limintso-round-action ${liked ? "is-liked" : ""}`} aria-label="Gostar" aria-pressed={liked}>
            <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </section>

      <section id={preview ? undefined : "boas-vindas"} data-signature-section="boas-vindas" className="limintso-section limintso-paper-card">
        <div className="limintso-seal">SE</div>
        <p className="limintso-kicker">Com a bênção de Deus</p>
        <p className="mt-5 font-serif text-2xl leading-relaxed italic">{d("welcome_message") || "É com muita alegria que partilhamos convosco este momento tão especial das nossas vidas."}</p>
        {(d("verse_text") || d("verse_reference")) && (
          <blockquote className="mt-8 border-t border-border pt-7">
            <p className="font-serif text-xl leading-relaxed italic">“{d("verse_text")}”</p>
            {d("verse_reference") && <cite className="mt-3 block text-[9px] uppercase tracking-[.22em] not-italic text-muted-foreground">{d("verse_reference")}</cite>}
          </blockquote>
        )}
        <div className="mt-8 flex justify-center"><ChevronDown className="size-5 animate-bounce text-primary" /></div>
      </section>

      <section id={preview ? undefined : "casal"} data-signature-section="casal" className="limintso-section">
        <p className="limintso-kicker">Os noivos</p>
        <h2 className="limintso-title">O nosso amor</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {[
            { label: "Noiva", name: d("bride_name"), parents: [d("bride_father_name"), d("bride_mother_name")].filter(Boolean), photo: slotMedia["bride"]?.url ?? DEMO_BRIDE_IMAGE },
            { label: "Noivo", name: d("groom_name"), parents: [d("groom_father_name"), d("groom_mother_name")].filter(Boolean), photo: slotMedia["groom"]?.url ?? DEMO_GROOM_IMAGE },
          ].map((person) => (
            <article key={person.label} className="limintso-person-card">
              <div className="limintso-person-photo">{person.photo ? <img src={person.photo} alt={person.name || person.label} /> : <div className="size-full bg-muted" />}</div>
              <div className="p-6 text-center">
                <p className="limintso-kicker">{person.label}</p>
                <h3 className="mt-2 font-serif text-3xl italic">{person.name || person.label}</h3>
                {person.parents.length > 0 && <p className="mt-3 text-xs leading-5 text-muted-foreground">Filho(a) de {person.parents.join(" e ")}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id={preview ? undefined : "familia"} data-signature-section="familia" className="limintso-section limintso-dark-card">
        <p className="limintso-kicker text-primary">Família e convidados</p>
        <h2 className="limintso-title text-primary-foreground">Quem nos acompanha</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[1,2,3,4].map((n) => {
            const name = d(`party_${n}_name` as Parameters<typeof detail>[1]);
            const role = d(`party_${n}_role` as Parameters<typeof detail>[1]);
            return name ? <div key={n} className="rounded-2xl border border-border/20 bg-card/5 p-5"><p className="font-serif text-xl text-primary-foreground">{name}</p><p className="mt-1 text-[9px] uppercase tracking-[.2em] text-muted-foreground">{role || "Família e amigos"}</p></div> : null;
          })}
        </div>
      </section>

      <section id={preview ? undefined : "historia"} data-signature-section="historia" className="limintso-section">
        <p className="limintso-kicker">A nossa história</p>
        <h2 className="limintso-title">De encontro a encontro</h2>
        {d("story_intro") && <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">{d("story_intro")}</p>}
        <div className="mt-8 space-y-4">
          {[1,2,3,4].map((n) => {
            const date = d(`story_${n}_date` as Parameters<typeof detail>[1]);
            const storyTitle = d(`story_${n}_title` as Parameters<typeof detail>[1]);
            const text = d(`story_${n}_text` as Parameters<typeof detail>[1]);
            if (!date && !storyTitle && !text) return null;
            return <article key={n} className="limintso-story-row"><span>{date || `0${n}`}</span><div><h3 className="font-serif text-2xl italic">{storyTitle || "Um momento especial"}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p></div></article>;
          })}
        </div>
        {slotMedia["story"]?.url && <img src={slotMedia["story"].url} alt="História do casal" className="mt-8 max-h-[520px] w-full rounded-[28px] object-cover" />}
        {slotMedia["story_video"]?.url && <video src={slotMedia["story_video"].url} controls playsInline className="mt-5 max-h-[70vh] w-full rounded-[28px] bg-ink object-contain" />}
      </section>

      <section id={preview ? undefined : "programa"} data-signature-section="programa" className="limintso-section limintso-paper-card">
        <p className="limintso-kicker">Programa</p>
        <h2 className="limintso-title">Um dia para guardar</h2>
        <div className="mt-8 space-y-3">
          {(schedule.length ? schedule : [
            { id: "civil", time_label: d("civil_ceremony_time"), title: "Cerimónia Civil", description: d("civil_ceremony_venue") },
            { id: "ceremony", time_label: d("ceremony_time"), title: "Cerimónia", description: d("ceremony_venue") },
            { id: "reception", time_label: d("reception_time"), title: "Receção", description: d("reception_venue") },
          ]).filter((item) => item.time_label || item.description).map((item) => (
            <div key={item.id} className="limintso-schedule-card">
              <span className="limintso-time">{item.time_label}</span>
              <div><h3 className="font-serif text-2xl italic">{item.title}</h3><p className="mt-1 text-xs text-muted-foreground">{item.description}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id={preview ? undefined : "local"} data-signature-section="local" className="limintso-section">
        <p className="limintso-kicker">Onde vamos celebrar</p>
        <h2 className="limintso-title">Localização</h2>
        <div className="mt-8 space-y-4">
          {[
            ["Cerimónia Civil", d("civil_ceremony_venue"), d("civil_ceremony_address"), d("civil_ceremony_time")],
            ["Cerimónia", d("ceremony_venue"), d("ceremony_address"), d("ceremony_time")],
            ["Receção", d("reception_venue"), d("reception_address"), d("reception_time")],
          ].map(([label, venue, address, time]) => venue || address ? (
            <article key={label} className="limintso-location-card">
              <div className="flex items-start gap-4"><span className="limintso-location-icon"><MapPin className="size-4" /></span><div><p className="limintso-kicker">{label}</p><h3 className="mt-2 font-serif text-2xl italic">{venue}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{address}</p>{time && <p className="mt-3 text-[10px] uppercase tracking-[.2em] text-muted-foreground">{time}</p>}</div></div>
              <a href={mapsUrl(address, venue)} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[9px] font-semibold uppercase tracking-[.18em] transition hover:-translate-y-px hover:bg-primary/10"><MapPin className="size-3" /> Ver mapa</a>
            </article>
          ) : null)}
        </div>
      </section>

      <section id={preview ? undefined : "contagem"} data-signature-section="contagem" className="limintso-section limintso-dark-card text-primary-foreground">
        <p className="limintso-kicker text-primary">Está a chegar</p>
        <h2 className="limintso-title text-primary-foreground">Contagem decrescente</h2>
        <SignatureCountdown date={event.event_date} />
      </section>

      {media.length > 0 && (
        <section id={preview ? undefined : "galeria"} data-signature-section="galeria" className="limintso-section">
          <div className="flex items-end justify-between gap-5"><div><p className="limintso-kicker">Memórias</p><h2 className="limintso-title">Galeria</h2></div><span className="text-[9px] uppercase tracking-[.18em] text-muted-foreground">{media.length} momentos</span></div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {media.map((item, index) => (
              <div key={item.url} className={`limintso-gallery-item ${index % 5 === 0 ? "tall" : ""} ${item.mediaType === "video" ? "video" : ""}`}>
                {item.mediaType === "video" ? <video src={item.url} controls playsInline preload="metadata" className="size-full object-cover" /> : <Button type="button" variant="ghost" className="signature-gallery-button" onClick={() => setLightbox(item)} aria-label={`Abrir ${item.caption || `fotografia ${index + 1}`}`}><img src={item.url} alt={item.caption || `Memória ${index + 1}`} loading="lazy" className="size-full object-cover" /></Button>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section id={preview ? undefined : "rsvp"} data-signature-section="rsvp" className="limintso-section limintso-paper-card">
        <p className="limintso-kicker">Confirme a sua presença</p>
        <h2 className="limintso-title">RSVP</h2>
        {d("rsvp_message") && <p className="mt-5 text-sm leading-7">{d("rsvp_message")}</p>}
        {event.rsvp_deadline && <p className="mt-4 text-xs">Confirme até {formatDatePt(event.rsvp_deadline)}</p>}
        {inviteType && <p className="mt-4 text-xs">Convite válido para {inviteType === "casal" ? "2 pessoas" : "1 pessoa"}</p>}
        {rsvpSent ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center"><Heart className="mx-auto size-7 text-primary" /><p className="mt-4 font-serif text-2xl italic">{preview ? "Demonstração concluída. Nenhuma confirmação foi enviada." : "Obrigado pela confirmação."}</p></div>
        ) : (
          <form onSubmit={submitRsvp} className="mt-8 space-y-4">
            <input value={rsvp.name} onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })} aria-label="Nome completo" placeholder="Nome completo" className="limintso-input" required />
            <input value={rsvp.phone} onChange={(e) => setRsvp({ ...rsvp, phone: e.target.value })} type="tel" aria-label="Telefone" placeholder="Telefone" className="limintso-input" />
            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" type="button" onClick={() => setRsvp({ ...rsvp, attending: "sim" })} aria-pressed={rsvp.attending === "sim"} className={`limintso-choice ${rsvp.attending === "sim" ? "is-active" : ""}`}>Vou participar</Button>
              <Button variant="ghost" type="button" onClick={() => setRsvp({ ...rsvp, attending: "nao" })} aria-pressed={rsvp.attending === "nao"} className={`limintso-choice ${rsvp.attending === "nao" ? "is-active" : ""}`}>Não vou</Button>
            </div>
            <input type="number" aria-label="Número de convidados" min="1" max={guestLimit ?? (inviteType === "individual" ? 1 : inviteType === "casal" ? 2 : 20)} value={rsvp.count} onChange={(e) => setRsvp({ ...rsvp, count: e.target.value })} className="limintso-input" placeholder="Número de convidados" />
            <textarea value={rsvp.message} onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })} rows={4} aria-label="Mensagem para os noivos" className="limintso-input resize-none" placeholder="Mensagem para os noivos (opcional)" />
            <Button variant="ghost" type="submit" disabled={rsvpBusy} className="limintso-primary-button">{rsvpBusy ? "A enviar…" : "Confirmar presença"}</Button>
          </form>
        )}
      </section>

      <section id={preview ? undefined : "felicitacoes"} data-signature-section="felicitacoes" className="limintso-section">
        <p className="limintso-kicker">Deixe uma mensagem</p>
        <h2 className="limintso-title">Felicitações</h2>
        {preview ? <SignatureDemoGuestbook /> : <Guestbook eventId={event.id} />}
      </section>

      <section id={preview ? undefined : "presentes"} data-signature-section="presentes" className="limintso-section limintso-paper-card">
        <p className="limintso-kicker">Com carinho</p>
        <h2 className="limintso-title">Presentes</h2>
        <div className="mt-8 space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-muted-foreground">Contribuição digital</p>
            <div className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
              {d("bank_holder") && <p>Titular: {d("bank_holder")}</p>}
              {d("bank_name") && <p>Banco: {d("bank_name")}</p>}
              {d("bank_account") && <p>Conta: {d("bank_account")}</p>}
              {d("bank_nib") && <p>NIB/IBAN: {d("bank_nib")}</p>}
              {d("mpesa_number") && <p>M-Pesa: {d("mpesa_number")}</p>}
              {d("emola_number") && <p>e-Mola: {d("emola_number")}</p>}
              {d("mkesh_number") && <p>mKesh: {d("mkesh_number")}</p>}
              {d("bank_payment_note") && <p>{d("bank_payment_note")}</p>}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {d("bank_nib") && <GiftQr text={`Banco: ${d("bank_name") || ""}\nNIB: ${d("bank_nib")}\nTitular: ${d("bank_holder") || ""}`} />}
              {d("mpesa_number") && <GiftQr text={`M-Pesa: ${d("mpesa_number")}`} label="QR M-Pesa" />}
              {d("emola_number") && <GiftQr text={`e-Mola: ${d("emola_number")}`} label="QR e-Mola" />}
            </div>
          </div>
          {gifts.length > 0 && gifts.map((gift) => (
            <article key={gift.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              {giftPhotos[gift.id] && <img src={giftPhotos[gift.id]} alt={gift.title} className="h-44 w-full object-cover" />}
              <div className="p-6"><h3 className="font-serif text-2xl italic">{gift.title}</h3>{gift.description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{gift.description}</p>}{gift.link_or_info && (/^https?:\/\//i.test(gift.link_or_info) ? <Button asChild variant="outline" className="mt-4"><a href={gift.link_or_info} target="_blank" rel="noreferrer">Ver presente</a></Button> : <p className="mt-3 text-sm text-muted-foreground break-words">{gift.link_or_info}</p>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="limintso-section text-center">
        <p className="font-serif text-4xl italic text-primary">Até ao nosso grande dia.</p>
        <div className="mx-auto mt-6 h-px w-20 bg-primary/55" />
        <p className="mt-6 text-[9px] uppercase tracking-[.26em] text-muted-foreground">Com amor, {title}</p>
      </section>

      <footer className="limintso-footer">
        <EclipseMark className="mx-auto size-9 text-primary-foreground" />
        <p className="mt-4 text-[9px] uppercase tracking-[.24em] text-muted-foreground">Convite criado com carinho por</p>
        <p className="mt-2 font-serif text-2xl italic text-primary-foreground">Solar Eclipse</p>
        <p className="mx-auto mt-4 max-w-xl text-xs leading-6 text-primary-foreground/65">Convites digitais elegantes, personalizados para celebrar histórias e aproximar família e amigos.</p>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 text-xs text-primary-foreground/70 sm:flex-row sm:gap-6">
          <a href="mailto:5olareclips353@gmail.com" className="transition hover:text-primary-foreground">5olareclips353@gmail.com</a>
          <a href="https://wa.me/258847404160" target="_blank" rel="noreferrer" className="transition hover:text-primary-foreground">WhatsApp: 84 740 4160</a>
        </div>
        <Button type="button" variant="ghost" onClick={() => goTo("capa")} className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/30 px-5 py-2 text-[9px] uppercase tracking-[.18em] text-primary-foreground/70 hover:border-border">Voltar à capa</Button>
      </footer>

      <nav className="limintso-bottom-nav" aria-label="Atalhos do convite">
        {[
          { id: "capa", label: "Capa", icon: Home }, { id: "programa", label: "Programa", icon: CalendarDays },
          { id: "local", label: "Mapa", icon: MapPin }, { id: "rsvp", label: "RSVP", icon: Heart }, { id: "presentes", label: "Presentes", icon: Gift },
        ].map(({ id, label, icon: Icon }) => <Button key={id} type="button" variant="ghost" onClick={() => goTo(id)} aria-current={activeSection === id ? "location" : undefined} className="signature-nav-item"><Icon /><span>{label}</span></Button>)}
      </nav>
      <Dialog open={lightbox !== null} onOpenChange={(open) => { if (!open) setLightbox(null); }}>
        <DialogContent className="signature-lightbox" aria-describedby={undefined}>
          <DialogTitle className="sr-only">{lightbox?.caption || "Fotografia do casal"}</DialogTitle>
          {lightbox && <img src={lightbox.url} alt={lightbox.caption || "Fotografia do casal"} />}
          {lightbox?.caption && <p>{lightbox.caption}</p>}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function SignatureCountdown({ date }: { date: string | null }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, []);
  if (!date) return null;
  const timestamp = new Date(date).getTime();
  if (!Number.isFinite(timestamp)) return null;
  const diff = Math.max(0, timestamp - now);
  const cells = [
    ["Dias", Math.floor(diff / 86400000)],
    ["Horas", Math.floor((diff % 86400000) / 3600000)],
    ["Minutos", Math.floor((diff % 3600000) / 60000)],
    ["Segundos", Math.floor((diff % 60000) / 1000)],
  ];
  return <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3">{cells.map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-border/20 bg-card/5 px-2 py-5 text-center"><strong className="block font-serif text-3xl font-normal text-primary">{String(value).padStart(2,"0")}</strong><span className="mt-2 block text-[8px] uppercase tracking-[.18em] text-muted-foreground">{label}</span></div>)}</div>;
}

function SignatureDemoGuestbook() {
  const [sent, setSent] = useState(false);
  return sent ? <p role="status" className="mt-8">Demonstração concluída. Nenhum recado foi publicado.</p> : (
    <form className="mt-8 space-y-4" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
      <input aria-label="O seu nome" placeholder="O seu nome" required maxLength={80} className="limintso-input" />
      <textarea aria-label="Recado" placeholder="Deixe uma mensagem carinhosa…" required maxLength={600} rows={4} className="limintso-input" />
      <Button type="submit" variant="ghost" className="limintso-primary-button">Deixar recado</Button>
    </form>
  );
}
