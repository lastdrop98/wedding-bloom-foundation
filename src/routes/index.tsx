import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Heart,
  Image,
  Menu,
  MessageCircle,
  Music,
  QrCode,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
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

  return (
    <main className="solar-landing min-h-screen bg-[#faf8f3] text-neutral-900">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight" aria-label="Solar Eclipse — início">
            <EclipseMark className="size-7 text-black" />
            <span>Solar Eclipse</span>
          </a>
          <nav className="hidden items-center gap-7 text-xs text-black/55 md:flex">
            <a href="#modelos" className="transition hover:text-black">Modelos</a>
            <a href="#experiencia" className="transition hover:text-black">Experiência</a>
            <a href="#como-funciona" className="transition hover:text-black">Como funciona</a>
            <a
              href={whatsappUrl("Olá! Gostaria de conhecer os convites Solar Eclipse.")}
              onClick={(event) => { event.preventDefault(); openWhatsApp("Olá! Gostaria de conhecer os convites Solar Eclipse."); }}
              className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-white"
            >
              Falar connosco <MessageCircle className="size-3.5" />
            </a>
          </nav>
          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-full border border-black/10 bg-white p-2 md:hidden"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-black/5 bg-[#faf8f3] px-5 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm">
              <a href="#modelos" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white">Modelos</a>
              <a href="#experiencia" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white">Experiência</a>
              <a href="#como-funciona" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white">Como funciona</a>
              <a
                href={whatsappUrl("Olá! Gostaria de conhecer os convites Solar Eclipse.")}
                onClick={(event) => { event.preventDefault(); openWhatsApp("Olá! Gostaria de conhecer os convites Solar Eclipse."); }}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-white"
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
              <span className="solar-hero-v2-star star-a">✦</span>
              <span className="solar-hero-v2-star star-b">·</span>
              <span className="solar-hero-v2-star star-c">✦</span>
            </div>
            <div className="solar-hero-v2-caption"><span>01</span><strong>Uma experiência feita para durar</strong><span>2026</span></div>
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
          <div className="grid gap-8 md:grid-cols-3">
            {TEMPLATE_OPTIONS.slice(0, 12).map((item, index) => (
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
            ))}
          </div>
          <div className="mt-12 text-center">
            <a href="/modelos" className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-white transition hover:opacity-90">
              Explorar todos os modelos <ArrowRight className="size-4" />
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
        <Sparkles className="mx-auto text-[#C9A84C]" />
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
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-white"
          >
            Falar connosco <MessageCircle className="size-4" />
          </a>
        </div>
      </section>

      <footer className="bg-[#111] px-6 py-10 text-center text-xs text-white/40">
        <div className="inline-flex items-center gap-2.5"><EclipseMark className="size-5 text-white" /><span>Solar Eclipse · Convites digitais de casamento</span></div>
      </footer>
    </main>
  );
}
