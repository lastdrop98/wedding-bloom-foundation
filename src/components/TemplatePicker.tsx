import { useMemo, useState } from "react";
import { Check, LayoutGrid, Search } from "lucide-react";

import { getTemplateUsesSignatureBase, getTemplateVisualFamily, TEMPLATE_OPTIONS, templateVisualClass, type TemplateDefinition } from "@/lib/templates";
import { LimintsoSignaturePreview } from "@/components/invite/templates/limintso/SignaturePreview";
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
  "Signature Cards / Emerald": "SIGNATURE",
  "Signature Cards / Romantic": "SIGNATURE",
  "Signature Cards / Minimal": "SIGNATURE",
  "Signature Cards / Destination": "SIGNATURE",
  "Signature Cards / Noir": "SIGNATURE",
  "Signature Cards / Botanical": "SIGNATURE",
  "Signature Cards / Africano": "SIGNATURE",
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
    <div className="template-picker space-y-5">
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
                  src={PREVIEW_IMAGES[getTemplateVisualFamily(item.value)] ?? PREVIEW_IMAGES["classic"]}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 size-full object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-black/35" />
                {item.value === "film-noir-motion" && <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,.35)_55%,rgba(0,0,0,.9)_100%)]"><span className="absolute left-3 top-3 border border-white/30 px-2 py-1 text-[8px] tracking-[.2em] text-white/60">FILM 01</span><span className="absolute bottom-3 left-3 right-3 h-px bg-white/20" /></div>}
{item.value.startsWith("limintso-") && item.value !== "limintso-emerald" && (
  <div className="absolute inset-0 bg-[#f4efe7]">
    <div className="absolute inset-x-4 top-3 h-5 border-b border-[#c9ab68]/45" />
    <div className="absolute inset-x-5 top-8 bottom-3 rounded-xl border border-[#c9ab68]/35 bg-white shadow-sm" />
    <div className="absolute inset-x-9 top-12 bottom-7 overflow-hidden rounded-lg bg-gradient-to-b from-[#b98a6a] to-[#efe4d5]">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-black/10" />
      <div className="absolute inset-x-0 bottom-4 text-center">
        <span className="block text-[5px] uppercase tracking-[.2em] text-[#8f7540]">Signature</span>
        <strong className="block font-serif text-lg text-[#5c4d35]">A&amp;M</strong>
      </div>
    </div>
    <span className="absolute right-7 top-4 rounded-full bg-[#c9ab68] px-2 py-1 text-[5px] font-semibold uppercase tracking-[.12em] text-white">Card</span>
  </div>
)}

                {item.value === "premium-emerald" && (
  <div className="absolute inset-0 bg-[#f4efe7]">
    <div className="absolute inset-x-4 top-3 h-5 border-b border-[#c9ab68]/45" />
    <div className="absolute inset-x-5 top-8 bottom-3 rounded-xl border border-[#c9ab68]/35 bg-white shadow-sm" />
    <div className="absolute inset-x-9 top-12 bottom-7 overflow-hidden rounded-lg">
      <img src={PREVIEW_IMAGES["pearl"]} alt="" className="size-full object-cover opacity-85" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-2 pb-2 pt-7 text-center text-white">
        <span className="block text-[5px] uppercase tracking-[.2em]">A união matrimonial de</span>
        <strong className="block font-serif text-lg">A&amp;M</strong>
        <span className="mt-1 block text-[5px] tracking-[.16em]">PACOTE PREMIUM</span>
      </div>
    </div>
    <span className="absolute right-7 top-4 rounded-full bg-[#c9ab68] px-2 py-1 text-[5px] font-semibold uppercase tracking-[.12em] text-white">Premium</span>
  </div>
)}

                {item.value === "limintso-emerald" && (
  <div className="absolute inset-0 bg-[#f4efe7]">
    <div className="absolute inset-x-4 top-3 h-5 border-b border-[#c9ab68]/45" />
    <div className="absolute inset-x-5 top-8 bottom-3 rounded-xl border border-[#c9ab68]/35 bg-white shadow-sm" />
    <div className="absolute inset-x-9 top-12 bottom-7 overflow-hidden rounded-lg">
      <img src={PREVIEW_IMAGES["pearl"]} alt="" className="size-full object-cover opacity-85" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-2 pt-6 text-center text-white">
        <span className="block text-[5px] uppercase tracking-[.2em]">A união matrimonial de</span>
        <strong className="block font-serif text-lg">A&amp;M</strong>
      </div>
    </div>
    <span className="absolute right-7 top-4 rounded-full bg-[#c9ab68] px-2 py-1 text-[5px] font-semibold uppercase tracking-[.12em] text-white">Emerald</span>
  </div>
)}

                {item.value === "editorial-magazine" && <div className="absolute inset-0 grid grid-cols-[38%_62%] bg-[#ece7de]"><div className="flex flex-col justify-between p-3 text-black"><span className="text-[7px] tracking-[.2em]">ISSUE 01</span><span className="font-serif text-2xl leading-[.8]">A&amp;<br/>M</span></div><div className="bg-black/20" /></div>}
                {item.value === "pearl-garden" && <><span className="absolute -left-8 top-2 size-28 rounded-full bg-white/25 blur-xl"/><span className="absolute right-4 bottom-2 size-14 rounded-full border border-white/45"/></>}
                {item.value === "celestial-ivory" && <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(164,123,49,.8)_0_1px,transparent_2px),radial-gradient(circle_at_75%_30%,rgba(164,123,49,.7)_0_1px,transparent_2px),radial-gradient(circle_at_55%_75%,rgba(164,123,49,.7)_0_1px,transparent_2px)]" />}
{item.value === "coastal-blue" && <div className="absolute inset-0 bg-[linear-gradient(165deg,transparent_45%,rgba(45,114,128,.5)_46%_49%,transparent_50%)]" />}
{item.value === "porcelain-botanical" && <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(160,63,72,.22)_0_2px,transparent_2px_14px)]" />}
                {item.value === "glass-garden" && <div className="absolute inset-5 rounded-[40%] border border-white/55 bg-white/15 backdrop-blur-sm" />}
                {item.value === "silk-ribbon" && <div className="absolute left-7 top-0 bottom-0 w-7 bg-gradient-to-r from-white/10 via-white/45 to-rose-900/20" />}
                {item.value === "dried-flower" && <div className="absolute right-5 top-4 h-24 w-12 rotate-12 rounded-[60%] border border-amber-900/25" />}
                {item.value === "elegant-leaf" && <div className="absolute right-3 top-1/2 h-24 w-14 -rotate-12 rounded-[60%_40%] border border-white/40" />}
                {item.value === "chateau-coastal" && <div className="absolute inset-3 rounded-[40px_4px] border border-white/40" />}
                {item.value === "lotus-atelier" && <div className="absolute inset-8 rounded-[50%_12%] border border-white/35" />}
                {item.value === "royal-forest" && <div className="absolute inset-2 border border-[#d7b56d]/45" />}
                {item.value === "double-happiness" && <div className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white/45" />}
                {item.value === "crystal-floral" && <div className="absolute inset-4 rounded-2xl border border-white/55 bg-white/10" />}
                {item.value === "ribbon-ivory" && <div className="absolute left-1/2 top-0 bottom-0 w-5 -translate-x-1/2 bg-white/20" />}
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

      {value && (() => {
        const selectedTemplate = TEMPLATE_OPTIONS.find((item) => item.value === value);
        return selectedTemplate ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Quer ver o convite completo?</p>
              <p className="text-xs text-muted-foreground">
                Abra a demonstração pública de “{selectedTemplate.label}” para explorar capa, secções e ritmo visual antes de publicar.
              </p>
            </div>
            <a
              href={`/modelos/${encodeURIComponent(selectedTemplate.value)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-background px-4 py-2 text-xs font-medium text-foreground transition hover:border-primary"
            >
              Ver modelo completo
            </a>
          </div>
        ) : null;
      })()}

      {getTemplateUsesSignatureBase(value) && (() => {
        const template = TEMPLATE_OPTIONS.find((item) => item.value === value);
        return template ? (
          <div className="mt-6 rounded-2xl border border-border bg-background p-3">
            <div className="mb-3 flex items-center justify-between gap-3 px-2">
              <div>
                <p className="text-sm font-medium">Pré-visualização real do convite</p>
                <p className="text-xs text-muted-foreground">O mesmo chassis usado no convite publicado.</p>
              </div>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] uppercase tracking-[.12em] text-primary">Live renderer</span>
            </div>
            <div data-signature-scroll className="signature-admin-preview">
              <LimintsoSignaturePreview template={template} />
            </div>
          </div>
        ) : null;
      })()}

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
