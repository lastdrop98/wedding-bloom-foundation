import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { getTemplateDefinition } from "@/lib/templates";
import { openWhatsApp, whatsappUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/modelos/$template")({
  component: TemplatePreviewPage,
  head: ({ params }) => {
    const template = getTemplateDefinition(params.template);
    return {
      meta: [
        {
          title: `${template.label} — Solar Eclipse`,
        },
        {
          name: "description",
          content: `${template.description} Convite digital de casamento Solar Eclipse com RSVP, convidados, música, galeria e versão para impressão.`,
        },
      ],
    };
  },
});

const previewImage =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=90";

function gradient(tone: string) {
  const gradients: Record<string, string> = {
    gold: "from-[#f3eee4] via-[#dfd1b5] to-[#f5f5f3]",
    emerald: "from-[#dbe8df] via-[#f0f1ea] to-white",
    midnight: "from-[#dce5ef] via-[#f3f5f7] to-white",
    rose: "from-[#f0dfe0] via-[#f7f1ef] to-white",
    sand: "from-[#eadfce] via-[#f8f4ed] to-white",
    burgundy: "from-[#ead7d9] via-[#f7f1ef] to-white",
    sapphire: "from-[#dce5f1] via-[#f3f6fa] to-white",
    xiguiane: "from-[#eadcc9] via-[#f6f1e8] to-white",
  };

  return gradients[tone] ?? gradients["gold"];
}

function TemplatePreviewPage() {
  const { template: value } = Route.useParams();
  const template = getTemplateDefinition(value);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function request() {
    if (!name.trim() || !phone.trim()) {
      setError("Preencha o nome do casal e o WhatsApp/telefone para continuar.");
      return;
    }

    setError("");

    const text = [
      `Olá! Quero o modelo ${template.label} para o meu casamento.`,
      `Casal: ${name.trim()}`,
      `Contacto: ${phone.trim()}`,
      date && `Data prevista: ${date}`,
      message.trim() && `Mensagem: ${message.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");

    openWhatsApp(text);
  }

  return (
    <main className={`template-preview template-preview-${template.value} min-h-screen bg-gradient-to-b ${gradient(template.tone)}`}>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href="/modelos"
            className="inline-flex items-center gap-2 text-xs text-black/55 hover:text-black"
          >
            <ArrowLeft className="size-4" /> Modelos
          </a>
          <a href="/" className="text-sm font-semibold">
            Solar Eclipse
          </a>
          <a
            href="#pedido"
            className="rounded-full bg-black px-4 py-2 text-[11px] text-white"
          >
            Escolher este
          </a>
        </div>
      </header>

      <section className="px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-black/45">
              {template.family}
            </p>
            <h1 className="mt-5 text-[clamp(3rem,7vw,6rem)] font-semibold leading-[.9] tracking-[-.065em]">
              {template.label}
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-black/55">
              {template.description}
            </p>

            <div className="mt-8 space-y-3 text-sm text-black/65">
              {[
                "Nome e data personalizados",
                "Fotografias, vídeo e música",
                "RSVP e gestão de convidados",
                "Versão digital e para impressão",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex size-5 items-center justify-center rounded-full bg-black text-white">
                    <Check className="size-3" />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <a
              href="#pedido"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
            >
              <MessageCircle className="size-4" /> Escolher este modelo
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="rounded-[44px] bg-[#151515] p-3 shadow-[0_30px_90px_rgba(0,0,0,.25)]">
              <div className="template-preview-screen relative aspect-[9/18] overflow-hidden rounded-[34px] bg-black">
                <img
                  src={previewImage}
                  alt={`Demonstração do modelo ${template.label}`}
                  className="absolute inset-0 size-full object-cover opacity-70"
                />
                <div className="template-preview-veil absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/85" />
                <span className="template-preview-pattern pointer-events-none absolute inset-0" aria-hidden="true" />
                <div className="absolute inset-x-8 bottom-12 text-center text-white">
                  <p className="text-[9px] uppercase tracking-[.35em] text-white/60">
                    O nosso casamento
                  </p>
                  <h2 className="template-preview-names mt-5 text-4xl font-light">Ana & Miguel</h2>
                  <p className="mt-5 text-xs tracking-[.25em] text-white/70">
                    24 · 10 · 2027
                  </p>
                  <div className="mx-auto mt-8 h-px w-12 bg-white/50" />
                  <p className="mt-7 text-[10px] uppercase tracking-[.22em] text-white/60">
                    Demonstração
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/80 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[.24em] text-black/40">
            Uma experiência completa
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["01", "Capa", "Uma primeira impressão inesquecível."],
              ["02", "História", "Fotografias, momentos e detalhes do casal."],
              ["03", "Confirmação", "RSVP, convidados, localização e presentes."],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-[26px] border border-black/10 bg-white p-7"
              >
                <span className="text-xs text-black/30">{number}</span>
                <h3 className="mt-8 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/45">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pedido" className="scroll-mt-20 bg-[#f6f5f2] px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-black/40">
              Próximo passo
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
              Vamos criar o vosso.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-black/50">
              Envie os dados básicos. O pedido abre uma conversa com a nossa
              equipa já com o modelo escolhido identificado.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-black/50">
                Nome do casal
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nome do casal"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
                />
              </label>

              <label className="text-xs text-black/50">
                WhatsApp / telefone
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+258 ..."
                  inputMode="tel"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
                />
              </label>

              <label className="text-xs text-black/50 sm:col-span-2">
                Data prevista
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
                />
              </label>

              <label className="text-xs text-black/50 sm:col-span-2">
                Mensagem
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Conte-nos brevemente o que pretende..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
                />
              </label>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-xs text-red-700">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={request}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <MessageCircle className="size-4" />
              Enviar pedido pelo WhatsApp
            </button>

            <p className="mt-3 text-center text-[10px] text-black/35">
              Modelo selecionado: {template.label}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#111] px-5 py-24 text-center text-white sm:px-8 sm:py-32">
        <p className="text-[10px] uppercase tracking-[.25em] text-white/40">
          Gostou deste modelo?
        </p>
        <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[.92] tracking-[-.06em]">
          Vamos torná-lo vosso.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/45">
          Nomes, fotos, história, programa, convidados e RSVP. O design
          adapta-se ao vosso casamento.
        </p>
        <a
          href={whatsappUrl(`Olá! Gostei do modelo ${template.label}. Quero saber como avançar.`)}
          target="_blank"
          rel="noreferrer"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black"
        >
          Quero este modelo <ArrowRight className="size-4" />
        </a>
      </section>
    </main>
  );
}
