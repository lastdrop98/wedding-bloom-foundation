import { cn } from "@/lib/utils";

import { DrawnSvg } from "./DrawnSvg";

type VineProps = {
  className?: string | undefined;
  delay?: number | undefined;
  /** opacidade base do traçado (baixa, para ficar por trás do texto) */
  opacity?: number | undefined;
  flip?: boolean | undefined;
};

const STROKE = {
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 1,
};

/** Ramo vertical fino e orgânico — transição decorativa entre secções. */
export function VineVertical({ className, delay, opacity = 0.2, flip }: VineProps) {
  return (
    <DrawnSvg
      viewBox="0 0 60 400"
      preserveAspectRatio="none"
      delay={delay}
      className={cn(
        "text-gold",
        flip ? "-scale-x-100" : undefined,
        "h-full w-full select-none",
        className,
      )}
    >
      <g style={{ opacity }}>
        <path
          data-draw
          d="M30 0 C42 46 18 78 30 122 C42 166 16 198 30 244 C44 290 18 322 30 400"
          strokeWidth="1.1"
          {...STROKE}
        />
        <path
          data-draw
          d="M30 70 C46 66 56 54 54 40 C42 42 32 54 30 70Z"
          strokeWidth="0.9"
          {...STROKE}
        />
        <path
          data-draw
          d="M30 160 C14 156 4 144 6 130 C18 132 28 144 30 160Z"
          strokeWidth="0.9"
          {...STROKE}
        />
        <path
          data-draw
          d="M30 268 C48 264 58 250 55 236 C42 240 32 252 30 268Z"
          strokeWidth="0.9"
          {...STROKE}
        />
        <path data-draw d="M30 330 C16 336 10 350 14 362" strokeWidth="0.8" {...STROKE} />
        <circle data-dot cx="30" cy="204" r="2" fill="currentColor" />
        <circle data-dot cx="30" cy="300" r="1.6" fill="currentColor" />
      </g>
    </DrawnSvg>
  );
}

/** Vinha horizontal larga — atravessa por trás do conteúdo. */
export function VineHorizontal({ className, delay, opacity = 0.16, flip }: VineProps) {
  return (
    <DrawnSvg
      viewBox="0 0 800 160"
      preserveAspectRatio="none"
      delay={delay}
      className={cn("text-gold", flip ? "-scale-x-100" : undefined, "h-full w-full", className)}
    >
      <g style={{ opacity }}>
        <path
          data-draw
          d="M0 96 C120 96 180 42 300 44 C420 46 470 108 600 100 C700 94 750 62 800 58"
          strokeWidth="1.2"
          {...STROKE}
        />
        <path
          data-draw
          d="M150 74 C142 54 152 34 172 28 C180 46 172 66 150 74Z"
          strokeWidth="0.9"
          {...STROKE}
        />
        <path
          data-draw
          d="M310 44 C330 34 352 40 360 58 C342 68 320 62 310 44Z"
          strokeWidth="0.9"
          {...STROKE}
        />
        <path
          data-draw
          d="M520 82 C512 62 522 42 542 36 C550 54 542 74 520 82Z"
          strokeWidth="0.9"
          {...STROKE}
        />
        <path
          data-draw
          d="M660 92 C676 106 700 106 712 92 C698 78 674 78 660 92Z"
          strokeWidth="0.9"
          {...STROKE}
        />
        <circle data-dot cx="452" cy="86" r="2.2" fill="currentColor" />
      </g>
    </DrawnSvg>
  );
}

/** Ramo em arco (art nouveau) — elemento de fundo a meio de secções. */
export function VineBranch({ className, delay, opacity = 0.18, flip }: VineProps) {
  return (
    <DrawnSvg
      viewBox="0 0 320 320"
      delay={delay}
      className={cn("text-gold", flip ? "-scale-x-100" : undefined, "h-full w-full", className)}
    >
      <g style={{ opacity }}>
        <path
          data-draw
          d="M20 300 C60 240 60 168 108 122 C156 76 226 78 292 32"
          strokeWidth="1.2"
          {...STROKE}
        />
        <path
          data-draw
          d="M76 206 C50 196 34 170 40 142 C68 152 82 178 76 206Z"
          strokeWidth="0.9"
          {...STROKE}
        />
        <path
          data-draw
          d="M124 140 C136 110 168 92 198 100 C186 132 154 150 124 140Z"
          strokeWidth="0.9"
          {...STROKE}
        />
        <path
          data-draw
          d="M214 84 C220 60 244 44 268 48 C262 74 238 90 214 84Z"
          strokeWidth="0.9"
          {...STROKE}
        />
        <path
          data-draw
          d="M108 122 C92 108 88 86 100 70 C116 82 120 106 108 122Z"
          strokeWidth="0.8"
          {...STROKE}
        />
        <circle data-dot cx="292" cy="32" r="2.4" fill="currentColor" />
        <circle data-dot cx="46" cy="262" r="1.8" fill="currentColor" />
      </g>
    </DrawnSvg>
  );
}

/** Conjunto pronto a usar: vinhas de fundo para uma secção inteira. */
export function SectionVines({
  className,
  variant = "a",
}: {
  className?: string | undefined;
  variant?: "a" | "b" | "c" | undefined;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {variant === "a" && (
        <>
          <div className="absolute -top-6 -left-10 h-72 w-72 opacity-90">
            <VineBranch />
          </div>
          <div className="absolute right-0 bottom-0 h-64 w-64 opacity-90">
            <VineBranch flip delay={300} opacity={0.14} />
          </div>
        </>
      )}
      {variant === "b" && (
        <div className="absolute top-1/2 left-0 h-40 w-full -translate-y-1/2">
          <VineHorizontal delay={150} />
        </div>
      )}
      {variant === "c" && (
        <>
          <div className="absolute top-0 left-1/2 h-full w-16 -translate-x-1/2">
            <VineVertical opacity={0.12} />
          </div>
          <div className="absolute -right-8 bottom-4 h-56 w-56">
            <VineBranch flip delay={400} opacity={0.14} />
          </div>
        </>
      )}
    </div>
  );
}

/** Divisor vertical entre secções (fino, centrado). */
export function VineDivider({ className }: { className?: string | undefined }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none mx-auto h-28 w-14 opacity-70", className)}
    >
      <VineVertical opacity={0.35} />
    </div>
  );
}
