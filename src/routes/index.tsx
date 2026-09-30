import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Gift,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1529788295308-1eace6f67388?fm=jpg&q=85&w=2400&auto=format&fit=crop";
const DETAIL_IMAGE =
  "https://images.unsplash.com/photo-1525441273400-056e9c7517b3?fm=jpg&q=85&w=2200&auto=format&fit=crop";
const COUPLE_IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?fm=jpg&q=85&w=1800&auto=format&fit=crop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solar Eclipse — Convites Digitais Premium" },
      {
        name: "description",
        content:
          "Convites digitais premium, páginas de casamento e experiências para convidados, desenhados à medida pela Solar Eclipse.",
      },
      { property: "og:title", content: "Solar Eclipse — Convites Digitais Premium" },
      {
        property: "og:description",
        content: "Uma experiência elegante para o casal e para cada convidado.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: HomePage,
});

const WHATSAPP_NUMBER = "258847404160";

const FEATURES = [
  ["Design", "Templates editoriais que se adaptam à história do casal.", Sparkles],
  ["Convidados", "Links pessoais, RSVP e organização sem folhas de cálculo.", Users],
  ["Memórias", "Galeria, vídeos e música numa experiência contínua.", ImageIcon],
  ["Localização", "Cerimónia, recepção e mapas sempre à mão.", MapPin],
  ["Presentes", "Lista de presentes e pagamentos apresentados com discrição.", Gift],
  ["Entrega", "Convite, QR, impressão e painel do casal num só pacote.", ShieldCheck],
] as const;

const STEPS = [
  ["01", "Escolha", "Escolha uma direção visual e começamos a partir daí."],
  ["02", "Personalize", "Nomes, história, fotografias, programa e convidados."],
  ["03", "Publique", "Receba um link elegante, pronto para partilhar."],
];

const FAQ = [
  ["Posso trocar o template depois?", "Sim. O conteúdo do evento é independente do design. Trocar o template não apaga nomes, datas, fotografias, convidados ou confirmações."],
  ["Os convidados precisam de instalar alguma coisa?", "Não. O convite abre diretamente no navegador do telemóvel, tablet ou computador."],
  ["Existe RSVP?", "Sim. O casal pode acompanhar as confirmações e os estados dos convidados através do painel privado."],
  ["Posso ter versão para impressão?", "Sim. A plataforma prepara versões individuais, de casal e formatos A5/A6."],
];

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function HomePage() {
  const catalogRef = useRef<HTMLElement | null>(null);

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] selection:bg-black selection:text-white">
      <header className="fixed top-0 z-50 w-full border-b border-black/[0.06] bg-white/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-black text-[9px] font-semibold tracking-[0.08em] text-white">
              SE
            </span>
            <span className="text-sm font-semibold tracking-[-0.02em]">Solar Eclipse</span>
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] text-black/55 md:flex">
            <a href="#experiencia" className="transition-colors hover:text-black">Experiência</a>
            <a href="#processo" className="transition-colors hover:text-black">Como funciona</a>
            <a href="#faq" className="transition-colors hover:text-black">FAQ</a>
          </nav>
          <a
            href={whatsappUrl("Olá! Gostaria de criar um convite com a Solar Eclipse.")}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-black px-4 py-2 text-[12px] font-medium text-white transition-transform hover:scale-[1.02]"
          >
            Começar
          </a>
        </div>
      </header>

      <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-black pt-16">
        <img
          src={HERO_IMAGE}
          alt="Experiência de casamento Solar Eclipse"
          className="absolute inset-0 size-full object-cover opacity-75"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
          <div className="max-w-3xl text-white">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.24em] text-white/65">
              Convites digitais premium
            </p>
            <h1 className="text-[clamp(3.4rem,8vw,7.4rem)] font-semibold leading-[0.92] tracking-[-0.065em]">
              O convite é
              <br />
              o primeiro
              <br />
              momento.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
              Criamos uma experiência digital à altura do vosso dia — elegante para o casal,
              simples para cada convidado e pensada até ao último detalhe.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
              >
                Explorar a experiência
                <ArrowRight className="size-4" />
              </button>
              <a
                href={whatsappUrl("Olá! Quero falar sobre um convite digital premium.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                <MessageCircle className="size-4" />
                Falar connosco
              </a>
            </div>
          </div>
        </div>
      </section>

      <section ref={catalogRef} id="experiencia" className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">Uma plataforma, não apenas um convite</p>
            <h2 className="mt-5 text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
              Tudo o que acontece antes do grande dia.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-black/55">
              Conteúdo, design e gestão vivem no mesmo lugar. O casal recebe uma experiência
              completa e a equipa recebe ferramentas para entregar tudo sem complicação.
            </p>
          </div>

          <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([title, description, Icon]) => (
              <article key={title} className="group min-h-56 rounded-[28px] bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,.04)] transition-transform hover:-translate-y-1">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#f5f5f7]">
                  <Icon className="size-[18px] text-black/70" />
                </div>
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em]">{title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-black/50">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-24 text-white sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">Design system</p>
            <h2 className="mt-5 text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
              O vosso conteúdo.
              <br />
              O vosso estilo.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/55">
              Comece com um dos nossos universos visuais. Depois personalize tudo o que importa.
              Se mudarem de ideia, o conteúdo continua intacto.
            </p>
            <div className="mt-9 space-y-3 text-sm text-white/70">
              {["40+ direções visuais", "Conteúdo separado do template", "Fotografia, vídeo e música", "Desktop e mobile"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex size-5 items-center justify-center rounded-full bg-white/10"><Check className="size-3" /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[36px] bg-[#161616] p-3 shadow-2xl">
            <img src={DETAIL_IMAGE} alt="Detalhes de um casamento" className="aspect-[4/3] w-full rounded-[28px] object-cover opacity-90" loading="lazy" />
            <div className="absolute right-8 bottom-8 rounded-2xl border border-white/10 bg-black/60 px-5 py-4 backdrop-blur-xl">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">Preview</p>
              <p className="mt-1 text-sm font-medium">Uma experiência feita à medida.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="processo" className="px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">Processo</p>
              <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
                Simples por fora.
                <br />
                Poderoso por dentro.
              </h2>
            </div>
            <div className="divide-y divide-black/10">
              {STEPS.map(([number, title, description]) => (
                <div key={number} className="grid gap-4 py-7 sm:grid-cols-[72px_180px_1fr] sm:items-start">
                  <span className="text-xs font-medium text-black/35">{number}</span>
                  <h3 className="text-lg font-semibold tracking-[-0.02em]">{title}</h3>
                  <p className="text-sm leading-6 text-black/50">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e8e8ed] px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[32px] bg-white p-3">
            <img src={COUPLE_IMAGE} alt="Casal" className="aspect-[4/3] w-full rounded-[24px] object-cover" loading="lazy" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">Depois de publicar</p>
            <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
              O dia continua a acontecer aqui.
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-8 text-black/55">
              Confirmações, convidados, presentes, mensagens e versões para impressão ficam
              organizados no painel. O casal acompanha tudo sem depender de folhas de cálculo.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-xs text-black/60">RSVP</span>
              <span className="rounded-full bg-white px-4 py-2 text-xs text-black/60">Convidados</span>
              <span className="rounded-full bg-white px-4 py-2 text-xs text-black/60">Presentes</span>
              <span className="rounded-full bg-white px-4 py-2 text-xs text-black/60">QR Code</span>
              <span className="rounded-full bg-white px-4 py-2 text-xs text-black/60">PDF</span>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">Perguntas</p>
          <h2 className="mt-5 text-center text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.055em]">Antes de começar.</h2>
          <div className="mt-12 divide-y divide-black/10">
            {FAQ.map(([question, answer]) => (
              <details key={question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-[-0.02em]">
                  {question}
                  <ChevronDown className="size-5 shrink-0 text-black/35 transition-transform group-open:rotate-180" />
                </summary>
                <p className="max-w-2xl pt-4 text-sm leading-7 text-black/50">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-28 text-center text-white sm:px-8 sm:py-36">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">Solar Eclipse</p>
        <h2 className="mx-auto mt-6 max-w-4xl text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
          Vamos criar o vosso primeiro momento.
        </h2>
        <a
          href={whatsappUrl("Olá! Quero criar o meu convite digital com a Solar Eclipse.")}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
        >
          Começar agora
          <ArrowRight className="size-4" />
        </a>
        <footer className="mx-auto mt-24 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row">
          <span>Solar Eclipse · Convites Digitais</span>
          <Link to="/auth" className="hover:text-white/60">Acesso interno</Link>
        </footer>
      </section>
    </main>
  );
}
