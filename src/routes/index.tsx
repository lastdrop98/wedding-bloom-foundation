import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Heart, Image, Music, QrCode, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Solar Eclipse — Convites Digitais de Casamento" },
      { name: "description", content: "Convites digitais premium de casamento com fotos, vídeo, música, RSVP, convidados, presentes e versão para impressão." },
    ],
  }),
});

const features = [
  { icon: Image, title: "Galeria de Memórias", text: "Fotos e vídeos do casal numa experiência elegante." },
  { icon: Music, title: "Música Personalizada", text: "Escolha a banda sonora especial do seu casamento." },
  { icon: Users, title: "Gestão de Convidados", text: "Confirmações RSVP e links individuais." },
  { icon: QrCode, title: "Presentes Digitais", text: "Receba contribuições através de QR Code." },
];

const templates = [
  { id: "golden-classic", name: "Noir & Ouro", style: "Luxo moderno", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80" },
  { id: "aquarela-botanica", name: "Aguarela Botânica", style: "Romântico", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80" },
  { id: "emerald-elegante", name: "Emerald Clássico", style: "Elegância tradicional", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80" },
];

function HomePage() {
  return (
    <main className="bg-[#faf8f3] text-neutral-900">
      <section className="relative overflow-hidden px-6 py-32 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#faf8f3]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#C9A84C]">Solar Eclipse</p>
          <h1 className="text-5xl font-light leading-tight md:text-7xl">O convite de casamento<br />que conta a vossa história</h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-neutral-600">Convites digitais premium com fotografia, música, confirmação de convidados, presentes e versão para impressão.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="/modelos" className="rounded-full bg-black px-8 py-4 text-white transition hover:bg-neutral-800">Ver modelos</a>
            <a href="/modelos" className="rounded-full border border-[#C9A84C] px-8 py-4 transition hover:bg-[#C9A84C]/10">Criar meu convite</a>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="text-sm uppercase tracking-widest text-[#C9A84C]">Coleção</p>
            <h2 className="mt-4 text-4xl font-light">Modelos de convite</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {templates.map((item) => (
              <a key={item.id} href={`/modelos/${item.id}`} className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-500 hover:-translate-y-1">
                <img src={item.image} alt={item.name} loading="lazy" className="h-80 w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="p-6">
                  <h3 className="text-2xl">{item.name}</h3>
                  <p className="mt-2 text-neutral-500">{item.style}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">Ver modelo <ArrowRight size={15} /></span>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a href="/modelos" className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-white">Explorar todos os modelos <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-4xl font-light">Tudo incluído no seu convite</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return <div key={feature.title} className="rounded-3xl border p-6"><Icon className="text-[#C9A84C]" /><h3 className="mt-5 text-xl">{feature.title}</h3><p className="mt-3 text-sm text-neutral-600">{feature.text}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <Heart className="mx-auto text-[#C9A84C]" />
          <h2 className="mt-6 text-4xl font-light">Como funciona?</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {["Escolha o modelo", "Personalizamos com a vossa história", "Receba link digital + PDF"].map((step, index) => (
              <div key={step} className="rounded-3xl bg-white p-8 shadow"><div className="text-4xl text-[#C9A84C]">0{index + 1}</div><p className="mt-4">{step}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-24 text-center text-white">
        <Sparkles className="mx-auto text-[#C9A84C]" />
        <h2 className="mt-6 text-4xl font-light">Criem um convite inesquecível</h2>
        <p className="mx-auto mt-5 max-w-xl text-neutral-300">Uma experiência digital criada para guardar para sempre o momento mais importante da vossa vida.</p>
        <a href="/modelos" className="mt-10 inline-flex rounded-full bg-[#C9A84C] px-10 py-4 text-white">Escolher modelo</a>
      </section>
    </main>
  );
}
