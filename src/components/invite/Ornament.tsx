import { cn } from "@/lib/utils";

/** Divisor editorial discreto: evita símbolos decorativos com aparência genérica/gerada. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)} aria-hidden="true">
      <span className="h-px w-16 bg-linear-to-r from-transparent to-gold/70 sm:w-24" />
      <span className="h-1.5 w-8 rounded-full border border-gold/70 bg-gold/20" />
      <span className="h-px w-16 bg-linear-to-l from-transparent to-gold/70 sm:w-24" />
    </div>
  );
}
