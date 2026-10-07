import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Heart,
  Image,
  Menu,
  MessageCircle,
  Music,
  QrCode,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { EclipseMark } from "@/components/EclipseMark";
import { openWhatsApp, whatsappUrl } from "@/lib/whatsapp";
import { TEMPLATE_OPTIONS, templateVisualClass } from "@/lib/templates";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Solar Eclipse — Convites Digitais de Casamento" },
      {
        name: "description",
        content:
          "Convites digitais premium de casamento com fotos, vídeo, música, RSVP, convidados, presentes e versão para impressão.",
      },
    ],
  }),
});

const features = [
  { icon: Image, title: "Galeria de Memórias", text: "Fotos e vídeos do casal numa experiência elegante." },
  { icon: Music, title: "Música Personalizada", text: "Escolha a banda sonora especial do vosso casamento." },
  { icon: Users, title: "Gestão de Convidados", text: "Confirmações RSVP e links individuais." },
  { icon: QrCode, title: "Presentes Digitais", text: "Receba contribuições através de QR Code." },
];

const HOME_FEATURED_VALUES = ["editorial-cinema", "ivory-portrait", "modern-olive", "rose-atelier", "mozambique-luxe", "sunset-destination"];
const HOME_CAROUSEL_VALUES = ["editorial-cinema", "ivory-portrait", "modern-olive", "rose-atelier", "mozambique-luxe", "sunset-destination", "black-paper", "pearl-editorial"];

const HOME_TEMPLATE_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1534791547706-9b3f7f6c8a4a?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
];

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCarouselIndex((current) => (current + 1) % HOME_TEMPLATE_IMAGES.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="solar-landing min-h-screen bg-[#faf8f3] text-neutral-900">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight" aria-label="Solar Eclipse — início">
            <EclipseMark className="size-7 text-black" />
            <span>Solar Eclipse</span>
          </a>
          <nav className="hidden items-center gap-7 text-xs text-black/55 md:flex">
            <a href="#modelos" className="rounded-full border-2 border-black/15 bg-white/70 px-4 py-2.5 font-medium shadow-[0_1px_0_rgba(0,0,0,.04)] transition hover:border-black/35 hover:bg-white hover:shadow-sm">Modelos</a>
            <a href="#experiencia" className="rounded-full border border-black/10 bg-white/45 px-4 py-2.5 transition hover:border-black/25 hover:bg-white">Experiência</a>
            <a href="#como-funciona" className="rounded-full border border-black/10 bg-white/45 px-4 py-2.5 transition hover:border-black/25 hover:bg-white">Como funciona</a>
            <a
              href={whatsappUrl("Olá! Gostaria de conhecer os convites Solar Eclipse.")}
              onClick={(event) => { event.preventDefault(); openWhatsApp("Olá! Gostaria de conhecer os convites Solar Eclipse."); }}
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-4 py-2.5 font-medium text-white shadow-[0_4px_14px_rgba(0,0,0,.12)] transition hover:-translate-y-px hover:bg-neutral-900"
            >
              Falar connosco <MessageCircle className="size-3.5" />
            </a>
          </nav>
          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-full border-2 border-black/15 bg-white p-2 shadow-sm md:hidden"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-black/5 bg-[#faf8f3] px-5 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm">
              <a href="#modelos" onClick={() => setMenuOpen(false)} className="rounded-xl border border-black/10 bg-white px-3 py-3 hover:border-black/20">Modelos</a>
              <a href="#experiencia" onClick={() => setMenuOpen(false)} className="rounded-xl border border-black/10 bg-white px-3 py-3 hover:border-black/20">Experiência</a>
              <a href="#como-funciona" onClick={() => setMenuOpen(false)} className="rounded-xl border border-black/10 bg-white px-3 py-3 hover:border-black/20">Como funciona</a>
              <a
                href={whatsappUrl("Olá! Gostaria de conhecer os convites Solar Eclipse.")}
                onClick={(event) => { event.preventDefault(); openWhatsApp("Olá! Gostaria de conhecer os convites Solar Eclipse."); }}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl border border-black bg-black px-4 py-3 text-white shadow-sm"
              >
                Falar connosco <MessageCircle className="size-4" />
              </a>
            </div>
          </div>
        )}
      </header>

      <section className="solar-landing-hero solar-landing-hero-v2 relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#faf8f3]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div className="solar-hero-v2-copy">
            <div className="solar-hero-brand">
              <span className="solar-hero-brand-mark"><EclipseMark className="size-12 sm:size-14" /></span>
              <span className="solar-hero-brand-name">Solar Eclipse</span>
            </div>
            <div className="solar-live-badge"><span className="solar-live-dot" /> SOLAR ECLIPSE • CONVITES DIGITAIS</div>
            <h1 className="text-5xl font-light leading-tight tracking-[-0.04em] md:text-7xl">
              O convite de casamento<br />que conta a vossa história
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
              Convites digitais premium com fotografia, música, confirmação de convidados, presentes e versão para impressão.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/modelos" className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-white transition hover:bg-neutral-800">
                Ver modelos <ArrowRight className="size-4" />
              </a>
              <a
                href={whatsappUrl("Olá! Quero criar o meu convite de casamento com a Solar Eclipse.")}
                onClick={(event) => { event.preventDefault(); openWhatsApp("Olá! Quero criar o meu convite de casamento com a Solar Eclipse."); }}
                className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C] px-8 py-4 transition hover:bg-[#C9A84C]/10"
              >
                Criar meu convite <MessageCircle className="size-4" />
              </a>
            </div>
          </div>
          <div className="solar-hero-v2-visual" aria-hidden="true">
            <div className="solar-hero-v2-eclipse">
              <span className="solar-hero-v2-corona" />
              <span className="solar-hero-v2-core" />
              <span className="solar-hero-v2-orbit orbit-a" />
              <span className="solar-hero-v2-orbit orbit-b" />
              <span className="solar-hero-v2-orbit-label orbit-label-a">01</span>
              <span className="solar-hero-v2-orbit-label orbit-label-b">02</span>
              <span className="solar-hero-v2-orbit-label orbit-label-c">03</span>
            </div>
            <div className="solar-hero-v2-caption"><span>01</span><strong>Uma experiência feita para durar</strong><span>2026</span></div>
          </div>
        </div>
      </section>

      <section className="solar-home-carousel relative overflow-hidden border-y border-black/5 bg-[#161616] px-6 py-20 text-white sm:py-24" aria-label="Destaques de modelos">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#d7b56d]">Uma coleção feita para o vosso dia</p>
              <h2 className="mt-4 text-4xl font-light tracking-[-0.045em] sm:text-5xl">Veja o convite ganhar forma.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">Uma seleção de capas, fotografias e composições diferentes. O carrossel avança automaticamente para mostrar vários estilos sem transformar a página numa parede de cartões.</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Modelo anterior" onClick={() => setCarouselIndex((carouselIndex - 1 + HOME_TEMPLATE_IMAGES.length) % HOME_TEMPLATE_IMAGES.length)} className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/[.04] transition hover:border-white/30 hover:bg-white/10">
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" aria-label="Próximo modelo" onClick={() => setCarouselIndex((carouselIndex + 1) % HOME_TEMPLATE_IMAGES.length)} className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/[.04] transition hover:border-white/30 hover:bg-white/10">
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <div className="mt-10 overflow-hidden rounded-[30px] border border-white/10 bg-white/[.035] p-2 sm:p-3">
            <div className="grid gap-3 sm:grid-cols-3">
              {[0,1,2].map((offset) => {
                const index = (carouselIndex + offset) % HOME_TEMPLATE_IMAGES.length;
                const item = TEMPLATE_OPTIONS.find((template) => template.value === HOME_CAROUSEL_VALUES[index]) ?? TEMPLATE_OPTIONS[0]!;
                return (
                  <a key={`${carouselIndex}-${offset}`} href={`/modelos/${item.value}`} className={`group relative overflow-hidden rounded-[24px] ${offset === 1 ? "sm:-translate-y-3" : ""}`}>
                    <img src={HOME_TEMPLATE_IMAGES[index]} alt="" className="h-[360px] w-full object-cover transition duration-700 group-hover:scale-105 sm:h-[430px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <span className="text-[9px] uppercase tracking-[.24em] text-white/55">{String(index + 1).padStart(2, "0")} / Solar Eclipse</span>
                      <h3 className="mt-2 text-2xl font-light">{item.label}</h3>
                      <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white/85">Ver coleção <ArrowRight className="size-3.5" /></span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center gap-1.5" aria-label="Posição do carrossel">
            {HOME_TEMPLATE_IMAGES.map((_, index) => (
              <button key={index} type="button" aria-label={`Ir para destaque ${index + 1}`} aria-current={index === carouselIndex} onClick={() => setCarouselIndex(index)} className={`h-1.5 rounded-full transition-all ${index === carouselIndex ? "w-8 bg-[#d7b56d]" : "w-1.5 bg-white/20 hover:bg-white/40"}`} />
            ))}
          </div>
        </div>
      </section>

      <section id="modelos" className="solar-models-showcase scroll-mt-20 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="text-sm uppercase tracking-widest text-[#C9A84C]">Coleção</p>
            <h2 className="mt-4 text-4xl font-light">Modelos de convite</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/50">
              Cada modelo tem uma direção visual própria. Escolha um ponto de partida e personalize o conteúdo depois.
            </p>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_FEATURED_VALUES.map((value, index) => {
              const item = TEMPLATE_OPTIONS.find((template) => template.value === value) ?? TEMPLATE_OPTIONS[0]!;
              return (
              <a key={item.value} href={`/modelos/${item.value}`} className="solar-home-model-card group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-500 hover:-translate-y-1">
                <div className={`solar-home-template-preview ${templateVisualClass(item.value)} relative h-80 overflow-hidden`}>
                  <img src={HOME_TEMPLATE_IMAGES[index % HOME_TEMPLATE_IMAGES.length]} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-[10px] uppercase tracking-[.22em] text-white/60">{item.family}</p>
                    <h3 className="mt-2 text-2xl font-light">{item.label}</h3>
                    <p className="mt-2 text-sm text-white/70">{item.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">Ver demonstração <ArrowRight className="size-4" /></span>
                  </div>
                </div>
              </a>
              );
            })}
          </div>
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <p className="text-xs text-black/40">Uma seleção dos nossos estilos. A coleção completa está na página de modelos.</p>
            <a href="/modelos" className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-white transition hover:opacity-90">
              Ver coleção completa <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="experiencia" className="solar-home-features scroll-mt-20 bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-4xl font-light">Tudo incluído no seu convite</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-3xl border p-6">
                  <Icon className="text-[#C9A84C]" />
                  <h3 className="mt-5 text-xl">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f3efe7] px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">Pensado para o dia e para depois</p>
            <h2 className="mt-5 text-4xl font-light tracking-[-0.04em] sm:text-5xl">Um convite que continua a ser vosso.</h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-black/55">
              O convite não termina quando a confirmação é enviada. A experiência acompanha os convidados, as memórias e a entrega final.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              ["01", "Uma única experiência", "Link personalizado, galeria, história, programa, localização, presentes e confirmação no mesmo lugar."],
              ["02", "Feito para convidados reais", "Experiência simples no telemóvel, sem obrigar os convidados a instalar uma aplicação."],
              ["03", "Pensado para o casal", "Gestão de convidados, conteúdos, media, RSVP e pacote final num workspace organizado."],
            ].map(([number, title, text]) => (
              <div key={number} className="grid gap-5 rounded-[26px] border border-black/8 bg-white p-6 sm:grid-cols-[56px_1fr] sm:p-7">
                <span className="text-sm font-medium text-[#C9A84C]">{number}</span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-black/50">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">Perguntas frequentes</p>
            <h2 className="mt-4 text-4xl font-light tracking-[-0.04em]">Antes de começar</h2>
          </div>
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-black/10 border-y border-black/10">
            {[
              ["Posso personalizar o modelo?", "Sim. O modelo é o ponto de partida. Nomes, textos, fotografias, vídeos, música, programa, localização, presentes e confirmação podem ser preparados para o casal."],
              ["Os convidados precisam de uma aplicação?", "Não. O convite é aberto através de um link no telemóvel e pode incluir links personalizados para cada convidado."],
              ["Posso ter versão para impressão?", "Sim. O fluxo inclui uma versão preparada para impressão e o pacote de entrega do casal."],
              ["Posso usar o meu próprio conteúdo?", "Sim. A experiência foi pensada para receber as fotografias, vídeos, mensagens e detalhes reais do casamento."],
              ["Como começo?", "Escolha um modelo na coleção e envie o pedido. A nossa equipa entra em contacto para preparar o convite."],
            ].map(([question, answer]) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium">
                  {question}
                  <span className="text-xl font-light text-black/35 transition group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pt-3 text-sm leading-7 text-black/50">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-20 px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <Heart className="mx-auto text-[#C9A84C]" />
          <h2 className="mt-6 text-4xl font-light">Como funciona?</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[["01", "Escolha o modelo"], ["02", "Envie os dados e fale connosco"], ["03", "Receba link digital + PDF"]].map(([number, step]) => (
              <div key={number} className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="text-4xl text-[#C9A84C]">{number}</div>
                <p className="mt-4">{step}</p>
              </div>
            ))}
          </div>
          <a href="/modelos" className="mt-10 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-7 py-3.5 text-sm font-medium">
            Começar agora <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      <section className="bg-black px-6 py-24 text-center text-white">
        <CircleDot className="mx-auto text-[#C9A84C]" />
        <h2 className="mt-6 text-4xl font-light">Criem um convite inesquecível</h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-neutral-300">
          Uma experiência digital criada para guardar para sempre o momento mais importante da vossa vida.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="/modelos" className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-white">
            Escolher modelo <ArrowRight className="size-4" />
          </a>
          <a
            href={whatsappUrl("Olá! Quero falar sobre um convite Solar Eclipse.")}
            onClick={(event) => { event.preventDefault(); openWhatsApp("Olá! Quero falar sobre um convite Solar Eclipse."); }}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/[.03] px-8 py-4 text-white transition hover:bg-white/10"
          >
            Falar connosco <MessageCircle className="size-4" />
          </a>
        </div>
      </section>

      <footer className="bg-[#111] px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2.5"><EclipseMark className="size-5 text-white" /><span className="text-sm font-medium">Solar Eclipse</span></div>
            <p className="mt-3 max-w-sm text-xs leading-6 text-white/40">Convites digitais de casamento pensados para serem vistos, partilhados e lembrados.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/45">
            <a href="/modelos" className="rounded-full border border-white/10 px-3 py-1.5 transition hover:border-white/25 hover:text-white">Modelos</a>
            <a href="#experiencia" className="rounded-full border border-white/10 px-3 py-1.5 transition hover:border-white/25 hover:text-white">Experiência</a>
            <a href="#como-funciona" className="rounded-full border border-white/10 px-3 py-1.5 transition hover:border-white/25 hover:text-white">Como funciona</a>
            <a href={whatsappUrl("Olá! Quero saber mais sobre os convites Solar Eclipse.")} onClick={(event) => { event.preventDefault(); openWhatsApp("Olá! Quero saber mais sobre os convites Solar Eclipse."); }} className="rounded-full border border-white/10 px-3 py-1.5 transition hover:border-white/25 hover:text-white">Contacto</a>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-5 text-[10px] text-white/25">© {new Date().getFullYear()} Solar Eclipse. Todos os direitos reservados.</div>
      </footer>
    </main>
  );
}
