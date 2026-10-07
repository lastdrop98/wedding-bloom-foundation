import { useMemo, useState } from "react";
import { Check, LayoutGrid, Search } from "lucide-react";

import { getTemplateVisualFamily, TEMPLATE_OPTIONS, templateVisualClass, type TemplateDefinition } from "@/lib/templates";
import { getTemplateDirection } from "@/lib/templateDirections";

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

const PREVIEW_IMAGES: Record<string, string> = {
  classic: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  editorial: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  cinematic: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=80",
  botanical: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
  pearl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
  heritage: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=80",
  cinema: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=80",
  portrait: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
  olive: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
  atelier: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  mozambique: "https://images.unsplash.com/photo-1534791547706-9b3f7f6c8a4a?auto=format&fit=crop&w=900&q=80",
  sunset: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  paper: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80",
  "pearl-editorial": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
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
  "Cinemático / Editorial": "CINEMA",
  "Minimalista / Fotográfico": "PORTRAIT",
  "Minimalista / Natural": "OLIVE",
  "Romântico / Editorial": "ATELIER",
  "Tradicional Africano / Luxury": "MOÇAMBIQUE",
  "Destination / Tropical": "DESTINATION",
  "Garden / Luxury": "PEARL",
  "Cerimonial / Editorial": "CEREMONY",
  "Fotográfico / Cerimonial": "PORTRAIT",
  "Botânico / Carta": "LETTER",
  "Cinemático / História": "LOVE STORY",
  "Herança / Cerimonial": "HERITAGE",
  "Pérola / Editorial": "PEARL",
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
            <LayoutGrid className="size-4 text-primary" />
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
                className={`relative h-36 overflow-hidden ${templateVisualClass(item.value)} bg-gradient-to-br ${SWATCHES[item.tone]}`}
              >
                <img
                  src={PREVIEW_IMAGES[getTemplateVisualFamily(item.value)] ?? PREVIEW_IMAGES.classic}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 size-full object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-black/35" />
                {item.value === "film-noir-motion" && <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,.35)_55%,rgba(0,0,0,.9)_100%)]"><span className="absolute left-3 top-3 border border-white/30 px-2 py-1 text-[8px] tracking-[.2em] text-white/60">FILM 01</span><span className="absolute bottom-3 left-3 right-3 h-px bg-white/20" /></div>}
                {item.value === "editorial-magazine" && <div className="absolute inset-0 grid grid-cols-[38%_62%] bg-[#ece7de]"><div className="flex flex-col justify-between p-3 text-black"><span className="text-[7px] tracking-[.2em]">ISSUE 01</span><span className="font-serif text-2xl leading-[.8]">A&amp;<br/>M</span></div><div className="bg-black/20" /></div>}
                {item.value === "pearl-garden" && <><span className="absolute -left-8 top-2 size-28 rounded-full bg-white/25 blur-xl"/><span className="absolute right-4 bottom-2 size-14 rounded-full border border-white/45"/></>}
                {item.value === "celestial-ivory" && <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(164,123,49,.8)_0_1px,transparent_2px),radial-gradient(circle_at_75%_30%,rgba(164,123,49,.7)_0_1px,transparent_2px),radial-gradient(circle_at_55%_75%,rgba(164,123,49,.7)_0_1px,transparent_2px)]" />}
{item.value === "coastal-blue" && <div className="absolute inset-0 bg-[linear-gradient(165deg,transparent_45%,rgba(45,114,128,.5)_46%_49%,transparent_50%)]" />}
{item.value === "capulana-contemporary" && (
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,.12)_0_8px,transparent_8px_16px)]" />
                )}
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
                <div className="mt-4 grid gap-2 border-t border-border pt-3 text-[0.65rem] leading-relaxed text-muted-foreground">
                  {(() => {
                    const direction = getTemplateDirection(item);
                    return (
                      <>
                        <p><span className="font-medium text-foreground">Estrutura:</span> {direction.structure}</p>
                        <p><span className="font-medium text-foreground">Design:</span> {direction.design}</p>
                        <p><span className="font-medium text-foreground">Aparência:</span> {direction.appearance}</p>
                      </>
                    );
                  })()}
                </div>
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
