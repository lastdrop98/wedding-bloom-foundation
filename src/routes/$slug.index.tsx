import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { Ornament } from "@/components/invite/Ornament";
import { AquarelaCover } from "@/components/invite/templates/aquarela-botanica/Cover";
import { EventSeals } from "@/components/invite/InvitationSeal";
import { templateToneClass } from "@/lib/templates";
import { supabase } from "@/integrations/supabase/client";
import {
  AUDIO_BUCKET,
  looseDb,
  detail,
  GALLERY_BUCKET,
  eventTitle,
  fetchEventBySlug,
  formatDatePt,
  inviteBadgeHint,
  inviteBadgeLabel,
  parseInviteType,
  signedUrl,
} from "@/lib/event";

export const Route = createFileRoute("/$slug/")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    tipo: parseInviteType(search["tipo"]) ?? undefined,
  }),
  component: CoverPage,
  errorComponent: InviteRouteError,
});

function CoverPage() {
  const { slug } = Route.useParams();
  const { tipo } = Route.useSearch();
  const navigate = useNavigate();
  const inviteType = parseInviteType(tipo);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [music, setMusic] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [semanticCover, setSemanticCover] = useState<string | null>(null);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const e = await fetchEventBySlug(slug);
      if (!e) throw notFound();
      return e;
    },
  });

  useEffect(() => {
    if (!event) return;
    signedUrl(GALLERY_BUCKET, event.cover_image_path).then(setCover);
    signedUrl(AUDIO_BUCKET, event.music_path).then(setMusic);
    looseDb
      .from("event_media")
      .select("storage_path")
      .eq("event_id", event.id)
      .eq("slot", "cover")
      .maybeSingle()
      .then(({ data }: { data: { storage_path?: string } | null }) => {
        if (!data?.storage_path || event.cover_image_path) return;
        signedUrl(GALLERY_BUCKET, data.storage_path).then(setSemanticCover);
      });
  }, [event]);

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
        <p className="font-sans text-sm text-muted-foreground">Verifique o endereço que recebeu.</p>
      </div>
    );
  }

  if (event.template === "aquarela-botanica") {
    return <AquarelaCover event={event} slug={slug} inviteType={inviteType} />;
  }

  const badge = inviteBadgeLabel(inviteType);

  const inviteHomeHref = `/${encodeURIComponent(slug)}/home${inviteType ? `?tipo=${encodeURIComponent(inviteType)}` : ""}`;

  return (
    <main
      className={`${templateToneClass(event.template)} template-design-${event.template} relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center ${leaving ? "page-leave" : "page-enter"}`}
    >
      {/* Fundo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {cover || semanticCover ? (
          <img
            src={cover ?? semanticCover ?? undefined}
            alt={`Fotografia de ${eventTitle(event)}`}
            className="ken-burns h-full w-full object-cover will-change-transform"
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=90"
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.16_0.02_70/0.35)_0%,oklch(0.16_0.02_70/0.55)_45%,oklch(0.14_0.02_70/0.9)_100%)]" />
      </div>


      <div className="relative mx-auto max-w-2xl animate-fade-in">
        <p className="eyebrow text-cream/70">Convite</p>
        <h1 className="mt-8 text-[clamp(2.75rem,10vw,5.5rem)] leading-[1.05] font-light tracking-wide text-cream">
          {eventTitle(event)}
        </h1>

        <Ornament className="mt-10" />

        <p className="mt-8 font-sans text-sm tracking-[0.35em] text-cream/85 uppercase">
          {formatDatePt(event.event_date)}
        </p>
        {event.hashtag && (
          <p className="mt-3 font-sans text-xs tracking-[0.3em] text-gold uppercase">
            {event.hashtag}
          </p>
        )}

        {badge && (
          <div className="mx-auto mt-12 max-w-sm rounded-sm border border-gold/50 bg-[oklch(0.16_0.02_70/0.35)] px-6 py-5 backdrop-blur-sm">
            <p className="font-sans text-[0.7rem] tracking-[0.25em] text-gold uppercase">{badge}</p>
            <p className="mt-2 font-sans text-xs leading-relaxed text-cream/75">
              {inviteBadgeHint(inviteType)}
            </p>
          </div>
        )}

        <div className="mt-8">
          <EventSeals
            tipo={inviteType}
            enabled={detail(event, "seal_enabled")}
            mode={detail(event, "seal_mode")}
            oneText={detail(event, "seal_one_text")}
            twoText={detail(event, "seal_two_text")}
            oneLabel={detail(event, "seal_one_label")}
            twoLabel={detail(event, "seal_two_label")}
            oneColor={detail(event, "seal_one_color")}
            twoColor={detail(event, "seal_two_color")}
          />
        </div>

        <div className="mt-14">
          <a
            href={inviteHomeHref}
            onClick={() => {
              void audioRef.current?.play().catch(() => undefined);
              setLeaving(true);
            }}
            className="inline-flex items-center justify-center rounded-sm border border-gold/70 px-10 py-4 font-sans text-[0.7rem] tracking-[0.35em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-[oklch(0.18_0.02_70)]"
          >
            Abrir Convite
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <span className="breathe block h-12 w-px bg-linear-to-b from-transparent to-gold/80" />
      </div>

      {music && <audio ref={audioRef} src={music} loop preload="auto" />}
    </main>
  );
}


function InviteRouteError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f3] px-6 text-center text-[#1d1d1f]">
      <div className="max-w-md">
        <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#b08b3e]">Solar Eclipse</p>
        <h1 className="mt-4 text-3xl font-light tracking-tight">Esta página não carregou.</h1>
        <p className="mt-3 text-sm leading-6 text-black/50">O convite encontrou um erro temporário. Tente novamente ou volte ao início.</p>
        <div className="mt-7 flex justify-center gap-3">
          <button type="button" onClick={() => window.location.reload()} className="rounded-full border-2 border-black bg-black px-5 py-3 text-xs font-medium text-white">Tentar novamente</button>
          <a href="/" className="rounded-full border-2 border-black/15 bg-white px-5 py-3 text-xs font-medium">Início</a>
        </div>
      </div>
    </main>
  );
}
