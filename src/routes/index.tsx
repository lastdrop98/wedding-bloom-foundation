import { createFileRoute, Link } from "@tanstack/react-router";

import { FlourishFrame } from "@/components/invite/Flourish";
import { Ornament } from "@/components/invite/Ornament";
import { Reveal } from "@/components/invite/Reveal";
import { SectionVines, VineDivider } from "@/components/invite/Vines";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solar Eclipse — Convites Digitais para Eventos" },
      {
        name: "description",
        content:
          "Solar Eclipse cria convites digitais elegantes para eventos, com confirmação de presença, galeria e programa do dia.",
      },
      { property: "og:title", content: "Solar Eclipse — Convites Digitais para Eventos" },
      {
        property: "og:description",
        content: "Convites digitais elegantes, um para cada evento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    title: "Convite próprio",
    text: "Cada evento tem o seu endereço e a sua história, apresentado com fotografia a ecrã inteiro.",
  },
  {
    title: "Confirmar Presença",
    text: "Os convidados respondem em segundos, e as respostas ficam reunidas no painel.",
  },
  {
    title: "Programa do Dia",
    text: "Horários, moradas e mapas — tudo claro para quem recebe o convite.",
  },
];

function Index() {
  return (
    <main className="section-dark eclipse-bg relative min-h-screen overflow-hidden px-6 py-24">
      <SectionVines variant="a" />
      <FlourishFrame size={120} />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow text-cream/70">Convites digitais</p>
          <h1 className="mt-6 text-[clamp(2.75rem,10vw,5rem)] leading-[1.05] font-light tracking-wide text-cream">
            Solar Eclipse
          </h1>
          <Ornament className="mt-9" />
          <p className="mx-auto mt-8 max-w-md font-sans text-sm leading-relaxed text-cream/75">
            Cada evento tem o seu endereço próprio. Peça o link aos anfitriões para abrir o convite.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 120}>
              <div className="card-elegant h-full p-7">
                <span className="draw-rule" />
                <p className="mt-5 text-xl font-light text-cream">{f.title}</p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <VineDivider className="mt-16" />

        <Reveal delay={200}>
          <Link
            to="/admin"
            className="mt-16 inline-flex items-center justify-center rounded-sm border border-gold/70 px-10 py-4 font-sans text-[0.7rem] tracking-[0.35em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-[oklch(0.14_0.01_70)]"
          >
            Área reservada
          </Link>
        </Reveal>
      </div>

      <span className="breathe absolute bottom-8 left-1/2 block h-12 w-px -translate-x-1/2 bg-linear-to-b from-transparent to-gold/80" />
    </main>
  );
}
