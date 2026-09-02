import { useRef } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, Globe, MessageCircle, Scroll, Sparkles } from "lucide-react";

import { FlourishFrame } from "@/components/invite/Flourish";
import { Ornament } from "@/components/invite/Ornament";
import { Reveal } from "@/components/invite/Reveal";
import { SectionVines, VineDivider } from "@/components/invite/Vines";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solar Eclipse — Convites Digitais e Páginas Web à Medida" },
      {
        name: "description",
        content:
          "Solar Eclipse cria convites digitais elegantes e páginas web personalizadas para eventos, negócios e portfólios.",
      },
      {
        property: "og:title",
        content: "Solar Eclipse — Convites Digitais e Páginas Web à Medida",
      },
      {
        property: "og:description",
        content: "Convites digitais elegantes e páginas web feitas à medida por nós.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WHATSAPP_NUMBER = "+258840000000";

const TEMPLATES = [
  {
    id: "golden-classic",
    name: "Noir & Ouro",
    description: "Elegância dramática com fotografia a ecrã inteiro, tipografia serif e acentos dourados sobre preto.",
    features: ["Fotografia em ecrã inteiro", "Animações suaves", "Paleta preto & dourado"],
  },
];

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function Index() {
  const catalogRef = useRef<HTMLElement | null>(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* ——— HERO ——— */}
      <section className="section-dark eclipse-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
        <SectionVines variant="a" />
        <FlourishFrame size={120} />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow text-gold/80">Convites digitais & páginas web</p>
            <h1 className="mt-6 text-[clamp(2.75rem,10vw,5rem)] leading-[1.05] font-light tracking-wide text-cream">
              Solar Eclipse
            </h1>
            <Ornament className="mt-9" />
            <p className="mx-auto mt-8 max-w-lg font-sans text-base leading-relaxed text-cream/80">
              Convites digitais e páginas web, feitos à medida por nós. Cada projeto é desenhado à mão
              para reflectir a história que quer partilhar.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="group inline-flex items-center gap-2 rounded-sm bg-gold px-8 py-4 font-sans text-[0.7rem] font-medium tracking-[0.25em] text-ink uppercase transition-all duration-500 hover:bg-cream hover:shadow-[0_0_40px_-12px_var(--color-gold)]"
              >
                <Scroll className="size-4" />
                Ver Templates
              </button>
              <a
                href={whatsappUrl("Olá! Gostaria de saber mais sobre os vossos convites digitais.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-gold/70 px-8 py-4 font-sans text-[0.7rem] tracking-[0.25em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
              >
                <MessageCircle className="size-4" />
                Falar Connosco
              </a>
            </div>
          </Reveal>
        </div>

        <button
          type="button"
          onClick={scrollToCatalog}
          aria-label="Ver templates"
          className="breathe absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-gold/80 transition-colors hover:text-gold"
        >
          <ArrowDown className="size-5" />
        </button>
      </section>

      {/* ——— CATÁLOGO DE TEMPLATES ——— */}
      <section ref={catalogRef} className="relative overflow-hidden bg-background px-6 py-28">
        <SectionVines variant="b" className="opacity-40" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow text-muted-foreground">Catálogo de templates</p>
              <h2 className="mt-5 text-[clamp(2rem,6vw,3.5rem)] leading-tight font-light text-ink">
                Escolha o seu estilo
              </h2>
              <Ornament className="mx-auto mt-7" />
              <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                Cada template é personalizado com os seus conteúdos, cores e fotografias. Nós tratamos de tudo.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((template, i) => (
              <Reveal key={template.id} delay={i * 120}>
                <article className="card-elegant flex h-full flex-col overflow-hidden">
                  {/* mini-preview estilizado da capa */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                    <div className="absolute inset-0 bg-linear-to-b from-ink via-ink/95 to-gold/20" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <span className="eyebrow text-gold/70">Template</span>
                      <h3 className="mt-4 text-3xl font-light tracking-wide text-cream">{template.name}</h3>
                      <Ornament className="mt-6" />
                    </div>
                    <div className="absolute right-4 bottom-4 left-4 flex gap-2">
                      <span className="h-1.5 flex-1 rounded-full bg-gold/30" />
                      <span className="h-1.5 flex-1 rounded-full bg-gold/20" />
                      <span className="h-1.5 flex-1 rounded-full bg-gold/10" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <p className="font-sans text-sm leading-relaxed text-muted-foreground">{template.description}</p>
                    <ul className="mt-5 space-y-2">
                      {template.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 font-sans text-xs text-ink/80">
                          <Sparkles className="size-3.5 text-gold" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-7">
                      <a
                        href={whatsappUrl(`Olá! Gostaria de um convite no estilo ${template.name}.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-gold/70 px-6 py-3.5 font-sans text-[0.65rem] tracking-[0.25em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
                      >
                        <MessageCircle className="size-3.5" />
                        Quero Este Estilo
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— PÁGINAS WEB PERSONALIZADAS ——— */}
      <section className="section-dark relative overflow-hidden px-6 py-28">
        <SectionVines variant="c" />
        <FlourishFrame size={100} />

        <div className="relative z-10 mx-auto max-w-4xl">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow text-gold/80">Além dos convites</p>
              <h2 className="mt-5 text-[clamp(2rem,6vw,3.5rem)] leading-tight font-light text-cream">
                Páginas Web Personalizadas
              </h2>
              <Ornament className="mx-auto mt-7" />
              <p className="mx-auto mt-6 max-w-lg font-sans text-base leading-relaxed text-cream/75">
                Sites à medida para negócios, eventos e portfólios. Desde a ideia ao lançamento, desenhamos
                uma presença online que se destaca.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-12 flex justify-center">
              <a
                href={whatsappUrl("Olá! Gostaria de saber mais sobre páginas web personalizadas.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-gold/70 px-10 py-4 font-sans text-[0.7rem] tracking-[0.25em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
              >
                <Globe className="size-4" />
                Pedir Orçamento
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— PORTFÓLIO ——— */}
      <section className="relative overflow-hidden bg-background px-6 py-28">
        <SectionVines variant="a" className="opacity-30" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow text-muted-foreground">Portfólio</p>
              <h2 className="mt-5 text-[clamp(2rem,6vw,3.5rem)] leading-tight font-light text-ink">
                Já Criámos
              </h2>
              <Ornament className="mx-auto mt-7" />
            </div>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            <Reveal delay={100}>
              <div className="card-elegant flex aspect-[4/3] flex-col items-center justify-center p-8 text-center">
                <Sparkles className="size-8 text-gold/70" />
                <p className="mt-5 text-xl font-light text-ink">Em breve</p>
                <p className="mt-2 max-w-xs font-sans text-sm text-muted-foreground">
                  Os nossos trabalhos mais recentes estarão aqui em breve.
                </p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="card-elegant flex aspect-[4/3] flex-col items-center justify-center p-8 text-center">
                <Sparkles className="size-8 text-gold/70" />
                <p className="mt-5 text-xl font-light text-ink">Em breve</p>
                <p className="mt-2 max-w-xs font-sans text-sm text-muted-foreground">
                  Fale connosco para ver exemplos personalizados do seu projeto.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— RODAPÉ ——— */}
      <footer className="section-dark relative overflow-hidden px-6 py-16">
        <SectionVines variant="b" className="opacity-25" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <Ornament className="mx-auto" />
          <p className="mt-6 font-serif text-lg font-light tracking-wide text-cream">Solar Eclipse</p>
          <p className="mt-2 font-sans text-xs text-cream/60">
            Convite criado com <span className="text-gold">♡</span> por Solar Eclipse
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <a
              href={whatsappUrl("Olá! Gostaria de saber mais sobre os vossos serviços.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-wide text-gold/80 transition-colors hover:text-gold"
            >
              <MessageCircle className="size-3.5" />
              Falar Connosco
            </a>
            <Link
              to="/admin"
              className="font-sans text-xs text-cream/40 transition-colors hover:text-cream/70"
            >
              Acesso Interno
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
