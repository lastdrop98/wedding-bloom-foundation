import { cn } from "@/lib/utils";

type Corner = "tl" | "tr" | "bl" | "br";

const ROTATION: Record<Corner, string> = {
  tl: "rotate-0",
  tr: "rotate-90",
  br: "rotate-180",
  bl: "-rotate-90",
};

/** Canto ornamentado dourado (linha curva fina tipo "flourish"). */
export function Flourish({
  corner = "tl",
  className,
  size = 88,
}: {
  corner?: Corner | undefined;
  className?: string | undefined;
  size?: number | undefined;

}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={cn("pointer-events-none absolute text-gold/45", ROTATION[corner], className)}
    >
      <path
        d="M4 40 C4 18 18 4 40 4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M12 46 C12 26 26 12 46 12 C58 12 64 18 64 24 C64 30 58 34 52 32 C47 30 46 24 50 21"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path d="M4 62 L4 52" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M62 4 L52 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <rect x="6.5" y="6.5" width="5" height="5" transform="rotate(45 9 9)" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/** Os quatro cantos de uma secção. */
export function FlourishFrame({ className, size }: { className?: string; size?: number }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <Flourish corner="tl" size={size} className="top-3 left-3" />
      <Flourish corner="tr" size={size} className="top-3 right-3" />
      <Flourish corner="bl" size={size} className="bottom-3 left-3" />
      <Flourish corner="br" size={size} className="right-3 bottom-3" />
    </div>
  );
}
