import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Heart, MapPin, Menu, Share2, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GiftQr } from "@/components/invite/GiftQr";
import { Guestbook } from "@/components/invite/Guestbook";
import { detail, eventTitle, formatDatePt, mapsUrl, type EventRow } from "@/lib/event";

type MediaItem = { url: string; mediaType: string };
type GalleryItem = { url: string; caption?: string | null; mediaType?: string };

type SignatureContent = {
  schedule?: Array<{ id: string; time_label?: string | null; title: string; description?: string | null }>;
  gifts?: Array<{ id: string; title: string; description?: string | null; link_or_info?: string | null; image_path?: string | null }>;
};

type Props = {
  event: EventRow;
  inviteType?: "individual" | "casal" | null;
  content?: SignatureContent | null;
  cover?: string | null;
  music?: string | null;
  slotMedia: Record<string, MediaItem>;
  galleryUrls: GalleryItem[];
  galleryMediaUrls: GalleryItem[];
  giftPhotos: Record<string, string>;
};

export function LimintsoSignatureHome({
  event,
  slug,
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
  const [audio] = useState(() => typeof Audio === "undefined" ? null : new Audio());

  const d = (field: Parameters<typeof detail>[1]) => detail(event, field);
  const title = eventTitle(event);
  const schedule = content?.schedule ?? [];
  const gifts = content?.gifts ?? [];
  const media = useMemo(
    () => [...galleryUrls, ...galleryMediaUrls].filter((item, index, list) => list.findIndex((x) => x.url === item.url) === index),
    [galleryUrls, galleryMediaUrls],
  );

  useEffect(() => {
    if (!audio || !event.music_path) return;
    if (music) audio.src = music;
    return () => { audio.pause(); };
  }, [audio, music]);

  function toggleMusic() {
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      return;
    }
    void audio.play().then(() => setMusicOn(true)).catch(() => toast.info("Toque novamente para iniciar a música."));
  }

  async function submitRsvp(e: React.FormEvent) {
    e.preventDefault();
    if (!rsvp.name.trim()) return toast.error("Indique o seu nome.");
    setRsvpBusy(true);
    const { error } = await supabase.from("rsvps").insert({
      event_id: event.id,
      guest_name: rsvp.name.trim(),
      guest_phone: rsvp.phone.trim() || null,
      attending: rsvp.attending === "sim",
      guest_count: Math.max(1, Math.min(20, Number(rsvp.count) || 1)),
      message: rsvp.message.trim() || null,
    });
    setRsvpBusy(false);
    if (error) {
      toast.error("Não foi possível enviar a confirmação.");
      return;
    }
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
    <video src={slotMedia["cover_video"].url} autoPlay muted loop playsInline poster={cover ?? undefined} className="size-full object-cover" />
  ) : cover ? (
    <img src={cover} alt={title} className="size-full object-cover" />
  ) : (
    <div className="size-full bg-[linear-gradient(145deg,#d8d1c6,#726b61)]" />
  );

  return (
    <main className="limintso-signature min-h-screen overflow-x-hidden bg-[#f6f3ee] text-[#51483d]">
      <header className="limintso-header sticky top-0 z-50 border-b border-[#c9a84c]/15 bg-[#fbfaf7]/94 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <a href="#capa" className="flex items-center gap-2 text-xs font-medium tracking-[.16em] uppercase">
            <span className="limintso-mark">SE</span>
            <span>Solar Eclipse</span>
          </a>
          <div className="flex items-center gap-2">
            <button type="button" onClick={share} className="limintso-icon-button" aria-label="Partilhar"><Share2 className="size-4" /></button>
            <button type="button" onClick={() => setMenuOpen((v) => !v)} className="limintso-menu-button" aria-label="Abrir menu"><Menu className="size-4" /></button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mx-auto grid max-w-3xl grid-cols-2 gap-2 border-t border-[#c9a84c]/10 bg-[#fbfaf7] p-4 text-[10px] uppercase tracking-[.16em]">
            {[
              ["capa", "Início"], ["historia", "História"], ["programa", "Programa"], ["local", "Local"],
              ["rsvp", "RSVP"], ["presentes", "Presentes"], ["galeria", "Galeria"], ["mensagens", "Mensagens"],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="rounded-xl border border-[#c9a84c]/20 bg-white px-3 py-3 text-center transition hover:border-[#c9a84c]/50 hover:-translate-y-px">{label}</a>
            ))}
          </nav>
        )}
      </header>

      <section id="capa" className="limintso-section limintso-cover relative mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="limintso-cover-card">
          <div className="limintso-cover-media">{coverMedia}<div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" /></div>
          <div className="absolute inset-x-7 bottom-8 text-center text-white sm:bottom-10">
            <p className="text-[9px] uppercase tracking-[.32em] text-white/75">A união matrimonial de</p>
            <h1 className="mt-3 font-serif text-[clamp(3.3rem,13vw,6.8rem)] leading-[.8] tracking-[-.055em]">{title}</h1>
            <p className="mt-6 text-[10px] uppercase tracking-[.3em] text-white/85">{formatDatePt(event.event_date)}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between px-2">
          <button type="button" onClick={toggleMusic} disabled={!music} className="limintso-round-action" aria-label="Música">
            {musicOn ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <button type="button" onClick={() => setLiked((v) => !v)} className={`limintso-round-action ${liked ? "is-liked" : ""}`} aria-label="Gostar">
            <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
          </button>
        </div>
      </section>

      <section id="boas-vindas" className="limintso-section limintso-paper-card">
        <div className="limintso-seal">SE</div>
        <p className="limintso-kicker">Com a bênção de Deus</p>
        <p className="mt-5 font-serif text-2xl leading-relaxed italic">{d("welcome_message") || "É com muita alegria que partilhamos convosco este momento tão especial das nossas vidas."}</p>
        {(d("verse_text") || d("verse_reference")) && (
          <blockquote className="mt-8 border-t border-[#c9a84c]/25 pt-7">
            <p className="font-serif text-xl leading-relaxed italic">“{d("verse_text")}”</p>
            {d("verse_reference") && <cite className="mt-3 block text-[9px] uppercase tracking-[.22em] not-italic text-[#9d8553]">{d("verse_reference")}</cite>}
          </blockquote>
        )}
        <div className="mt-8 flex justify-center"><ChevronDown className="size-5 animate-bounce text-[#b08e4d]" /></div>
      </section>

      <section id="casal" className="limintso-section">
        <p className="limintso-kicker">Os noivos</p>
        <h2 className="limintso-title">O nosso amor</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {[
            { label: "Noiva", name: d("bride_name"), parents: [d("bride_father_name"), d("bride_mother_name")].filter(Boolean), photo: slotMedia["bride"]?.url ?? media[0]?.url },
            { label: "Noivo", name: d("groom_name"), parents: [d("groom_father_name"), d("groom_mother_name")].filter(Boolean), photo: slotMedia["groom"]?.url ?? media[1]?.url },
          ].map((person) => (
            <article key={person.label} className="limintso-person-card">
              <div className="limintso-person-photo">{person.photo ? <img src={person.photo} alt={person.name || person.label} /> : <div className="size-full bg-[#ddd5c8]" />}</div>
              <div className="p-6 text-center">
                <p className="limintso-kicker">{person.label}</p>
                <h3 className="mt-2 font-serif text-3xl italic">{person.name || "Nome do convidado"}</h3>
                {person.parents.length > 0 && <p className="mt-3 text-xs leading-5 text-[#786d5e]">Filho(a) de {person.parents.join(" e ")}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="familia" className="limintso-section limintso-dark-card">
        <p className="limintso-kicker text-[#d7b56d]">Família e convidados</p>
        <h2 className="limintso-title text-white">Quem nos acompanha</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[1,2,3,4].map((n) => {
            const name = d(`party_${n}_name` as Parameters<typeof detail>[1]);
            const role = d(`party_${n}_role` as Parameters<typeof detail>[1]);
            return name ? <div key={n} className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><p className="font-serif text-xl text-white">{name}</p><p className="mt-1 text-[9px] uppercase tracking-[.2em] text-white/45">{role || "Família e amigos"}</p></div> : null;
          })}
        </div>
      </section>

      <section id="historia" className="limintso-section">
        <p className="limintso-kicker">A nossa história</p>
        <h2 className="limintso-title">De encontro a encontro</h2>
        {d("story_intro") && <p className="mt-5 max-w-2xl text-sm leading-7 text-[#756b5d]">{d("story_intro")}</p>}
        <div className="mt-8 space-y-4">
          {[1,2,3,4].map((n) => {
            const date = d(`story_${n}_date` as Parameters<typeof detail>[1]);
            const storyTitle = d(`story_${n}_title` as Parameters<typeof detail>[1]);
            const text = d(`story_${n}_text` as Parameters<typeof detail>[1]);
            if (!date && !storyTitle && !text) return null;
            return <article key={n} className="limintso-story-row"><span>{date || `0${n}`}</span><div><h3 className="font-serif text-2xl italic">{storyTitle || "Um momento especial"}</h3><p className="mt-2 text-sm leading-7 text-[#756b5d]">{text}</p></div></article>;
          })}
        </div>
        {slotMedia["story"]?.url && <img src={slotMedia["story"].url} alt="História do casal" className="mt-8 max-h-[520px] w-full rounded-[28px] object-cover" />}
        {slotMedia["story_video"]?.url && <video src={slotMedia["story_video"].url} controls playsInline className="mt-5 max-h-[70vh] w-full rounded-[28px] bg-black object-contain" />}
      </section>

      <section id="programa" className="limintso-section limintso-paper-card">
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
              <div><h3 className="font-serif text-2xl italic">{item.title}</h3><p className="mt-1 text-xs text-[#7b7061]">{item.description}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="local" className="limintso-section">
        <p className="limintso-kicker">Onde vamos celebrar</p>
        <h2 className="limintso-title">Localização</h2>
        <div className="mt-8 space-y-4">
          {[
            ["Cerimónia Civil", d("civil_ceremony_venue"), d("civil_ceremony_address"), d("civil_ceremony_time")],
            ["Cerimónia", d("ceremony_venue"), d("ceremony_address"), d("ceremony_time")],
            ["Receção", d("reception_venue"), d("reception_address"), d("reception_time")],
          ].map(([label, venue, address, time]) => venue || address ? (
            <article key={label} className="limintso-location-card">
              <div className="flex items-start gap-4"><span className="limintso-location-icon"><MapPin className="size-4" /></span><div><p className="limintso-kicker">{label}</p><h3 className="mt-2 font-serif text-2xl italic">{venue}</h3><p className="mt-2 text-sm leading-6 text-[#786d5e]">{address}</p>{time && <p className="mt-3 text-[10px] uppercase tracking-[.2em] text-[#9d8553]">{time}</p>}</div></div>
              <a href={mapsUrl(address, venue)} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/45 px-4 py-2 text-[9px] font-semibold uppercase tracking-[.18em] transition hover:-translate-y-px hover:bg-[#c9a84c]/10"><MapPin className="size-3" /> Ver mapa</a>
            </article>
          ) : null)}
        </div>
      </section>

      <section id="contagem" className="limintso-section limintso-dark-card text-white">
        <p className="limintso-kicker text-[#d7b56d]">Está a chegar</p>
        <h2 className="limintso-title text-white">Contagem decrescente</h2>
        <SignatureCountdown date={event.event_date} />
      </section>

      {media.length > 0 && (
        <section id="galeria" className="limintso-section">
          <div className="flex items-end justify-between gap-5"><div><p className="limintso-kicker">Memórias</p><h2 className="limintso-title">Galeria</h2></div><span className="text-[9px] uppercase tracking-[.18em] text-[#9d8553]">{media.length} momentos</span></div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {media.map((item, index) => (
              <div key={item.url} className={`limintso-gallery-item ${index % 5 === 0 ? "tall" : ""} ${item.mediaType === "video" ? "video" : ""}`}>
                {item.mediaType === "video" ? <video src={item.url} muted autoPlay loop playsInline className="size-full object-cover" /> : <img src={item.url} alt={item.caption || `Memória ${index + 1}`} loading="lazy" className="size-full object-cover" />}
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="rsvp" className="limintso-section limintso-paper-card">
        <p className="limintso-kicker">Confirme a sua presença</p>
        <h2 className="limintso-title">RSVP</h2>
        {rsvpSent ? (
          <div className="mt-8 rounded-2xl border border-[#c9a84c]/25 bg-white p-8 text-center"><Heart className="mx-auto size-7 text-[#b08e4d]" /><p className="mt-4 font-serif text-2xl italic">Obrigado pela confirmação.</p></div>
        ) : (
          <form onSubmit={submitRsvp} className="mt-8 space-y-4">
            <input value={rsvp.name} onChange={(e) => setRsvp({ ...rsvp, name: e.target.value })} placeholder="Nome completo" className="limintso-input" required />
            <input value={rsvp.phone} onChange={(e) => setRsvp({ ...rsvp, phone: e.target.value })} placeholder="Telefone" className="limintso-input" />
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRsvp({ ...rsvp, attending: "sim" })} className={`limintso-choice ${rsvp.attending === "sim" ? "is-active" : ""}`}>Vou participar</button>
              <button type="button" onClick={() => setRsvp({ ...rsvp, attending: "nao" })} className={`limintso-choice ${rsvp.attending === "nao" ? "is-active" : ""}`}>Não vou</button>
            </div>
            <input type="number" min="1" max="20" value={rsvp.count} onChange={(e) => setRsvp({ ...rsvp, count: e.target.value })} className="limintso-input" placeholder="Número de convidados" />
            <textarea value={rsvp.message} onChange={(e) => setRsvp({ ...rsvp, message: e.target.value })} rows={4} className="limintso-input resize-none" placeholder="Mensagem para os noivos (opcional)" />
            <button type="submit" disabled={rsvpBusy} className="limintso-primary-button">{rsvpBusy ? "A enviar…" : "Confirmar presença"}</button>
          </form>
        )}
      </section>

      <section id="felicitacoes" className="limintso-section">
        <p className="limintso-kicker">Deixe uma mensagem</p>
        <h2 className="limintso-title">Felicitações</h2>
        <Guestbook eventId={event.id} />
      </section>

      <section id="presentes" className="limintso-section limintso-paper-card">
        <p className="limintso-kicker">Com carinho</p>
        <h2 className="limintso-title">Presentes</h2>
        <div className="mt-8 space-y-5">
          <div className="rounded-2xl border border-[#c9a84c]/20 bg-white p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-[#9d8553]">Contribuição digital</p>
            <div className="mt-4 space-y-2 text-sm leading-6 text-[#786d5e]">
              {d("bank_holder") && <p>Titular: {d("bank_holder")}</p>}
              {d("bank_name") && <p>Banco: {d("bank_name")}</p>}
              {d("bank_account") && <p>Conta: {d("bank_account")}</p>}
              {d("bank_nib") && <p>NIB/IBAN: {d("bank_nib")}</p>}
              {d("mpesa_number") && <p>M-Pesa: {d("mpesa_number")}</p>}
              {d("emola_number") && <p>e-Mola: {d("emola_number")}</p>}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {d("bank_nib") && <GiftQr text={`Banco: ${d("bank_name") || ""}\nNIB: ${d("bank_nib")}\nTitular: ${d("bank_holder") || ""}`} />}
              {d("mpesa_number") && <GiftQr text={`M-Pesa: ${d("mpesa_number")}`} label="QR M-Pesa" />}
              {d("emola_number") && <GiftQr text={`e-Mola: ${d("emola_number")}`} label="QR e-Mola" />}
            </div>
          </div>
          {gifts.length > 0 && gifts.map((gift) => (
            <article key={gift.id} className="overflow-hidden rounded-2xl border border-[#c9a84c]/20 bg-white">
              {giftPhotos[gift.id] && <img src={giftPhotos[gift.id]} alt={gift.title} className="h-44 w-full object-cover" />}
              <div className="p-6"><h3 className="font-serif text-2xl italic">{gift.title}</h3>{gift.description && <p className="mt-2 text-sm leading-6 text-[#786d5e]">{gift.description}</p>}{gift.link_or_info && <p className="mt-3 text-sm text-[#9d8553]">{gift.link_or_info}</p>}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="limintso-section text-center">
        <p className="font-serif text-4xl italic text-[#806d4c]">Até ao nosso grande dia.</p>
        <div className="mx-auto mt-6 h-px w-20 bg-[#c9a84c]/55" />
        <p className="mt-6 text-[9px] uppercase tracking-[.26em] text-[#8b806f]">Com amor, {title}</p>
      </section>

      <footer className="limintso-footer">
        <div className="limintso-footer-mark">SE</div>
        <p className="mt-4 text-[9px] uppercase tracking-[.24em] text-white/45">Convite criado com carinho por</p>
        <p className="mt-2 font-serif text-2xl italic text-white">Solar Eclipse</p>
        <a href="#capa" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-[9px] uppercase tracking-[.18em] text-white/70 hover:border-white/45">Voltar à capa</a>
      </footer>

      <nav className="limintso-bottom-nav" aria-label="Atalhos do convite">
        {[
          ["capa", "Capa"], ["programa", "Programa"], ["local", "Mapa"], ["rsvp", "RSVP"], ["presentes", "Presentes"],
        ].map(([id, label]) => <a key={id} href={`#${id}`}><span>{label}</span></a>)}
      </nav>
    </main>
  );
}

function SignatureCountdown({ date }: { date: string | null }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, []);
  if (!date) return null;
  const diff = Math.max(0, new Date(date).getTime() - now);
  const cells = [
    ["Dias", Math.floor(diff / 86400000)],
    ["Horas", Math.floor((diff % 86400000) / 3600000)],
    ["Minutos", Math.floor((diff % 3600000) / 60000)],
    ["Segundos", Math.floor((diff % 60000) / 1000)],
  ];
  return <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3">{cells.map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[.04] px-2 py-5 text-center"><strong className="block font-serif text-3xl font-normal text-[#d7b56d]">{String(value).padStart(2,"0")}</strong><span className="mt-2 block text-[8px] uppercase tracking-[.18em] text-white/45">{label}</span></div>)}</div>;
}
