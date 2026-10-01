import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/modelos")({
  component: ModelsPage,
  head: () => ({
    meta: [
      {
        title: "Modelos de Convites | Solar Eclipse",
      },
      {
        name: "description",
        content:
          "Escolha um modelo premium de convite digital de casamento Solar Eclipse.",
      },
    ],
  }),
});

const templates = [
  {
    name: "Noir & Ouro",
    category: "Luxury",
    description:
      "Uma experiência sofisticada em tons escuros com detalhes dourados e atmosfera elegante.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Design premium escuro",
      "Detalhes dourados",
      "Ideal para casamentos elegantes",
    ],
  },
  {
    name: "Aguarela Botânica",
    category: "Romântico",
    description:
      "Um convite delicado inspirado na natureza, flores e tons suaves.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Flores e elementos naturais",
      "Estilo romântico",
      "Cores suaves",
    ],
  },
  {
    name: "Emerald Clássico",
    category: "Tradicional",
    description:
      "Elegância clássica com fundo claro, dourado e acabamento luxuoso.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Fundo claro premium",
      "Tipografia clássica",
      "Cerimónias formais",
    ],
  },
  {
    name: "Xiguiane Moçambicano",
    category: "Cultura",
    description:
      "Um modelo inspirado nas tradições moçambicanas, capulana e celebração familiar.",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Identidade africana",
      "Selos familiares",
      "Ideal para cerimónias tradicionais",
    ],
  },
];

function ModelsPage() {
  return (
    <main className="min-h-screen bg-[#faf8f3] text-neutral-900">
      <section className="px-6 py-24 text-center">
        <p className="mb-4 text-sm tracking-[0.3em] uppercase text-[#C9A84C]">
          Solar Eclipse
        </p>

        <h1 className="mx-auto max-w-4xl text-5xl font-light tracking-tight md:text-7xl">
          Escolha o estilo do seu convite
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-neutral-600">
          Modelos criados para transformar o casamento numa experiência
          inesquecível para o casal e convidados.
        </p>
      </section>


      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 md:grid-cols-2">
        {templates.map((template) => (
          <article
            key={template.name}
            className="overflow-hidden rounded-3xl bg-white shadow-xl"
          >
            <img
              src={template.image}
              alt={template.name}
              className="h-[420px] w-full object-cover"
            />

            <div className="p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#C9A84C]">
                  {template.category}
                </span>

                <Sparkles size={20} className="text-[#C9A84C]" />
              </div>


              <h2 className="text-3xl font-light">
                {template.name}
              </h2>

              <p className="mt-4 text-neutral-600">
                {template.description}
              </p>


              <ul className="mt-6 space-y-3">
                {template.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Check
                      size={18}
                      className="text-[#C9A84C]"
                    />
                    {feature}
                  </li>
                ))}
              </ul>


              <Link
                to="/"
                className="mt-8 flex items-center justify-center gap-3 rounded-full bg-black px-6 py-4 text-white transition hover:bg-neutral-800"
              >
                Escolher este modelo
                <ArrowRight size={18}/>
              </Link>

            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
