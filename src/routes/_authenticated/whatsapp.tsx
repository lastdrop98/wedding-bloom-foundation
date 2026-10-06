import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MessageCircle, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";
import { EclipseMark } from "@/components/EclipseMark";

export const Route = createFileRoute("/_authenticated/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp — Solar Eclipse" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WhatsAppPage,
});

function WhatsAppPage() {
  const [phone, setPhone] = useState("258847404160");
  const [message, setMessage] = useState("Olá! Este é um teste do Solar Eclipse.");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("solar-eclipse-whatsapp-phone");
    if (stored) setPhone(stored);
  }, []);

  function save() {
    window.localStorage.setItem("solar-eclipse-whatsapp-phone", phone.replace(/\D/g, ""));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  const url = whatsappUrl(message, phone);

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-5 py-8 text-[#1d1d1f]">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-black/55 hover:text-black">
            <ArrowLeft className="size-4" /> Voltar ao Admin
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <EclipseMark className="size-7" /> Solar Eclipse
          </div>
        </div>

        <section className="mt-10 rounded-3xl border border-black/[.07] bg-white p-6 shadow-sm md:p-9">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#25D366]/10">
              <MessageCircle className="size-6 text-[#128C7E]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-black/40">Comunicação</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">WhatsApp</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
                Central para testar e gerir o contacto WhatsApp usado pelos pedidos de modelos.
                O contacto abre pelo endereço oficial do WhatsApp. Esta central não expõe tokens nem credenciais de API no navegador.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Número WhatsApp
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 outline-none focus:border-black/30"
                placeholder="258..."
              />
            </label>
            <label className="space-y-2 text-sm font-medium md:col-span-2">
              Mensagem de teste
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-black/10 bg-white p-3 outline-none focus:border-black/30"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#128C7E] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              <MessageCircle className="size-4" /> Abrir WhatsApp
            </a>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/[.03]"
            >
              <ExternalLink className="size-4" /> Abrir link web
            </a>
            <button
              type="button"
              onClick={save}
              className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/[.03]"
            >
              Guardar número
            </button>
          </div>

          {saved && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="size-4" /> Número guardado neste navegador.
            </p>
          )}
        </section>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/[.06] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-black/35">Ligação atual</p>
            <p className="mt-2 text-sm font-medium">WhatsApp Web / App</p>
            <p className="mt-1 text-xs leading-5 text-black/45">Pronta para abrir conversas e partilhar links de convites.</p>
          </div>
          <div className="rounded-2xl border border-black/[.06] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-black/35">API oficial</p>
            <p className="mt-2 text-sm font-medium">Backend seguro necessário</p>
            <p className="mt-1 text-xs leading-5 text-black/45">Tokens da Meta devem ficar no backend/Edge Function, nunca no frontend.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
