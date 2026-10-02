import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { TEMPLATE_OPTIONS } from "@/lib/templates";

export const Route = createFileRoute("/modelos")({
  component: ModelsPage,
  head: () => ({
    meta: [
      { title: "Modelos de Convites | Solar Eclipse" },
      {
        name: "description",
        content:
          "Explore a coleção de modelos premium de convites digitais de casamento Solar Eclipse.",
      },
    ],
  }),
});

const images = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
];

const filters = ["Todos", "Luxury", "Minimalista", "Romântico", "Garden", "Royal", "Tradicional", "Africano"];

function matchesFilter(family: string, filter: string) {
  if (filter === "Todos") return true;
  const value = family.toLowerCase();
  if (filter === "Africano") return value.includes("africano") || value.includes("xiguiane");
  return value.includes(filter.toLowerCase());
}

function ModelsPage() {
  const [filter, setFilter] = useState("Todos");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATE_OPTIONS.filter((template) => {
      const matchesCategory = matchesFilter(template.family, filter);
      const matchesSearch =
        !q ||
        template.label.toLowerCase().includes(q) ||
        template.family.toLowerCase().includes(q) ||
        template.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [filter, query]);

  return (
    <main className="min-h-screen bg-[#faf8f3] text-neutral-900">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#faf8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="text-sm font-semibold tracking-tight">Solar Eclipse</a>
          <a href="/" className="text-xs text-black/50 hover:text-black">Voltar ao início</a>
        </div>
      </header>

      <section className="px-5 pb-16 pt-20 text-center sm:px-8 sm:pt-28">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
          Solar Eclipse · Coleção
        </p>
        <h1 className="mx-auto max-w-5xl text-5xl font-semibold tracking-[-0.055em] md:text-7xl">
          O vosso estilo começa aqui.
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-black/50 sm:text-lg">
          Explore modelos criados para diferentes histórias, cerimónias e personalidades.
          Veja uma demonstração e escolha o ponto de partida do vosso convite.
        </p>

        <div className="mx-auto mt-10 flex max-w-xl items-center gap-3 rounded-full border border-black/10 bg-white px-5 py-3 shadow-sm">
          <Search className="size-4 text-black/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar modelo, estilo ou categoria..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/35"
            aria-label="Pesquisar modelos"
          />
        </div>

        <div className="mx-auto mt-6 flex max-w-5xl flex-wrap justify-center gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={
                "rounded-full px-4 py-2 text-xs transition " +
                (filter === item
                  ? "bg-black text-white"
                  : "border border-black/10 bg-white text-black/55 hover:text-black")
              }
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mt-5 text-xs text-black/35">
          {visible.length} {visible.length === 1 ? "modelo disponível" : "modelos disponíveis"}
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-8 md:grid-cols-2">
        {visible.map((template, index) => (
          <article
            key={template.value}
            className="group overflow-hidden rounded-[30px] bg-white shadow-[0_18px_60px_rgba(0,0,0,.07)] transition duration-500 hover:-translate-y-1"
          >
            <a href={`/modelos/${template.value}#pedido`} className="block" aria-label={"Ver modelo " + template.label}>
              <div className="relative overflow-hidden">
                <img
                  src={images[index % images.length]}
                  alt={template.label}
                  loading="lazy"
                  className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105 md:h-[420px]"
                />
                <div
                  className={`template-catalog-art template-catalog-art-${template.value} pointer-events-none absolute inset-0 flex items-center justify-center`}
                  aria-hidden="true"
                >
                  <div className="template-catalog-paper">
                    <span className="template-catalog-kicker">Solar Eclipse</span>
                    <span className="template-catalog-rule" />
                    <strong className="template-catalog-names">Ana <em>&</em> Miguel</strong>
                    <span className="template-catalog-date">24 · 10 · 2027</span>
                    <span className="template-catalog-seal">✦</span>
                  </div>
                </div>
                <div className="absolute inset-x-6 bottom-6 flex items-center justify-between">
                  <span className="rounded-full bg-black/75 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
                    Ver demonstração
                  </span>
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </div>
            </a>

            <div className="p-7 sm:p-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                  {template.family}
                </span>
                <Sparkles className="size-4 shrink-0 text-[#C9A84C]" />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {template.label}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
                {template.description}
              </p>

              <ul className="mt-6 space-y-2.5">
                {[
                  "Nomes e data personalizados",
                  "Fotografias, vídeo e música",
                  "RSVP e gestão de convidados",
                  "Versão digital e para impressão",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-xs text-black/60">
                    <Check className="size-4 text-[#C9A84C]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a href={`/modelos/${template.value}#pedido`} className="mt-7 flex items-center justify-center gap-3 rounded-full bg-black px-6 py-4 text-sm font-medium text-white transition hover:bg-neutral-800">
                Escolher este modelo
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {visible.length === 0 && (
        <section className="px-6 pb-32 text-center">
          <div className="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-10">
            <p className="text-lg font-medium">Nenhum modelo encontrado.</p>
            <p className="mt-2 text-sm text-black/45">Experimente outra pesquisa ou volte para “Todos”.</p>
            <button
              type="button"
              onClick={() => {
                setFilter("Todos");
                setQuery("");
              }}
              className="mt-6 rounded-full bg-black px-6 py-3 text-sm text-white"
            >
              Ver todos
            </button>
          </div>
        </section>
      )}

      <section className="bg-[#111] px-6 py-24 text-center text-white">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">Encontrou o estilo?</p>
        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
          Vamos torná-lo vosso.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/45">
          Escolha um modelo, envie os dados básicos e fale connosco diretamente para começar.
        </p>
        <a href="/modelos/golden-classic" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black">
          Começar com um modelo
          <ArrowRight className="size-4" />
        </a>
      </section>
    </main>
  );
}
