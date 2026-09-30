import { useMemo, useState } from "react";
import { Check, Search, Sparkles } from "lucide-react";

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

const FAMILY_ACCENTS: Record<string, string> = {
  Clássico: "CLÁSSICO",
  "Clássico / Luxury": "LUXURY",
  Minimalista: "MINIMAL",
  "Minimalista / Neutro": "MINIMAL",
  "Minimalista / Vermelho": "MINIMAL",
  "Minimalista / Lilás": "MINIMAL",
  "Minimalista / Claro": "MINIMAL",
  "Minimalista / Escuro": "MINIMAL",
  "Minimalista / Azul": "MINIMAL",
  Editorial: "EDITORIAL",
  "Editorial / Luxury": "EDITORIAL",
  "Editorial / Dark": "EDITORIAL",
  Cinemático: "CINEMATIC",
  "Barroco / Luxury": "BAROQUE",
  "Royal / Imperial": "ROYAL",
  Romântico: "ROMANTIC",
  "Romântico / Luxury": "ROMANTIC",
  "Garden / Natureza": "GARDEN",
  "Boho / Natural": "BOHO",
  "Boho / Floral": "BOHO",
  "Vintage / Heritage": "VINTAGE",
  "Europeu / Clássico": "EUROPEAN",
  Mediterrâneo: "MEDITERRANEAN",
  "Mediterrâneo / Siciliano": "SICILIAN",
  "Oriental / Tradicional": "HERITAGE",
  "Nikah / Cerimonial": "NIKAH",
  Tradicional: "TRADITIONAL",
  Tropical: "TROPICAL",
  "Tropical / Sunset": "TROPICAL",
  Floral: "FLORAL",
  "Tradicional Africano": "AFRICAN",
  "Floral / Garden": "BOTANICAL",
};

export function TemplatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("Todos");

  const families = useMemo(
    () => Array.from(new Set(TEMPLATE_OPTIONS.map((item) => item.family))),
    [],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return TEMPLATE_OPTIONS.filter((item) => {
      const matchesFamily = family === "Todos" || item.family === family;
      const matchesQuery =
        !normalized ||
        [item.label, item.family, item.description, item.value]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesFamily && matchesQuery;
    });
  }, [family, query]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-background/60 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por nome, estilo ou família…"
              className="h-10 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <span className="font-sans text-xs tracking-[0.12em] text-muted-foreground uppercase">
              {filtered.length} modelos
            </span>
          </div>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["Todos", ...families].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFamily(item)}
              className={[
                "shrink-0 rounded-full border px-3 py-1.5 font-sans text-[0.65rem] tracking-[0.1em] uppercase transition-colors",
                family === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
              ].join(" ")}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const selected = value === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={[
                "group overflow-hidden rounded-2xl border text-left transition-all",
                selected
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg",
              ].join(" ")}
              aria-pressed={selected}
            >
              <div
                className={`relative h-36 overflow-hidden bg-gradient-to-br ${SWATCHES[item.tone]}`}
              >
                <div className="absolute inset-3 rounded-xl border border-white/30" />
                <div className="absolute inset-x-0 top-5 text-center">
                  <p className="font-sans text-[0.55rem] tracking-[0.35em] text-white/65 uppercase">
                    {FAMILY_ACCENTS[item.family] ?? "INVITATION"}
                  </p>
                  <p className="mt-4 font-serif text-3xl font-light text-white/95">A&amp;B</p>
                  <span className="mx-auto mt-3 block h-px w-12 bg-white/60" />
                </div>
                <div className="absolute inset-x-0 bottom-3 text-center font-sans text-[0.5rem] tracking-[0.25em] text-white/70 uppercase">
                  {item.tone}
                </div>
                {selected && (
                  <span className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-white text-primary shadow">
                    <Check className="size-4" />
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{item.label}</p>
                  {selected && (
                    <span className="font-sans text-[0.6rem] tracking-[0.12em] text-primary uppercase">
                      Selecionado
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {!filtered.length && (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <p className="font-medium">Nenhum modelo encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente outra palavra ou remova o filtro de família.
          </p>
        </div>
      )}
    </div>
  );
}
