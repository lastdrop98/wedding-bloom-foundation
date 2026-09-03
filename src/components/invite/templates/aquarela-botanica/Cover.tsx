import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
  AUDIO_BUCKET,
  GALLERY_BUCKET,
  eventTitle,
  formatDatePt,
  inviteBadgeHint,
  inviteBadgeLabel,
  signedUrl,
  type EventRow,
  type InviteType,
} from "@/lib/event";
import { BotanicalFrame, FloralDivider } from "./Botanicals";
import { Petals } from "./Petals";

export function AquarelaCover({
  event,
  slug,
  inviteType,
}: {
  event: EventRow;
  slug: string;
  inviteType: InviteType;
}) {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [music, setMusic] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    signedUrl(GALLERY_BUCKET, event.cover_image_path).then(setCover);
    signedUrl(AUDIO_BUCKET, event.music_path).then(setMusic);
  }, [event]);

  const badge = inviteBadgeLabel(inviteType);

  function openInvite() {
    if (leaving) return;
    void audioRef.current?.play().catch(() => undefined);
    setLeaving(true);
    setTimeout(() => {
      void navigate({
        to: "/$slug/home",
        params: { slug },
        search: { tipo: inviteType ?? undefined },
      });
    }, 500);
  }

  return (
    <main
      className={`aquarela relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center ${leaving ? "page-leave" : "page-enter"}`}
    >
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

      <div className="relative mx-auto max-w-2xl animate-fade-in">
        <p className="eyebrow text-foreground/60">Convite</p>
        <h1 className="script-names mt-6 text-[clamp(3rem,13vw,6.5rem)] text-primary">
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
          <div className="card-aquarela mx-auto mt-12 max-w-sm px-6 py-5">
            <p className="font-sans text-[0.7rem] tracking-[0.25em] text-primary uppercase">
              {badge}
            </p>
            <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground">
              {inviteBadgeHint(inviteType)}
            </p>
          </div>
        )}

        <div className="mt-14">
          <button type="button" onClick={openInvite} className="btn-brush">
            Abrir Convite
          </button>
        </div>
      </div>

      <span className="breathe absolute bottom-8 left-1/2 block h-12 w-px -translate-x-1/2 bg-linear-to-b from-transparent to-rose/70" />

      {music && <audio ref={audioRef} src={music} loop preload="auto" />}
    </main>
  );
}
