import { cn } from "@/lib/utils";

import { DrawnSvg } from "./DrawnSvg";

type Corner = "tl" | "tr" | "bl" | "br";

const ROTATION: Record<Corner, string> = {
  tl: "rotate-0",
  tr: "rotate-90",
  br: "rotate-180",
  bl: "-rotate-90",
};

/** Canto ornamentado dourado (linha curva fina tipo "flourish") que se desenha. */
export function Flourish({
  corner = "tl",
  className,
  size = 88,
  delay = 0,
}: {
  corner?: Corner | undefined;
  className?: string | undefined;
  size?: number | undefined;
  delay?: number | undefined;
}) {
  return (
    <DrawnSvg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      delay={delay}
      className={cn("absolute text-gold/45", ROTATION[corner], className)}
    >
      <path
        data-draw
        pathLength={1}
        d="M4 40 C4 18 18 4 40 4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        data-draw
        pathLength={1}
        d="M12 46 C12 26 26 12 46 12 C58 12 64 18 64 24 C64 30 58 34 52 32 C47 30 46 24 50 21"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        data-draw
        pathLength={1}
        d="M4 62 L4 52"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        data-draw
        pathLength={1}
        d="M62 4 L52 4"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.6"
      />
      <rect
        data-dot
        x="6.5"
        y="6.5"
        width="5"
        height="5"
        transform="rotate(45 9 9)"
        fill="currentColor"
        opacity="0.5"
      />
    </DrawnSvg>
  );
}

/** Os quatro cantos de uma secção. */
export function FlourishFrame({
  className,
  size,
}: {
  className?: string | undefined;
  size?: number | undefined;
}) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <Flourish corner="tl" size={size} className="top-3 left-3" />
      <Flourish corner="tr" size={size} delay={150} className="top-3 right-3" />
      <Flourish corner="bl" size={size} delay={300} className="bottom-3 left-3" />
      <Flourish corner="br" size={size} delay={450} className="right-3 bottom-3" />
    </div>
  );
}
