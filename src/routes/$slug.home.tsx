import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  AUDIO_BUCKET,
  GALLERY_BUCKET,
  coupleTitle,
  fetchWeddingBySlug,
  fetchWeddingContent,
  formatDatePt,
  inviteBadgeHint,
  inviteBadgeLabel,
  mapsUrl,
  parseInviteType,
  signedUrl,
  type Wedding,
} from "@/lib/wedding";
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border/70 px-6 py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-light tracking-wide">{title}</h2>
        <span className="gold-rule mx-auto mt-4" />
        <div className="mt-8 text-left">{children}</div>
      </div>
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
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const cells = [
    { label: "Dias", value: days },
    { label: "Horas", value: hours },
    { label: "Minutos", value: minutes },
    { label: "Segundos", value: seconds },
  ];
  return (
    <div className="mx-auto grid max-w-md grid-cols-4 gap-3">
      {cells.map((c) => (
        <div key={c.label} className="rounded-md border border-border bg-card px-2 py-4">
          <p className="text-2xl font-light text-primary">{c.value}</p>
          <p className="eyebrow mt-1">{c.label}</p>
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
    <div className="rounded-md border border-border bg-card p-5">
      <p className="eyebrow">{label}</p>
      {venue && <p className="mt-2 text-lg">{venue}</p>}
      {address && <p className="text-sm text-muted-foreground">{address}</p>}
      {time && <p className="mt-1 text-sm text-primary">{time}</p>}
      <a
        href={mapsUrl(address, venue)}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block text-xs tracking-wider text-primary underline-offset-4 hover:underline"
      >
        Ver no mapa
      </a>
    </div>
  );
}

function RsvpForm({ wedding, defaultCount }: { wedding: Wedding; defaultCount: number }) {
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
      wedding_id: wedding.id,
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
      <p className="text-center text-muted-foreground">
        A sua confirmação foi registada. Muito obrigado!
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
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
      <div className="grid gap-4 sm:grid-cols-2">
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
        <Label htmlFor="message">Mensagem para os noivos</Label>
        <Textarea
          id="message"
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>
      {wedding.rsvp_deadline && (
        <p className="text-xs text-muted-foreground">
          Confirme até {formatDatePt(wedding.rsvp_deadline)}.
        </p>
      )}
      <Button type="submit" className="w-full" disabled={busy}>
        Confirmar presença
      </Button>
    </form>
  );
}

function HomePage() {
  const { slug } = Route.useParams();
  const { tipo } = Route.useSearch();
  const inviteType = parseInviteType(tipo);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [music, setMusic] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [galleryUrls, setGalleryUrls] = useState<{ url: string; caption: string | null }[]>([]);

  const { data: wedding, isLoading } = useQuery({
    queryKey: ["wedding", slug],
    queryFn: () => fetchWeddingBySlug(slug),
  });

  const { data: content } = useQuery({
    queryKey: ["wedding-content", wedding?.id],
    queryFn: () => fetchWeddingContent(wedding!.id),
    enabled: Boolean(wedding?.id),
  });

  useEffect(() => {
    if (!wedding) return;
    signedUrl(AUDIO_BUCKET, wedding.music_path).then(setMusic);
  }, [wedding]);

  useEffect(() => {
    if (!content?.gallery.length) return;
    Promise.all(
      content.gallery.map(async (g) => ({
        url: await signedUrl(GALLERY_BUCKET, g.image_path),
        caption: g.caption,
      })),
    ).then((items) =>
      setGalleryUrls(items.filter((i): i is { url: string; caption: string | null } => Boolean(i.url))),
    );
  }, [content]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">A carregar…</div>;
  }
  if (!wedding) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-2xl font-light">Convite não encontrado</h1>
      </div>
    );
  }

  const badge = inviteBadgeLabel(inviteType);
  const schedule = content?.schedule ?? [];
  const gifts = content?.gifts ?? [];

  function toggleMusic() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play().then(() => setPlaying(true)).catch(() => undefined);
    }
  }

  return (
    <main className="pb-20">
      <header className="px-6 pt-16 pb-12 text-center">
        <p className="eyebrow">Convite de Casamento</p>
        <h1 className="mt-5 text-4xl font-light tracking-wide md:text-5xl">
          {coupleTitle(wedding)}
        </h1>
        <span className="gold-rule mx-auto mt-6" />
        <p className="mt-5 text-muted-foreground">{formatDatePt(wedding.wedding_date)}</p>
        {wedding.hashtag && <p className="mt-1 text-sm text-primary">{wedding.hashtag}</p>}

        {badge && (
          <div className="mx-auto mt-8 max-w-sm rounded-md border border-primary/40 bg-card px-5 py-4">
            <p className="text-sm tracking-wider text-primary">{badge}</p>
            <p className="mt-1 text-xs text-muted-foreground">{inviteBadgeHint(inviteType)}</p>
          </div>
        )}

        <div className="mt-10">
          <Countdown date={wedding.wedding_date} />
        </div>

        {music && (
          <button
            type="button"
            onClick={toggleMusic}
            className="mt-8 text-xs tracking-widest uppercase text-primary underline-offset-4 hover:underline"
          >
            {playing ? "Pausar música" : "Tocar música"}
          </button>
        )}
        {music && <audio ref={audioRef} src={music} loop preload="auto" />}
      </header>

      {(wedding.verse_text || wedding.verse_2_text) && (
        <Section title="Palavra">
          <div className="space-y-6 text-center italic text-muted-foreground">
            {wedding.verse_text && (
              <p>
                “{wedding.verse_text}”
                {wedding.verse_reference && (
                  <span className="mt-1 block not-italic text-xs tracking-wider text-primary">
                    {wedding.verse_reference}
                  </span>
                )}
              </p>
            )}
            {wedding.verse_2_text && (
              <p>
                “{wedding.verse_2_text}”
                {wedding.verse_2_reference && (
                  <span className="mt-1 block not-italic text-xs tracking-wider text-primary">
                    {wedding.verse_2_reference}
                  </span>
                )}
              </p>
            )}
          </div>
        </Section>
      )}

      <Section title="Os Noivos">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-5 text-center">
            <p className="eyebrow">A Noiva</p>
            <p className="mt-2 text-xl">{wedding.bride_name}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Filha de {[wedding.bride_father_name, wedding.bride_mother_name].filter(Boolean).join(" e ")}
            </p>
          </div>
          <div className="rounded-md border border-border bg-card p-5 text-center">
            <p className="eyebrow">O Noivo</p>
            <p className="mt-2 text-xl">{wedding.groom_name}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Filho de {[wedding.groom_father_name, wedding.groom_mother_name].filter(Boolean).join(" e ")}
            </p>
          </div>
        </div>
      </Section>

      <Section title="Programa do Dia">
        {schedule.length > 0 ? (
          <ul className="space-y-4">
            {schedule.map((item) => (
              <li key={item.id} className="flex gap-4 border-b border-border/60 pb-4 last:border-0">
                <span className="w-20 shrink-0 text-sm text-primary">{item.time_label}</span>
                <span>
                  <span className="block">{item.title}</span>
                  {item.description && (
                    <span className="block text-sm text-muted-foreground">{item.description}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-4">
            {[
              { t: wedding.civil_ceremony_time, n: "Cerimónia Civil", v: wedding.civil_ceremony_venue },
              { t: wedding.ceremony_time, n: "Cerimónia", v: wedding.ceremony_venue },
              { t: wedding.reception_time, n: "Receção", v: wedding.reception_venue },
            ]
              .filter((r) => r.v || r.t)
              .map((r) => (
                <li key={r.n} className="flex gap-4 border-b border-border/60 pb-4 last:border-0">
                  <span className="w-20 shrink-0 text-sm text-primary">{r.t}</span>
                  <span>
                    <span className="block">{r.n}</span>
                    <span className="block text-sm text-muted-foreground">{r.v}</span>
                  </span>
                </li>
              ))}
          </ul>
        )}
      </Section>

      <Section title="Localização">
        <div className="space-y-4">
          <LocationCard
            label="Cerimónia Civil"
            venue={wedding.civil_ceremony_venue}
            address={wedding.civil_ceremony_address}
            time={wedding.civil_ceremony_time}
          />
          <LocationCard
            label="Cerimónia"
            venue={wedding.ceremony_venue}
            address={wedding.ceremony_address}
            time={wedding.ceremony_time}
          />
          <LocationCard
            label="Receção"
            venue={wedding.reception_venue}
            address={wedding.reception_address}
            time={wedding.reception_time}
          />
        </div>
      </Section>

      {galleryUrls.length > 0 && (
        <Section title="Galeria">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galleryUrls.map((g) => (
              <figure key={g.url} className="overflow-hidden rounded-md border border-border">
                <img
                  src={g.url}
                  alt={g.caption ?? `Fotografia de ${coupleTitle(wedding)}`}
                  loading="lazy"
                  className="h-40 w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </Section>
      )}

      <Section title="Presentes">
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-card p-5">
            <p className="eyebrow">Dados bancários</p>
            <dl className="mt-3 space-y-1 text-sm">
              {wedding.bank_holder && <div>Titular: {wedding.bank_holder}</div>}
              {wedding.bank_name && <div>Banco: {wedding.bank_name}</div>}
              {wedding.bank_account && <div>Conta: {wedding.bank_account}</div>}
              {wedding.bank_nib && <div>NIB/IBAN: {wedding.bank_nib}</div>}
            </dl>
          </div>
          {gifts.map((g) => (
            <div key={g.id} className="rounded-md border border-border bg-card p-5">
              <p>{g.title}</p>
              {g.description && (
                <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
              )}
              {g.link_or_info && <p className="mt-1 text-sm text-primary">{g.link_or_info}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Confirmação de Presença">
        <RsvpForm wedding={wedding} defaultCount={inviteType === "casal" ? 2 : 1} />
      </Section>

      {(wedding.contact_1_name || wedding.contact_2_name) && (
        <Section title="Contactos">
          <div className="grid gap-4 sm:grid-cols-2 text-center">
            {[
              { n: wedding.contact_1_name, p: wedding.contact_1_phone },
              { n: wedding.contact_2_name, p: wedding.contact_2_phone },
            ]
              .filter((c) => c.n)
              .map((c) => (
                <div key={c.n} className="rounded-md border border-border bg-card p-4">
                  <p>{c.n}</p>
                  <p className="text-sm text-muted-foreground">{c.p}</p>
                </div>
              ))}
          </div>
        </Section>
      )}

      <div className="px-6 pt-10 text-center">
        <Link
          to="/$slug"
          params={{ slug }}
          search={{ tipo: inviteType ?? undefined }}
          className="text-xs tracking-widest uppercase text-primary underline-offset-4 hover:underline"
        >
          Voltar à capa
        </Link>
      </div>
    </main>
  );
}
