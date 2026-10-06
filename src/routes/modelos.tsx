import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Search, Sparkles, X, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { TEMPLATE_OPTIONS, type TemplateDefinition } from "@/lib/templates";
import { getTemplateDirection } from "@/lib/templateDirections";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

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
      { property: "og:title", content: "Modelos de Convites | Solar Eclipse" },
      { property: "og:description", content: "Explore a coleção de modelos premium de convites digitais de casamento Solar Eclipse." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

const WHATSAPP = "https://wa.me/258847404160";

function previewFamily(template: TemplateDefinition) {
  if (template.value === "xiguiane-tradicional" || /tradicional|africano|xiguiane/i.test(template.family)) return "heritage";
  if (template.value === "aquarela-botanica" || /romântico|garden|floral|botânica/i.test(template.family)) return "botanical";
  if (template.value === "emerald-elegante" || /verde|emerald|royal/i.test(template.family)) return "regal";
  if (/minimalista|editorial/i.test(template.family)) return "editorial";
  return "noir";
}

const previewStyles = {
  noir: { page: "bg-ink text-cream", accent: "text-gold", line: "border-gold/60", photo: "brightness-75", label: "Uma celebração inesquecível", ornament: "✦" },
  botanical: { page: "bg-cream text-foreground", accent: "text-rose", line: "border-rose/50", photo: "opacity-80", label: "Floresce uma nova história", ornament: "❧" },
  regal: { page: "bg-sage text-ink", accent: "text-cream", line: "border-cream/70", photo: "brightness-75", label: "O início de uma história", ornament: "◇" },
  heritage: { page: "bg-warm text-cream", accent: "text-gold-soft", line: "border-gold-soft/70", photo: "sepia", label: "Juntos em celebração", ornament: "✳" },
  editorial: { page: "bg-background text-foreground", accent: "text-wine", line: "border-foreground/40", photo: "grayscale", label: "O nosso dia", ornament: "—" },
};

function InvitationPreview({ template }: { template: TemplateDefinition }) {
  const family = previewFamily(template);
  const style = previewStyles[family];
  return (
    <div className={`mx-auto w-full max-w-[420px] overflow-hidden shadow-xl ${style.page}`}>
      <div className={`relative flex min-h-[520px] flex-col items-center justify-between border-[10px] border-current/10 p-8 text-center ${family === "editorial" ? "items-start text-left" : ""}`}>
        <div className={`w-full border-t pt-6 ${style.line}`}>
          <p className="font-sans text-[10px] uppercase tracking-wider">SOLAR ECLIPSE · DEMONSTRAÇÃO</p>
          <p className={`mt-10 text-4xl ${style.accent}`} aria-hidden="true">{style.ornament}</p>
        </div>
        <div>
          <p className={`text-sm italic ${style.accent}`}>{style.label}</p>
          <h3 className={`mt-6 leading-none ${family === "botanical" ? "font-script text-6xl" : family === "editorial" ? "font-sans text-5xl uppercase" : "font-serif text-6xl"}`}>Ana <span className={style.accent}>&</span> Miguel</h3>
          <p className="mt-8 font-sans text-xs uppercase tracking-wider">24 de Outubro de 2027</p>
        </div>
        <p className={`w-full border-b pb-6 font-sans text-[10px] uppercase tracking-wider ${style.line}`}>Convite de demonstração</p>
      </div>
      <div className="relative h-72 overflow-hidden">
        <img src={images[0]} alt="Fotografia ilustrativa de celebração" className={`h-full w-full object-cover ${style.photo}`} />
        <span className="absolute bottom-4 left-4 bg-background/90 px-3 py-1 font-sans text-[10px] text-foreground">DEMONSTRAÇÃO</span>
      </div>
      <div className={`px-8 py-16 text-center ${family === "editorial" ? "text-left" : ""}`}>
        <p className={`text-3xl ${style.accent}`} aria-hidden="true">{style.ornament}</p>
        <p className="mt-5 font-sans text-[10px] uppercase tracking-wider">Demonstração · Programa do dia</p>
        <h4 className="mt-4 font-serif text-4xl">Um dia para recordar</h4>
        <p className="mx-auto mt-5 max-w-xs text-sm leading-7 opacity-75">Esta é uma amostra ilustrativa. Os detalhes do vosso convite serão personalizados pela nossa equipa.</p>
        <div className={`mt-12 border-y py-7 ${style.line}`}>
          <p className="font-sans text-xs uppercase tracking-wider">16:00 · Cerimónia</p>
          <p className="mt-2 text-sm opacity-75">Jardim de demonstração · Local fictício</p>
        </div>
        <div className={`border-b py-7 ${style.line}`}>
          <p className="font-sans text-xs uppercase tracking-wider">19:00 · Celebração</p>
          <p className="mt-2 text-sm opacity-75">Salão de demonstração · Local fictício</p>
        </div>
        <p className={`mt-12 text-3xl ${style.accent}`} aria-hidden="true">{style.ornament}</p>
        <p className="mt-6 font-sans text-[10px] uppercase tracking-wider">{template.label} · DEMONSTRAÇÃO</p>
      </div>
    </div>
  );
}

function ModelsPage() {
  const [filter, setFilter] = useState("Todos");
  const [query, setQuery] = useState("");
  const [demo, setDemo] = useState<TemplateDefinition | null>(null);
  const [selected, setSelected] = useState<TemplateDefinition | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");

  function openRequest(template: TemplateDefinition) {
    setDemo(null);
    setSelected(template);
    setFeedback("");
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const text = [
      `Olá! Quero o modelo ${selected.label} para o meu casamento.`,
      `Casal: ${name.trim()}`,
      `Contacto: ${phone.trim()}`,
      `Data prevista: ${date || "Por definir"}`,
      `Mensagem: ${message.trim() || "Sem mensagem adicional"}`,
    ].join("\n");
    const whatsappUrl = `${WHATSAPP}?text=${encodeURIComponent(text)}`;
    setFeedback("A abrir o WhatsApp…");
    // Não dependemos de popup: alguns navegadores bloqueiam window.open
    // quando o pedido é iniciado dentro de um Dialog.
    window.location.assign(whatsappUrl);
  }

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
            <Button
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
            </Button>
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
            <Button type="button" variant="ghost" onClick={() => setDemo(template)} aria-label={`Ver demonstração de ${template.label}`} aria-expanded={demo?.value === template.value} className="block h-auto w-full rounded-none p-0 text-left hover:bg-transparent">
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
            </Button>

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

              <Button type="button" onClick={() => openRequest(template)} aria-label={`Escolher este modelo: ${template.label}`} aria-expanded={selected?.value === template.value} className="mt-7 flex h-auto w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-4 text-sm font-medium text-cream hover:bg-ink/90">
                Escolher este modelo
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </article>
        ))}
      </section>

      {visible.length === 0 && (
        <section className="px-6 pb-32 text-center">
          <div className="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-10">
            <p className="text-lg font-medium">Nenhum modelo encontrado.</p>
            <p className="mt-2 text-sm text-black/45">Experimente outra pesquisa ou volte para “Todos”.</p>
            <Button
              type="button"
              onClick={() => {
                setFilter("Todos");
                setQuery("");
              }}
              className="mt-6 rounded-full bg-black px-6 py-3 text-sm text-white"
            >
              Ver todos
            </Button>
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
        <Button type="button" onClick={() => { const first = TEMPLATE_OPTIONS[0]; if (first) openRequest(first); }} className="mt-8 inline-flex h-auto items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-ink hover:bg-cream/90">
          Começar com um modelo
          <ArrowRight className="size-4" />
        </Button>
      </section>

      <Dialog open={demo !== null} onOpenChange={(open) => { if (!open) setDemo(null); }}>
        <DialogContent className="flex max-h-[95vh] w-[calc(100vw-1rem)] max-w-2xl flex-col gap-0 overflow-hidden border-border bg-background p-0 sm:rounded-sm [&>button]:hidden">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
            <div>
              <DialogTitle className="font-serif text-xl">{demo?.label ?? "Demonstração"}</DialogTitle>
              <DialogDescription className="text-xs">Convite ilustrativo · DEMONSTRAÇÃO</DialogDescription>
            </div>
            <Button type="button" variant="outline" onClick={() => setDemo(null)} aria-label="Fechar demonstração" className="shrink-0"><X /> <span className="hidden sm:inline">Fechar demonstração</span></Button>
          </div>
          <div className="max-h-[75vh] min-h-0 overflow-y-auto overscroll-contain bg-muted p-2 sm:p-6" tabIndex={0} aria-label="Percorrer convite de demonstração">
            {demo && (
              <>
                <InvitationPreview template={demo} />
                <div className="mx-auto mt-4 max-w-[420px] rounded-2xl border border-border bg-background p-5 text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Direção do tema</p>
                  {(() => {
                    const direction = getTemplateDirection(demo);
                    return (
                      <div className="mt-3 grid gap-3 text-xs leading-relaxed text-muted-foreground">
                        <p><span className="font-medium text-foreground">Estrutura:</span> {direction.structure}</p>
                        <p><span className="font-medium text-foreground">Design:</span> {direction.design}</p>
                        <p><span className="font-medium text-foreground">Aparência:</span> {direction.appearance}</p>
                        <p><span className="font-medium text-foreground">Tipografia:</span> {direction.typography}</p>
                        <p><span className="font-medium text-foreground">Paleta:</span> {direction.palette}</p>
                      </div>
                    );
                  })()}
                </div>
              </>
            )}
          </div>
          <div className="shrink-0 border-t border-border bg-background p-3 text-center">
            <Button type="button" onClick={() => { if (demo) openRequest(demo); }} className="w-full sm:w-auto">Pedir este modelo <ArrowRight /></Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] max-w-lg overflow-y-auto bg-background p-5 sm:p-8">
          <DialogTitle className="font-serif text-3xl">Pedir este modelo</DialogTitle>
          <DialogDescription>Modelo selecionado: <strong className="text-foreground">{selected?.label}</strong>. O pedido abre uma conversa com a nossa equipa.</DialogDescription>
          <form onSubmit={submitRequest} className="mt-3 space-y-4">
            <label className="block text-sm">Nome do casal<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-sm border border-input bg-background p-3" placeholder="Nome do casal" /></label>
            <label className="block text-sm">WhatsApp / telefone<input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full rounded-sm border border-input bg-background p-3" placeholder="+258 ..." /></label>
            <label className="block text-sm">Data prevista<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full rounded-sm border border-input bg-background p-3" /></label>
            <label className="block text-sm">Mensagem<textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 block w-full rounded-sm border border-input bg-background p-3" rows={3} placeholder="Conte-nos o que pretende..." /></label>
            {feedback && <p role="status" className="text-sm text-foreground">{feedback}</p>}
            <Button type="submit" className="w-full"><MessageCircle /> Enviar pelo WhatsApp</Button>
            <Button type="button" variant="outline" onClick={() => setSelected(null)} className="w-full">Fechar</Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
