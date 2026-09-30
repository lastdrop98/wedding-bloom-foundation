import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, MessageCircle, QrCode, Printer } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function DeliveryPackage({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  const [coupleToken, setCoupleToken] = useState<string | null>(null);
  const [qrSrc, setQrSrc] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    void supabase
      .from("events")
      .select("id")
      .eq("slug", slug)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data?.id) return;
        const { data: token } = await supabase
          .from("couple_access_tokens")
          .select("token")
          .eq("event_id", data.id)
          .maybeSingle();
        setCoupleToken(token?.token ?? null);
      });
  }, [slug]);

  const inviteLink = `${origin}/${slug}`;
  const couplePanelLink = coupleToken
    ? `${origin}/${slug}/confirmacoes?acesso=${encodeURIComponent(coupleToken)}`
    : `${origin}/${slug}/confirmacoes`;
  const printBase = `${origin}/${slug}/imprimir`;

  useEffect(() => {
    if (!origin) return;
    QRCode.toDataURL(inviteLink, {
      width: 420,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#111111", light: "#ffffff" },
    })
      .then(setQrSrc)
      .catch(() => setQrSrc(null));
  }, [inviteLink, origin]);

  async function copy(value: string, success = "Link copiado.") {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(success);
    } catch {
      toast.error(value);
    }
  }

  const whatsappText = encodeURIComponent(`Olá! Este é o convite digital: ${inviteLink}`);
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">Pacote de Entrega</p>
        <h3 className="mt-2 text-2xl font-light">Tudo pronto para entregar ao casal</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Convite digital, QR Code, versões para impressão e acesso privado às confirmações. O
          conteúdo permanece ligado ao evento mesmo quando o template é trocado.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Convite Digital", "Página pública do convite"],
          ["QR Code", "Para impressão e partilha"],
          ["Convite PDF", "Versão A5 ou A6"],
          ["Convite para Impressão", "Individual ou casal"],
          ["Painel do Casal", "Acesso privado"],
          ["Confirmações", "Respostas em tempo real"],
        ].map(([title, description]) => (
          <div key={title} className="rounded-xl border border-border bg-background/40 p-4">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              <p className="font-medium">{title}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 rounded-2xl border border-border bg-background/30 p-5 sm:grid-cols-[auto_1fr] sm:items-start">
        {qrSrc ? (
          <div className="space-y-2 text-center">
            <div className="rounded-xl border border-border bg-white p-3">
              <img src={qrSrc} alt={`QR code do convite ${slug}`} width={220} height={220} />
            </div>
            <a
              href={qrSrc}
              download={`qr-${slug}.png`}
              className="font-sans text-xs tracking-[0.18em] text-muted-foreground uppercase hover:text-foreground"
            >
              Baixar QR em PNG
            </a>
          </div>
        ) : (
          <div className="flex size-[220px] items-center justify-center rounded-xl border border-dashed border-border">
            <QrCode className="size-10 text-muted-foreground" />
          </div>
        )}

        <div className="space-y-5">
          <div>
            <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase">
              01 · Convite digital
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm break-all">
                {inviteLink}
              </code>
              <Button type="button" size="sm" variant="outline" onClick={() => copy(inviteLink)}>
                <Copy className="mr-2 size-3.5" />
                Copiar
              </Button>
              <Button asChild size="sm">
                <a href={inviteLink} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 size-3.5" />
                  Abrir
                </a>
              </Button>
            </div>
          </div>

          <div>
            <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase">
              02 · Partilha
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-3.5" />
                  Partilhar no WhatsApp
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copy(couplePanelLink, "Link privado copiado.")}
              >
                Copiar painel do casal
              </Button>
            </div>
          </div>

          <div>
            <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase">
              03 · Impressão
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                ["A5", `${printBase}?formato=a5`],
                ["A6", `${printBase}?formato=a6`],
                ["Individual", `${printBase}?tipo=individual&formato=a6`],
                ["Casal", `${printBase}?tipo=casal&formato=a6`],
              ].map(([label, href]) => (
                <Button key={label} asChild variant="outline" size="sm">
                  <a href={href} target="_blank" rel="noreferrer">
                    <Printer className="mr-2 size-3.5" />
                    {label}
                  </a>
                </Button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Na versão de impressão, use o botão de gerar/guardar PDF do próprio convite.
            </p>
          </div>

          <div>
            <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase">
              04 · Acesso privado
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={couplePanelLink} target="_blank" rel="noreferrer">
                  Abrir painel do casal
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copy(couplePanelLink, "Link privado do casal copiado.")}
              >
                Copiar link privado
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Este link deve ser partilhado apenas com o casal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
