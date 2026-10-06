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
import { whatsappUrl } from "@/lib/whatsapp";

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
  {
    icon: Image,
    title: "Galeria de Memórias",
    text: "Fotos e vídeos do casal numa experiência elegante.",
  },
  {
    icon: Music,
    title: "Música Personalizada",
    text: "Escolha a banda sonora especial do vosso casamento.",
  },
  {
    icon: Users,
    title: "Gestão de Convidados",
    text: "Confirmações RSVP e links individuais.",
  },
  {
    icon: QrCode,
    title: "Presentes Digitais",
    text: "Receba contribuições através de QR Code.",
  },
];

const templates = [
  {
    id: "golden-classic",
    name: "Noir & Ouro",
    style: "Luxo moderno",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "aquarela-botanica",
    name: "Aguarela Botânica",
    style: "Romântico",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "emerald-elegante",
    name: "Emerald Clássico",
    style: "Elegância tradicional",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "xiguiane-tradicional",
    name: "Xiguiane Tradicional",
    style: "Herança moçambicana",
    image:
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80",
  },
];

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#faf8f3] text-neutral-900">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#faf8f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight" aria-label="Solar Eclipse — início">
            <EclipseMark className="size-7 text-black" />
            <span>Solar Eclipse</span>
          </a>

          <nav className="hidden items-center gap-7 text-xs text-black/55 md:flex">
            <a href="#modelos" className="transition hover:text-black">
              Modelos
            </a>
            <a href="#experiencia" className="transition hover:text-black">
              Experiência
            </a>
            <a href="#como-funciona" className="transition hover:text-black">
              Como funciona
            </a>
            <a href={whatsappUrl("Olá! Gostaria de conhecer os convites Solar Eclipse.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-white">
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
              <a href="#modelos" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white">
                Modelos
              </a>
              <a href="#experiencia" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white">
                Experiência
              </a>
              <a href="#como-funciona" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 hover:bg-white">
                Como funciona
              </a>
              <a href={whatsappUrl("Olá! Gostaria de conhecer os convites Solar Eclipse.")} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-white">
                Falar connosco <MessageCircle className="size-4" />
              </a>
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden px-6 py-28 text-center sm:py-36">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#faf8f3]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#C9A84C]">
            Solar Eclipse
          </p>
          <h1 className="text-5xl font-light leading-tight tracking-[-0.04em] md:text-7xl">
            O convite de casamento
            <br />
            que conta a vossa história
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
            Convites digitais premium com fotografia, música, confirmação de
            convidados, presentes e versão para impressão.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="/modelos"
              className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-white transition hover:bg-neutral-800"
            >
              Ver modelos <ArrowRight className="size-4" />
            </a>
            <a
              href={whatsappUrl("Olá! Quero criar o meu convite de casamento com a Solar Eclipse.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C] px-8 py-4 transition hover:bg-[#C9A84C]/10"
            >
              Criar meu convite <MessageCircle className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="modelos" className="scroll-mt-20 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="text-sm uppercase tracking-widest text-[#C9A84C]">
              Coleção
            </p>
            <h2 className="mt-4 text-4xl font-light">Modelos de convite</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/50">
              Escolha um ponto de partida. O conteúdo, fotografias e detalhes
              do vosso evento são personalizados depois.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {templates.map((item) => (
              <a
                key={item.id}
                href={`/modelos/${item.id}`}
                className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-500 hover:-translate-y-1"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="p-6">
                  <h3 className="text-2xl">{item.name}</h3>
                  <p className="mt-2 text-neutral-500">{item.style}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                    Ver modelo <ArrowRight className="size-4" />
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/modelos"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-white transition hover:opacity-90"
            >
              Explorar todos os modelos <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="experiencia" className="scroll-mt-20 bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-4xl font-light">
            Tudo incluído no seu convite
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-3xl border p-6">
                  <Icon className="text-[#C9A84C]" />
                  <h3 className="mt-5 text-xl">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {feature.text}
                  </p>
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
            {[
              ["01", "Escolha o modelo"],
              ["02", "Envie os dados e fale connosco"],
              ["03", "Receba link digital + PDF"],
            ].map(([number, step]) => (
              <div key={number} className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="text-4xl text-[#C9A84C]">{number}</div>
                <p className="mt-4">{step}</p>
              </div>
            ))}
          </div>
          <a
            href="/modelos"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-7 py-3.5 text-sm font-medium"
          >
            Começar agora <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      <section className="bg-black px-6 py-24 text-center text-white">
        <Sparkles className="mx-auto text-[#C9A84C]" />
        <h2 className="mt-6 text-4xl font-light">Criem um convite inesquecível</h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-neutral-300">
          Uma experiência digital criada para guardar para sempre o momento
          mais importante da vossa vida.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="/modelos"
            className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-white"
          >
            Escolher modelo <ArrowRight className="size-4" />
          </a>
          <a
            href={whatsappUrl("Olá! Quero falar sobre um convite Solar Eclipse.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-white"
          >
            Falar connosco <MessageCircle className="size-4" />
          </a>
        </div>
      </section>

      <footer className="bg-[#111] px-6 py-10 text-center text-xs text-white/40">
        <div className="inline-flex items-center gap-2.5">
          <EclipseMark className="size-5 text-white" />
          <span>Solar Eclipse · Convites digitais de casamento</span>
        </div>
      </footer>
    </main>
  );
}
