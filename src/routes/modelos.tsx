import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Check, Clock, Gift, Heart, Images, MessageCircle, Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TEMPLATE_OPTIONS, getTemplateVisualFamily, type TemplateDefinition } from "@/lib/templates";
import { getTemplateDirection } from "@/lib/templateDirections";
import { openWhatsApp } from "@/lib/whatsapp";
import { createTemplateRequest } from "@/lib/templateRequests";
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

const filters = ["Todos", "Luxury", "Minimalista", "Editorial", "Romântico", "Garden", "Royal", "Cinemático", "Destination", "Tradicional", "Africano"];

function matchesFilter(family: string, filter: string) {
  if (filter === "Todos") return true;
  const value = family.toLowerCase();
  if (filter === "Africano") return value.includes("africano") || value.includes("xiguiane");
  if (filter === "Editorial") return value.includes("editorial") || value.includes("fashion");
  if (filter === "Cinemático") return value.includes("cinemático") || value.includes("dark");
  if (filter === "Destination") return value.includes("destination") || value.includes("coastal");
  return value.includes(filter.toLowerCase());
}

type PreviewFamily = "noir" | "botanical" | "regal" | "heritage" | "editorial" | "cinematic" | "magazine" | "pearl" | "celestial" | "coastal";

function previewFamily(template: TemplateDefinition): PreviewFamily {
  if (template.value === "film-noir-motion") return "cinematic";
  if (template.value === "editorial-magazine") return "magazine";
  if (template.value === "pearl-garden") return "pearl";
  if (template.value === "capulana-contemporary") return "heritage";
  if (template.value === "celestial-ivory") return "celestial";
  if (template.value === "coastal-blue") return "coastal";
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
  cinematic: { page: "bg-[#090909] text-white", accent: "text-[#d8b46a]", line: "border-white/25", photo: "brightness-50 contrast-110", label: "A celebration in motion", ornament: "01" },
  magazine: { page: "bg-[#eeeae2] text-black", accent: "text-black/55", line: "border-black/20", photo: "grayscale-[10%]", label: "WEDDING / ISSUE 01", ornament: "02" },
  pearl: { page: "bg-[#f7f0ec] text-[#4b3b3a]", accent: "text-[#9b6f73]", line: "border-[#b89598]/40", photo: "brightness-105", label: "Pearl Garden", ornament: "❦" },
  celestial: { page: "bg-[#f3efe5] text-[#1d1a16]", accent: "text-[#a47b31]", line: "border-[#a47b31]/40", photo: "brightness-90", label: "Celestial", ornament: "✦" },
  coastal: { page: "bg-[#eaf2f3] text-[#17333a]", accent: "text-[#2d7280]", line: "border-[#2d7280]/30", photo: "brightness-105", label: "Destination / 01", ornament: "≈" },
};

function InvitationPreview({ template }: { template: TemplateDefinition }) {
  const family = previewFamily(template);
  const style = previewStyles[family];
  const direction = getTemplateDirection(template);

  const hash = [...template.value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const variant = hash % 6;
  const photoA = images[hash % images.length];
  const photoB = images[(hash + 1) % images.length];

  const scrollTo = (section: string) => {
    document
      .querySelector("[data-model-demo-scroll]")
      ?.querySelector<HTMLElement>(`[data-demo-section="${section}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sectionClass =
    family === "editorial"
      ? "border-b border-black/10 bg-white px-7 py-14 text-left"
      : family === "botanical"
        ? "border-b border-rose/10 bg-[#fffaf8] px-7 py-14 text-center"
        : family === "heritage"
          ? "border-b border-gold-soft/15 bg-[#4a3022] px-7 py-14 text-center"
          : family === "regal"
            ? "border-b border-black/10 bg-[#21372f] px-7 py-14 text-center text-cream"
            : "border-b border-gold/10 bg-ink px-7 py-14 text-center text-cream";

  const miniCard =
    family === "editorial"
      ? "border border-black/10 bg-[#fafafa]"
      : family === "botanical"
        ? "rounded-[28px] border border-rose/15 bg-white shadow-sm"
        : family === "heritage"
          ? "border border-gold-soft/20 bg-[#3c271d]"
          : family === "regal"
            ? "border border-cream/15 bg-[#1b3029]"
            : "border border-gold/20 bg-[#17130f]";

  const demoLabel = "DEMONSTRAÇÃO · CONTEÚDO FICTÍCIO";

  const cover =
    family === "editorial" ? (
      <section data-demo-section="capa" className="relative min-h-[660px] overflow-hidden bg-[#f1eee8] text-black">
        <div className="grid min-h-[660px] grid-cols-[42%_58%]">
          <div className="flex flex-col justify-between p-7">
            <div className="text-[9px] uppercase tracking-[0.28em]">Solar Eclipse</div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-black/45">Wedding invitation</p>
              <h3 className="mt-5 font-serif text-6xl leading-[.86] tracking-[-0.06em]">
                Ana
                <br />
                <span className="italic">&</span>
                <br />
                Miguel
              </h3>
            </div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-black/45">24 · 10 · 2027</div>
          </div>
          <div className="relative">
            <img src={photoA} alt="" className="h-full w-full object-cover grayscale-[20%]" />
            <div className="absolute inset-x-5 bottom-5 border border-white/60 bg-black/20 p-4 text-white backdrop-blur-sm">
              <p className="text-[9px] uppercase tracking-[0.22em]">{demoLabel}</p>
              <p className="mt-2 text-sm">Uma história para celebrar.</p>
            </div>
          </div>
        </div>
      </section>
    ) : family === "botanical" ? (
      <section data-demo-section="capa" className="relative min-h-[660px] overflow-hidden bg-[#f8efe9] text-[#473c39]">
        <div className="absolute -left-20 top-10 size-56 rounded-full border border-rose/25" />
        <div className="absolute -right-24 bottom-12 size-72 rounded-full border border-rose/20" />
        <div className="relative flex min-h-[660px] flex-col items-center justify-between px-7 py-9 text-center">
          <div className="font-sans text-[9px] uppercase tracking-[0.3em]">Solar Eclipse · coleção garden</div>
          <div className="w-full">
            <p className="font-script text-5xl text-rose">Uma nova história</p>
            <h3 className="mt-4 font-serif text-6xl leading-[.9]">Ana <span className="text-rose">&</span> Miguel</h3>
            <div className="mx-auto mt-7 h-64 w-44 overflow-hidden rounded-[100px] border-8 border-[#f8efe9] shadow-xl">
              <img src={photoA} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="w-full border-t border-rose/20 pt-5 text-[9px] uppercase tracking-[0.25em]">24 de Outubro de 2027</div>
        </div>
      </section>
    ) : family === "heritage" ? (
      <section data-demo-section="capa" className="relative min-h-[660px] overflow-hidden bg-[#3b281f] text-cream">
        <div className="absolute inset-x-0 top-0 h-20 bg-[repeating-linear-gradient(45deg,#b8864c_0_12px,#5b3b28_12px_24px,#d4ad72_24px_36px)] opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[repeating-linear-gradient(-45deg,#8a5b39_0_14px,#3b281f_14px_28px,#c49a62_28px_42px)] opacity-80" />
        <div className="relative flex min-h-[660px] flex-col justify-between px-7 py-28">
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-gold-soft">União · Família · Tradição</p>
            <p className="mt-5 text-3xl text-gold-soft">✳</p>
          </div>
          <div className="relative mx-auto w-full max-w-[300px]">
            <img src={photoA} alt="" className="h-64 w-full rounded-t-[90px] object-cover" />
            <div className="relative -mt-7 mx-7 rounded-[26px] border border-gold-soft/40 bg-[#3b281f] p-5 text-center">
              <p className="text-[9px] uppercase tracking-[0.25em] text-gold-soft">Convite de demonstração</p>
              <h3 className="mt-3 font-serif text-5xl">Ana & Miguel</h3>
              <p className="mt-3 text-xs text-cream/65">24 · 10 · 2027</p>
            </div>
          </div>
          <div className="text-center text-[9px] uppercase tracking-[0.22em] text-cream/55">Uma celebração com raízes</div>
        </div>
      </section>
    ) : family === "regal" ? (
      <section data-demo-section="capa" className="relative min-h-[660px] overflow-hidden bg-[#1d342d] text-cream">
        <div className="absolute inset-5 border border-gold/50" />
        <div className="absolute inset-8 border border-cream/15" />
        <div className="relative flex min-h-[660px] flex-col items-center justify-between px-10 py-14 text-center">
          <div>
            <p className="text-3xl text-gold">◇</p>
            <p className="mt-3 text-[9px] uppercase tracking-[0.32em] text-cream/55">A royal celebration</p>
          </div>
          <div>
            <div className="mx-auto size-36 overflow-hidden rounded-full border-4 border-gold/60 p-1">
              <img src={photoA} alt="" className="h-full w-full rounded-full object-cover" />
            </div>
            <h3 className="mt-7 font-serif text-6xl leading-[.9]">Ana <span className="text-gold">&</span> Miguel</h3>
            <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-cream/65">24 de Outubro · 2027</p>
          </div>
          <div className="text-[9px] uppercase tracking-[0.22em] text-gold">Convite premium · demonstração</div>
        </div>
      </section>
    ) : (
      <section data-demo-section="capa" className="relative min-h-[660px] overflow-hidden bg-black text-cream">
        <img src={photoA} alt="" className="absolute inset-0 h-full w-full object-cover brightness-[.55]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black" />
        <div className="relative flex min-h-[660px] flex-col items-center justify-between px-7 py-9 text-center">
          <div className="w-full border-t border-gold/50 pt-5 text-[9px] uppercase tracking-[0.3em]">Solar Eclipse · demonstração</div>
          <div>
            <p className="text-sm italic text-gold">Uma celebração inesquecível</p>
            <h3 className="mt-5 font-serif text-6xl leading-[.9]">Ana <span className="text-gold">&</span> Miguel</h3>
            <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-cream/75">24 de Outubro de 2027</p>
          </div>
          <div className="w-full border-b border-gold/40 pb-5 text-[9px] uppercase tracking-[0.25em] text-cream/55">Scroll para abrir</div>
        </div>
      </section>
    );

  const story = (
    <section data-demo-section="historia" className={sectionClass}>
      <p className={`text-[9px] uppercase tracking-[0.24em] ${style.accent}`}>A nossa história</p>
      <h4 className="mt-4 font-serif text-4xl">Momentos que nos trouxeram aqui</h4>
      <div className={`mt-8 ${family === "editorial" ? "grid grid-cols-2 gap-3" : "grid gap-3 sm:grid-cols-2"}`}>
        <img src={photoA} alt="" className={`h-44 w-full object-cover ${family === "botanical" ? "rounded-[34px]" : family === "editorial" ? "rounded-none" : "rounded-2xl"}`} />
        <div className={`p-5 ${miniCard}`}>
          <p className={`text-[10px] uppercase tracking-[0.2em] ${style.accent}`}>2022 · O encontro</p>
          <p className="mt-3 text-sm leading-6 opacity-75">Uma história fictícia criada apenas para mostrar como este modelo pode receber a história real do casal.</p>
        </div>
      </div>
    </section>
  );

  const gallery = (
    <section data-demo-section="galeria" className={sectionClass}>
      <p className={`text-[9px] uppercase tracking-[0.24em] ${style.accent}`}>Memórias</p>
      <h4 className="mt-3 font-serif text-4xl">Galeria</h4>
      <div className={`mt-8 ${variant % 2 === 0 ? "grid grid-cols-2 gap-3" : "columns-2 gap-3 space-y-3"}`}>
        <img src={photoA} alt="" className={`w-full object-cover ${variant % 2 === 0 ? "h-52" : "h-64"} ${family === "botanical" ? "rounded-[28px]" : "rounded-2xl"}`} />
        <img src={photoB} alt="" className={`w-full object-cover ${variant % 2 === 0 ? "h-40" : "h-52"} ${family === "heritage" ? "rounded-none" : "rounded-2xl"}`} />
        <div className={`flex h-32 items-center justify-center ${miniCard}`}>
          <Images className={`size-6 ${style.accent}`} />
          <span className="ml-2 text-xs">+ 12 memórias</span>
        </div>
      </div>
    </section>
  );

  const program = (
    <section data-demo-section="agenda" className={sectionClass}>
      <p className={`text-[9px] uppercase tracking-[0.24em] ${style.accent}`}>Agenda</p>
      <h4 className="mt-3 font-serif text-4xl">O grande dia</h4>
      <div className="mt-8 space-y-3 text-left">
        {[
          ["12:00", "Cerimónia", "Igreja / Local da cerimónia"],
          ["14:00", "Receção", "Espaço da celebração"],
          ["17:00", "Festa", "Jantar, dança e memórias"],
        ].map(([time, title, place]) => (
          <div key={time} className={`flex items-center gap-4 p-4 ${miniCard}`}>
            <span className={`w-14 shrink-0 text-center text-xs ${style.accent}`}>{time}</span>
            <span><strong className="block font-serif text-lg">{title}</strong><small className="opacity-60">{place}</small></span>
          </div>
        ))}
      </div>
    </section>
  );

  const gifts = (
    <section data-demo-section="presentes" className={sectionClass}>
      <p className={`text-[9px] uppercase tracking-[0.24em] ${style.accent}`}>Presentes</p>
      <h4 className="mt-3 font-serif text-4xl">Um gesto de carinho</h4>
      <div className={`mt-8 p-6 ${miniCard}`}>
        <Gift className={`mx-auto size-7 ${style.accent}`} />
        <p className="mt-4 text-sm leading-6 opacity-75">Lista de presentes, dados bancários ou QR Code podem ser integrados ao convite.</p>
      </div>
    </section>
  );

  const rsvp = (
    <section data-demo-section="rsvp" className={sectionClass}>
      <p className={`text-[9px] uppercase tracking-[0.24em] ${style.accent}`}>RSVP</p>
      <h4 className="mt-3 font-serif text-4xl">Confirmem a vossa presença</h4>
      <div className={`mt-8 p-6 ${miniCard}`}>
        <p className="text-sm opacity-75">O convidado pode confirmar diretamente no convite, inclusive através de link personalizado.</p>
        <button type="button" className={`mt-5 rounded-full border px-6 py-3 text-xs uppercase tracking-[0.18em] ${style.line} ${style.accent}`}>Confirmar presença</button>
      </div>
    </section>
  );

  const guestbook = (
    <section data-demo-section="mensagens" className={sectionClass}>
      <p className={`text-[9px] uppercase tracking-[0.24em] ${style.accent}`}>Livro de mensagens</p>
      <blockquote className={`mt-7 p-6 ${miniCard}`}>
        <p className="font-serif text-2xl italic leading-relaxed">“Que esta nova etapa seja tão bonita quanto a história que vos trouxe até aqui.”</p>
        <footer className="mt-5 text-[9px] uppercase tracking-[0.2em] opacity-55">Mensagem de demonstração</footer>
      </blockquote>
    </section>
  );

  const content = variant % 3 === 0
    ? [story, program, gallery, gifts, rsvp, guestbook]
    : variant % 3 === 1
      ? [story, gallery, program, guestbook, gifts, rsvp]
      : [gallery, story, program, rsvp, gifts, guestbook];

  return (
    <div data-demo-variant={variant} className={`template-demo template-demo-${template.value} demo-variant-${variant} relative mx-auto w-full max-w-[420px] overflow-hidden shadow-2xl ${style.page}`}>
      {cover}
      <section data-demo-section="direcao" className={`px-7 py-8 ${family === "editorial" ? "bg-white text-black" : family === "botanical" ? "bg-[#fffaf8] text-[#473c39]" : family === "regal" ? "bg-[#21372f] text-cream" : family === "heritage" ? "bg-[#3b281f] text-cream" : "bg-ink text-cream"}`}>
        <div className="grid grid-cols-2 gap-3 text-left">
          {[
            ["Estrutura", direction.structure],
            ["Design", direction.design],
            ["Aparência", direction.appearance],
            ["Tipografia", direction.typography],
          ].map(([label, value]) => (
            <div key={label} className={`rounded-2xl p-4 ${miniCard}`}>
              <p className={`text-[8px] uppercase tracking-[0.18em] ${style.accent}`}>{label}</p>
              <p className="mt-2 text-[10px] leading-4 opacity-70">{value}</p>
            </div>
          ))}
        </div>
      </section>
      {content}
      <section data-demo-section="rodape" className={`px-7 py-12 text-center ${family === "editorial" ? "bg-[#111] text-white" : family === "botanical" ? "bg-[#f0dfd8] text-[#473c39]" : family === "regal" ? "bg-[#15251f] text-cream" : family === "heritage" ? "bg-[#2a1b15] text-cream" : "bg-black text-cream"}`}>
        <p className={`text-2xl ${style.accent}`}>{style.ornament}</p>
        <p className="mt-5 font-serif text-3xl">Ana & Miguel</p>
        <p className="mt-3 text-[9px] uppercase tracking-[0.25em] opacity-55">Solar Eclipse · demonstração</p>
      </section>
      <div className="sticky bottom-3 z-10 mx-auto mt-[-1px] flex w-fit gap-1 rounded-full border border-black/10 bg-white/90 p-1 shadow-xl backdrop-blur">
        {[
          ["capa", "Capa"],
          ["historia", "História"],
          ["galeria", "Galeria"],
          ["agenda", "Agenda"],
          ["rsvp", "RSVP"],
          ["presentes", "Presentes"],
          ["mensagens", "Mensagens"],
        ].map(([id, label]: [string, string]) => (
          <button key={id} type="button" onClick={() => scrollTo(id)} className="rounded-full px-2.5 py-2 text-[8px] font-medium text-black/60 hover:bg-black/5">
            {label}
          </button>
        ))}
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

  useEffect(() => {
    if (!demo) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [demo]);

  function openRequest(template: TemplateDefinition) {
    setDemo(null);
    setSelected(template);
    setFeedback("");
  }

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;

    const coupleName = name.trim();
    const contact = phone.trim();
    const requestText = [
      `Olá! Quero o modelo ${selected.label} para o meu casamento.`,
      `Casal: ${coupleName}`,
      `Contacto: ${contact}`,
      `Data prevista: ${date || "Por definir"}`,
      `Mensagem: ${message.trim() || "Sem mensagem adicional"}`,
    ].join("\n");

    setFeedback("A registar o pedido…");
    await createTemplateRequest({
      template_value: selected.value,
      template_label: selected.label,
      couple_name: coupleName,
      phone: contact,
      wedding_date: date || null,
      message: message.trim() || null,
    });
    setFeedback("Pedido registado. A abrir o WhatsApp…");
    openWhatsApp(requestText);
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
    <main className="solar-models-page min-h-screen bg-[#faf8f3] text-neutral-900">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#faf8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="text-sm font-semibold tracking-tight">Solar Eclipse</a>
          <a href="/" className="text-xs text-black/50 hover:text-black">Voltar ao início</a>
        </div>
      </header>

      <section className="solar-models-hero px-5 pb-16 pt-20 text-center sm:px-8 sm:pt-28">
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

      <section className="solar-models-grid mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-8 md:grid-cols-2">
        {visible.map((template, index) => (
          <article
            key={template.value}
            className="solar-model-card group overflow-hidden rounded-[30px] bg-white shadow-[0_18px_60px_rgba(0,0,0,.07)] transition duration-500 hover:-translate-y-1"
          >
            <button type="button" onClick={() => setDemo(template)} aria-label={`Abrir demonstração de ${template.label}`} className="block w-full cursor-pointer rounded-none p-0 text-left">
              <div className="relative overflow-hidden">
                <img
                  src={images[index % images.length]}
                  alt={template.label}
                  loading="lazy"
                  className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105 md:h-[420px]"
                />
                <div
                  className={`template-catalog-art template-catalog-art-${template.value} template-catalog-family-${getTemplateVisualFamily(template.value)} pointer-events-none absolute inset-0 flex items-center justify-center`}
                  aria-hidden="true"
                >
                  <div className={`template-catalog-paper template-catalog-paper-${getTemplateVisualFamily(template.value)}`}>
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
            </button>

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

              <div className="mt-5 rounded-2xl border border-black/[0.06] bg-[#faf9f6] px-4 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b7a2d]">Ritmo do convite</p>
                <p className="mt-1.5 text-xs leading-5 text-black/55">{getTemplateDirection(template).structure}</p>
              </div>

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

      {demo && (
        <div
          className="fixed inset-0 z-[100] bg-black/65 p-2 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Demonstração de ${demo.label}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDemo(null);
          }}
        >
          <div className="mx-auto flex h-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#f7f4ed] shadow-2xl">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <p className="truncate font-serif text-xl text-black">{demo.label}</p>
                <p className="text-xs text-black/45">Convite ilustrativo · DEMONSTRAÇÃO</p>
              </div>
              <Button type="button" variant="outline" onClick={() => setDemo(null)} aria-label="Fechar demonstração" className="shrink-0">
                <X /> <span className="hidden sm:inline">Fechar</span>
              </Button>
            </div>
            <div data-model-demo-scroll className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#ece8df] p-2 sm:p-6" tabIndex={0} aria-label="Percorrer convite de demonstração">
              <InvitationPreview template={demo} />
              <div className="mx-auto mt-4 max-w-[420px] rounded-2xl border border-black/10 bg-white p-5 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">Direção do tema</p>
                {(() => {
                  const direction = getTemplateDirection(demo);
                  return (
                    <div className="mt-3 grid gap-3 text-xs leading-relaxed text-black/55">
                      <p><span className="font-medium text-black">Estrutura:</span> {direction.structure}</p>
                      <p><span className="font-medium text-black">Design:</span> {direction.design}</p>
                      <p><span className="font-medium text-black">Aparência:</span> {direction.appearance}</p>
                      <p><span className="font-medium text-black">Tipografia:</span> {direction.typography}</p>
                      <p><span className="font-medium text-black">Paleta:</span> {direction.palette}</p>
                    </div>
                  );
                })()}
              </div>
            </div>
            <div className="shrink-0 border-t border-black/10 bg-white p-3 text-center">
              <Button type="button" onClick={() => openRequest(demo)} className="w-full sm:w-auto">
                Pedir este modelo <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      )}

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
