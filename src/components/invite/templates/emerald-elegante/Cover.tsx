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

export function EmeraldCover({
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
      className={`emerald-elegante relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center ${leaving ? "page-leave" : "page-enter"}`}
    >
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

      <div className="relative mx-auto max-w-2xl animate-fade-in">
        <p className="eyebrow text-cream/70">A União Matrimonial De</p>
        <h1 className="script-names mt-6 text-[clamp(3rem,13vw,6.5rem)] text-gold">
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
          <div className="mx-auto mt-12 max-w-sm rounded-sm border border-gold/50 bg-[oklch(0.16_0.02_70/0.35)] px-6 py-5 backdrop-blur-sm">
            <p className="font-sans text-[0.7rem] tracking-[0.25em] text-gold uppercase">{badge}</p>
            <p className="mt-2 font-sans text-xs leading-relaxed text-cream/75">
              {inviteBadgeHint(inviteType)}
            </p>
          </div>
        )}

        <div className="mt-14">
          <button type="button" onClick={openInvite} className="btn-emerald-solid">
            Ver Convite
          </button>
        </div>
      </div>

      <span className="breathe absolute bottom-8 left-1/2 block h-12 w-px -translate-x-1/2 bg-linear-to-b from-transparent to-gold/70" />

      {music && <audio ref={audioRef} src={music} loop preload="auto" />}
    </main>
  );
}
