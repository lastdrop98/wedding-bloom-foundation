import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import {
  AUDIO_BUCKET,
  GALLERY_BUCKET,
  coupleTitle,
  fetchWeddingBySlug,
  formatDatePt,
  inviteBadgeHint,
  inviteBadgeLabel,
  parseInviteType,
  signedUrl,
} from "@/lib/wedding";

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

  const { data: wedding, isLoading } = useQuery({
    queryKey: ["wedding", slug],
    queryFn: async () => {
      const w = await fetchWeddingBySlug(slug);
      if (!w) throw notFound();
      return w;
    },
  });

  useEffect(() => {
    if (!wedding) return;
    signedUrl(GALLERY_BUCKET, wedding.cover_image_path).then(setCover);
    signedUrl(AUDIO_BUCKET, wedding.music_path).then(setMusic);
  }, [wedding]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">A carregar…</div>;
  }

  if (!wedding) {
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
            alt={`Fotografia de ${coupleTitle(wedding)}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/80" />
        </>
      )}

      <div className="relative">
        <p className="eyebrow">Convite de Casamento</p>
        <h1 className="mt-6 text-5xl font-light leading-tight tracking-wide md:text-6xl">
          {coupleTitle(wedding)}
        </h1>
        <span className="gold-rule mx-auto mt-8" />
        <p className="mt-8 text-lg text-muted-foreground">{formatDatePt(wedding.wedding_date)}</p>
        {wedding.hashtag && (
          <p className="mt-2 text-sm tracking-wider text-primary">{wedding.hashtag}</p>
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
    </main>
  );
}
