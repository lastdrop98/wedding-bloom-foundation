import { createFileRoute, Link, notFound, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import {
  AUDIO_BUCKET,
  GALLERY_BUCKET,
  eventTitle,
  fetchEventBySlug,
  formatDatePt,
  inviteBadgeHint,
  inviteBadgeLabel,
  parseInviteType,
  signedUrl,
} from "@/lib/event";

export const Route = createFileRoute("/$slug")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    tipo: parseInviteType(search["tipo"]) ?? undefined,
  }),
  component: CoverPage,
});

function CoverPage() {
  const { slug } = Route.useParams();
  const { tipo } = Route.useSearch();
  const inviteType = parseInviteType(tipo);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [music, setMusic] = useState<string | null>(null);

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
  }, [event]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">A carregar…</div>;
  }

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-2xl font-light">Convite não encontrado</h1>
        <p className="text-sm text-muted-foreground">Verifique o endereço que recebeu.</p>
      </div>
    );
  }

  const badge = inviteBadgeLabel(inviteType);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      {cover && (
        <>
          <img
            src={cover}
            alt={`Fotografia de ${eventTitle(event)}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80" />
        </>
      )}

      <div className="relative">
        <p className="eyebrow">Convite</p>
        <h1 className="mt-6 text-5xl font-light leading-tight tracking-wide md:text-6xl">
          {eventTitle(event)}
        </h1>
        <span className="gold-rule mx-auto mt-8" />
        <p className="mt-8 text-lg text-muted-foreground">{formatDatePt(event.event_date)}</p>
        {event.hashtag && (
          <p className="mt-2 text-sm tracking-wider text-primary">{event.hashtag}</p>
        )}

        {badge && (
          <div className="mx-auto mt-10 max-w-sm rounded-md border border-primary/40 bg-card/70 px-5 py-4">
            <p className="text-sm tracking-wider text-primary">{badge}</p>
            <p className="mt-1 text-xs text-muted-foreground">{inviteBadgeHint(inviteType)}</p>
          </div>
        )}

        <div className="mt-12">
          <Link
            to="/$slug/home"
            params={{ slug }}
            search={{ tipo: inviteType ?? undefined }}
            onClick={() => {
              void audioRef.current?.play().catch(() => undefined);
            }}
            className="inline-flex items-center justify-center rounded-md border border-primary px-8 py-3 text-sm tracking-widest uppercase text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Abrir Convite
          </Link>
        </div>
      </div>

      {music && <audio ref={audioRef} src={music} loop preload="auto" />}
      <Outlet />
    </main>
  );
}
