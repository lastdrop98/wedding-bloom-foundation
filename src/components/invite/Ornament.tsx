import { cn } from "@/lib/utils";

/** Linha fina dourada com um losango ao centro. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)} aria-hidden="true">
      <span className="h-px w-16 bg-linear-to-r from-transparent to-gold/70 sm:w-24" />
      <span className="size-1.5 rotate-45 border border-gold/80 bg-gold/30" />
      <span className="h-px w-16 bg-linear-to-l from-transparent to-gold/70 sm:w-24" />
    </div>
  );
}
