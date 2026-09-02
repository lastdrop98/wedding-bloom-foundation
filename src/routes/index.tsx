import { useRef } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  BadgeCheck,
  CalendarClock,
  Clock3,
  Gift,
  Globe,
  Images,
  MapPin,
  MessageCircle,
  Scroll,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";

import { FlourishFrame } from "@/components/invite/Flourish";
import { CountUp } from "@/components/invite/CountUp";
import { Ornament } from "@/components/invite/Ornament";
import { Reveal } from "@/components/invite/Reveal";
import { SectionVines, VineDivider } from "@/components/invite/Vines";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1529788295308-1eace6f67388?fm=jpg&q=80&w=2400&auto=format&fit=crop";
const STEPS_IMAGE =
  "https://images.unsplash.com/photo-1525441273400-056e9c7517b3?fm=jpg&q=80&w=2400&auto=format&fit=crop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solar Eclipse — Convites Digitais e Páginas Web à Medida" },
      {
        name: "description",
        content:
          "Convites digitais elegantes e páginas web personalizadas, feitos à medida em Moçambique. Escolha um template e nós tratamos de tudo.",
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
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.png" },
    ],
  }),
  component: Index,
});

const WHATSAPP_NUMBER = "+258847404160";

const TEMPLATES = [
  {
    id: "golden-classic",
    name: "Noir & Ouro",
    badge: "Popular",
    description:
      "Elegância dramática com fotografia a ecrã inteiro, tipografia serif e acentos dourados sobre preto.",
    features: ["Fotografia em ecrã inteiro", "Animações suaves", "Paleta preto & dourado"],
  },
];

const FEATURES = [
  {
    icon: Smartphone,
    title: "Otimizado para Telemóvel",
    description: "Abre perfeito em qualquer ecrã, onde os convidados realmente leem.",
  },
  {
    icon: Sparkles,
    title: "Templates Bonitos",
    description: "Desenhos cuidados ao detalhe, personalizados com as suas cores.",
  },
  {
    icon: MapPin,
    title: "Localização com Mapa",
    description: "Cerimónia e recepção com direcções a um toque de distância.",
  },
  {
    icon: Images,
    title: "Galeria de Fotos",
    description: "As vossas fotografias num grid elegante com visualização ampliada.",
  },
  {
    icon: Users,
    title: "Confirmação de Presença",
    description: "Os convidados respondem no convite e você vê tudo organizado.",
  },
  {
    icon: Gift,
    title: "Presentes por Conta Bancária",
    description: "Dados bancários apresentados com discrição e bom gosto.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Escolha o Template",
    description: "Veja o catálogo e diga-nos qual o estilo de que gosta.",
  },
  {
    n: "2",
    title: "Envie-nos os Detalhes",
    description: "Nomes, fotos, data e local — por WhatsApp ou formulário.",
  },
  {
    n: "3",
    title: "Recebe o Link",
    description: "Criamos tudo e entregamos pronto a partilhar com os convidados.",
  },
];

const FAQ = [
  {
    q: "Quanto custa?",
    a: "O preço é combinado consoante o template escolhido e a complexidade do projeto. Fale connosco e enviamos uma proposta clara, sem valores escondidos.",
  },
  {
    q: "Como os convidados recebem o convite?",
    a: "Recebe um link único do seu convite, que pode partilhar por WhatsApp, e-mail ou redes sociais quantas vezes quiser.",
  },
  {
    q: "Preciso de saber design?",
    a: "Não. Tratamos de tudo — desde o desenho ao texto e às fotografias. Só precisa de nos enviar os detalhes do evento.",
  },
  {
    q: "Posso editar depois de publicado?",
    a: "Sim, sempre que precisar. Basta dizer-nos o que mudar e atualizamos o convite no mesmo link.",
  },
  {
    q: "Há limite de convidados?",
    a: "Não. O convite pode ser partilhado com quantas pessoas quiser, sem custo adicional por convidado.",
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
      <section className="section-dark relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Eclipse solar"
            className="ken-burns size-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="veil-hero absolute inset-0 opacity-70" />
        </div>

        <SectionVines variant="a" className="opacity-80" />
        <SectionVines variant="c" className="opacity-50 rotate-180" />
        <FlourishFrame size={120} />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow text-gold/90">Convites digitais & páginas web</p>
            <h1 className="mt-6 text-[clamp(2.75rem,10vw,5rem)] leading-[1.05] font-light tracking-wide text-cream">
              Solar Eclipse
            </h1>
            <Ornament className="mt-9" />
            <p className="mx-auto mt-8 max-w-lg font-sans text-base leading-relaxed text-cream/85">
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
                className="inline-flex items-center gap-2 rounded-sm border border-gold/70 px-8 py-4 font-sans text-[0.7rem] tracking-[0.25em] text-gold uppercase transition-all duration-500 hover:border-warm hover:bg-gold hover:text-ink"
              >
                <MessageCircle className="size-4" />
                Falar Connosco
              </a>
            </div>
          </Reveal>

          {/* barra de confiança */}
          <Reveal delay={260}>
            <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 font-sans text-[0.7rem] tracking-wide text-cream/70">
              <li className="inline-flex items-center gap-2">
                <Clock3 className="size-3.5 text-amber" />
                Resposta em poucas horas
              </li>
              <span className="text-gold/50">·</span>
              <li className="inline-flex items-center gap-2">
                <BadgeCheck className="size-3.5 text-amber" />
                Convites entregues em Moçambique
              </li>
              <span className="text-gold/50">·</span>
              <li className="inline-flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-amber" />
                Sem letras miúdas
              </li>
            </ul>
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

      {/* ——— TUDO O QUE PRECISA ——— */}
      <section className="relative overflow-hidden bg-background px-6 py-28">
        <SectionVines variant="b" className="opacity-60" />
        <SectionVines variant="a" className="opacity-35 rotate-180" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow text-warm">Funcionalidades</p>
              <h2 className="mt-5 text-[clamp(2rem,6vw,3.5rem)] leading-tight font-light text-ink">
                Tudo o que Precisa
              </h2>
              <Ornament className="mx-auto mt-7" />
            </div>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 100}>
                <article className="card-warm flex h-full flex-col p-7">
                  <span className="inline-flex size-11 items-center justify-center rounded-full border border-warm/40 bg-accent/60">
                    <feature.icon className="size-5 text-warm" />
                  </span>
                  <h3 className="mt-5 text-xl font-light text-ink">{feature.title}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <VineDivider />

      {/* ——— COMO FUNCIONA ——— */}
      <section className="section-dark relative overflow-hidden px-6 py-28">
        <div className="absolute inset-0">
          <img
            src={STEPS_IMAGE}
            alt="Mesa posta com luz quente"
            loading="lazy"
            className="size-full object-cover object-[50%_60%] blur-[2px]"
          />
          <div className="veil-soft absolute inset-0" />
        </div>

        <SectionVines variant="c" className="opacity-70" />
        <SectionVines variant="b" className="opacity-40 rotate-180" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow text-amber">Simples e sem esforço</p>
              <h2 className="mt-5 text-[clamp(2rem,6vw,3.5rem)] leading-tight font-light text-cream">
                Como Funciona
              </h2>
              <Ornament className="mx-auto mt-7" />
            </div>
          </Reveal>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 140}>
                <div className="relative h-full border border-gold/25 bg-ink/40 p-8 backdrop-blur-sm">
                  <span className="absolute -top-6 right-5 font-serif text-[5rem] leading-none text-warm/30 select-none">
                    {step.n}
                  </span>
                  <h3 className="relative text-2xl font-light text-cream">{step.title}</h3>
                  <span className="mt-4 block h-px w-12 bg-linear-to-r from-amber to-transparent" />
                  <p className="mt-4 font-sans text-sm leading-relaxed text-cream/75">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— CATÁLOGO DE TEMPLATES ——— */}
      <section ref={catalogRef} className="relative overflow-hidden bg-background px-6 py-28">
        <SectionVines variant="b" className="opacity-60" />
        <SectionVines variant="c" className="opacity-35 rotate-180" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow text-warm">Catálogo de templates</p>
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
                  <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                    <div className="absolute inset-0 bg-linear-to-b from-ink via-ink/95 to-gold/20" />
                    {template.badge ? (
                      <span className="absolute top-4 left-4 z-10 rounded-full bg-warm px-3 py-1 font-sans text-[0.6rem] tracking-[0.2em] text-cream uppercase">
                        {template.badge}
                      </span>
                    ) : null}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <span className="eyebrow text-gold/70">Template</span>
                      <h3 className="mt-4 text-3xl font-light tracking-wide text-cream">{template.name}</h3>
                      <Ornament className="mt-6" />
                    </div>
                    <div className="absolute right-4 bottom-4 left-4 flex gap-2">
                      <span className="h-1.5 flex-1 rounded-full bg-gold/30" />
                      <span className="h-1.5 flex-1 rounded-full bg-warm/30" />
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

      {/* ——— GESTÃO DE CONVIDADOS (mockup) ——— */}
      <section className="section-dark relative overflow-hidden px-6 py-28">
        <SectionVines variant="a" className="opacity-70" />
        <SectionVines variant="b" className="opacity-40 rotate-180" />

        <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="eyebrow text-amber">Gestão de convidados</p>
              <h2 className="mt-5 text-[clamp(1.9rem,5vw,3rem)] leading-tight font-light text-cream">
                Saiba quem vem, em tempo real
              </h2>
              <span className="mt-6 block h-px w-16 bg-linear-to-r from-gold to-transparent" />
              <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-cream/75">
                Cada confirmação de presença fica registada e organizada. Nós enviamos-lhe o resumo
                actualizado sempre que precisar — sem folhas de cálculo nem mensagens perdidas.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="card-elegant bg-ink/60 p-8 backdrop-blur-sm">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-gold/80">Confirmações</span>
                <CalendarClock className="size-4 text-amber" />
              </div>
              <p className="mt-4 font-serif text-6xl font-light text-cream">
                <CountUp value={58} />
              </p>
              <p className="mt-1 font-sans text-xs text-cream/60">respostas recebidas</p>

              <div className="mt-7">
                <div className="flex items-center justify-between font-sans text-xs text-cream/70">
                  <span>Taxa de resposta</span>
                  <span className="text-gold">
                    <CountUp value={84} suffix="%" />
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream/10">
                  <div className="h-full w-[84%] rounded-full bg-linear-to-r from-warm to-gold" />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Vão", value: 24, tone: "text-gold" },
                  { label: "Não vão", value: 3, tone: "text-warm" },
                  { label: "Pendentes", value: 5, tone: "text-cream/70" },
                ].map((stat) => (
                  <div key={stat.label} className="border border-gold/20 p-4">
                    <p className={`font-serif text-3xl font-light ${stat.tone}`}>
                      <CountUp value={stat.value} />
                    </p>
                    <p className="mt-1 font-sans text-[0.65rem] tracking-wide text-cream/55 uppercase">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— PÁGINAS WEB PERSONALIZADAS ——— */}
      <section className="relative overflow-hidden bg-background px-6 py-28">
        <SectionVines variant="c" className="opacity-55" />
        <SectionVines variant="a" className="opacity-30 rotate-180" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow text-warm">Além dos convites</p>
              <h2 className="mt-5 text-[clamp(2rem,6vw,3.5rem)] leading-tight font-light text-ink">
                Páginas Web Personalizadas
              </h2>
              <Ornament className="mx-auto mt-7" />
              <p className="mx-auto mt-6 max-w-lg font-sans text-base leading-relaxed text-muted-foreground">
                Sites à medida para negócios, eventos e portfólios. Desde a ideia ao lançamento, desenhamos
                uma presença online que se destaca. Consulte-nos para um orçamento.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-12 flex justify-center">
              <a
                href={whatsappUrl("Olá! Gostaria de saber mais sobre páginas web personalizadas.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-warm/70 px-10 py-4 font-sans text-[0.7rem] tracking-[0.25em] text-warm uppercase transition-all duration-500 hover:bg-warm hover:text-cream"
              >
                <Globe className="size-4" />
                Pedir Orçamento
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <VineDivider />

      {/* ——— FAQ ——— */}
      <section className="section-dark relative overflow-hidden px-6 py-28">
        <SectionVines variant="b" className="opacity-70" />
        <SectionVines variant="c" className="opacity-40 rotate-180" />
        <FlourishFrame size={100} />

        <div className="relative z-10 mx-auto max-w-3xl">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow text-amber">Perguntas frequentes</p>
              <h2 className="mt-5 text-[clamp(2rem,6vw,3.5rem)] leading-tight font-light text-cream">
                Antes de Começar
              </h2>
              <Ornament className="mx-auto mt-7" />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Accordion type="single" collapsible className="mt-14 w-full">
              {FAQ.map((item) => (
                <AccordionItem key={item.q} value={item.q} className="border-gold/25">
                  <AccordionTrigger className="text-left font-serif text-lg font-light text-cream hover:text-gold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-sm leading-relaxed text-cream/75">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ——— PORTFÓLIO ——— */}
      <section className="relative overflow-hidden bg-background px-6 py-28">
        <SectionVines variant="a" className="opacity-50" />
        <SectionVines variant="b" className="opacity-30 rotate-180" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow text-warm">Portfólio</p>
              <h2 className="mt-5 text-[clamp(2rem,6vw,3.5rem)] leading-tight font-light text-ink">
                Já Criámos
              </h2>
              <Ornament className="mx-auto mt-7" />
              <p className="mx-auto mt-6 max-w-md font-serif text-lg font-light text-ink/70 italic">
                Inspirados pelos melhores do mundo, feitos à nossa maneira.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {[
              "Os nossos trabalhos mais recentes estarão aqui em breve.",
              "Fale connosco para ver exemplos personalizados do seu projeto.",
            ].map((text, i) => (
              <Reveal key={text} delay={100 + i * 100}>
                <div className="card-warm flex aspect-[4/3] flex-col items-center justify-center p-8 text-center">
                  <Sparkles className="size-8 text-warm/70" />
                  <p className="mt-5 text-xl font-light text-ink">Em breve</p>
                  <p className="mt-2 max-w-xs font-sans text-sm text-muted-foreground">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— RODAPÉ ——— */}
      <footer className="section-dark relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="size-full scale-x-[-1] object-cover object-center"
          />
          <div className="veil-deep absolute inset-0" />
        </div>

        <SectionVines variant="b" className="opacity-45" />
        <SectionVines variant="c" className="opacity-30 rotate-180" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <Ornament className="mx-auto" />
          <p className="mt-6 font-serif text-lg font-light tracking-wide text-cream">Solar Eclipse</p>
          <p className="mt-2 font-sans text-xs text-cream/60">
            Convite criado com <span className="text-warm">♡</span> por Solar Eclipse
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
