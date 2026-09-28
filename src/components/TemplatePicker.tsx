import { Check } from "lucide-react";

import { TEMPLATE_OPTIONS, type TemplateDefinition } from "@/lib/templates";

const SWATCHES: Record<TemplateDefinition["tone"], string> = {
  gold: "from-zinc-950 via-zinc-800 to-amber-700",
  emerald: "from-emerald-950 via-emerald-800 to-amber-700",
  midnight: "from-slate-950 via-blue-950 to-slate-700",
  rose: "from-rose-950 via-rose-800 to-amber-200",
  sand: "from-stone-300 via-amber-100 to-orange-200",
  burgundy: "from-red-950 via-rose-900 to-amber-700",
  sapphire: "from-blue-950 via-blue-800 to-sky-400",
  xiguiane: "from-amber-950 via-orange-800 to-emerald-800",
};

export function TemplatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const families = Array.from(new Set(TEMPLATE_OPTIONS.map((item) => item.family)));

  return (
    <div className="space-y-5">
      {families.map((family) => (
        <section key={family} className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-sans text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {family}
            </p>
            <span className="font-sans text-[0.65rem] text-muted-foreground">
              {TEMPLATE_OPTIONS.filter((item) => item.family === family).length} modelo(s)
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATE_OPTIONS.filter((item) => item.family === family).map((item) => {
              const selected = value === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onChange(item.value)}
                  className={[
                    "group overflow-hidden rounded-xl border text-left transition-all",
                    selected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:-translate-y-0.5 hover:border-primary/50",
                  ].join(" ")}
                  aria-pressed={selected}
                >
                  <div className={`relative h-24 bg-gradient-to-br ${SWATCHES[item.tone]}`}>
                    <div className="absolute inset-3 rounded-lg border border-white/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-xl text-white/90">A&amp;B</span>
                    </div>
                    {selected && (
                      <span className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-white text-primary shadow">
                        <Check className="size-4" />
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium">{item.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
