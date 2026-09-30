/**
 * Ilustrações botânicas em "aguarela" (SVG desenhado à mão, sem imagens externas).
 * Usadas para emoldurar secções do template "aquarela-botanica".
 */

type Props = { className?: string; size?: number };

/** Ramo de eucalipto — folhas ovais alternadas ao longo de um caule curvo. */
export function EucalyptusSpray({ className = "", size = 160 }: Props) {
  const leaves = Array.from({ length: 9 }, (_, i) => i);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 92C24 78 38 62 50 44 60 29 68 18 78 10"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.7"
      />
      {leaves.map((i) => {
        const t = i / (leaves.length - 1);
        const x = 8 + t * 70;
        const y = 92 - t * 82;
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <ellipse
            key={i}
            cx={x + side * 9}
            cy={y - 4}
            rx={9 - t * 3}
            ry={5.5 - t * 1.5}
            transform={`rotate(${side * 38} ${x + side * 9} ${y - 4})`}
            fill="currentColor"
            opacity={0.22}
          />
        );
      })}
    </svg>
  );
}

/** Rosa em aguarela — pétalas concêntricas suaves com folhagem. */
export function WatercolorRose({ className = "", size = 180 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* folhagem */}
      <g className="text-sage" opacity="0.35">
        <ellipse cx="30" cy="78" rx="20" ry="9" transform="rotate(-28 30 78)" fill="currentColor" />
        <ellipse cx="92" cy="80" rx="17" ry="8" transform="rotate(26 92 80)" fill="currentColor" />
        <path
          d="M60 92C52 100 40 104 28 104"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* pétalas exteriores */}
      <g className="text-rose">
        <circle cx="60" cy="55" r="34" fill="currentColor" opacity="0.16" />
        <circle cx="48" cy="48" r="24" fill="currentColor" opacity="0.18" />
        <circle cx="72" cy="52" r="22" fill="currentColor" opacity="0.16" />
        <circle cx="60" cy="62" r="20" fill="currentColor" opacity="0.2" />
        {/* espiral central */}
        <path
          d="M60 55m-11 0a11 11 0 1 0 22 0a11 11 0 1 0-22 0M60 55m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}

/** Pequeno ramo de bagas/flores para cantos. */
export function BerrySprig({ className = "", size = 120 }: Props) {
  const dots = [
    [24, 78],
    [36, 64],
    [30, 52],
    [46, 50],
    [42, 36],
    [56, 34],
  ] as const;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M14 90C26 76 34 64 44 52 52 42 60 32 70 24"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.2" fill="currentColor" opacity="0.3" />
      ))}
      <ellipse
        cx="62"
        cy="62"
        rx="12"
        ry="5"
        transform="rotate(30 62 62)"
        fill="currentColor"
        opacity="0.2"
      />
    </svg>
  );
}

/** Moldura floral: rosas e eucalipto nos cantos opostos de uma secção. */
export function BotanicalFrame({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <WatercolorRose className="absolute -top-6 -left-8 opacity-70" size={190} />
      <EucalyptusSpray
        className="text-sage absolute top-4 right-2 -scale-x-100 opacity-60"
        size={150}
      />
      <BerrySprig className="text-rose absolute bottom-2 left-3 opacity-60" size={120} />
      <WatercolorRose className="absolute -right-10 -bottom-10 rotate-180 opacity-60" size={170} />
    </div>
  );
}

/** Separador floral fino entre secções. */
export function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-linear-to-r from-transparent to-sage/50 sm:w-24" />
      <svg width="54" height="26" viewBox="0 0 54 26" fill="none">
        <ellipse
          cx="16"
          cy="13"
          rx="9"
          ry="4.5"
          transform="rotate(-24 16 13)"
          className="fill-sage"
          opacity="0.5"
        />
        <ellipse
          cx="38"
          cy="13"
          rx="9"
          ry="4.5"
          transform="rotate(24 38 13)"
          className="fill-sage"
          opacity="0.5"
        />
        <circle cx="27" cy="13" r="6" className="fill-rose" opacity="0.45" />
        <circle cx="27" cy="13" r="2.4" className="fill-gold-light" opacity="0.9" />
      </svg>
      <span className="h-px w-16 bg-linear-to-l from-transparent to-sage/50 sm:w-24" />
    </div>
  );
}
