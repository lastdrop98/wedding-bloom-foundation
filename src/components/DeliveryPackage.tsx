import { useEffect, useState } from "react";
import { toast } from "sonner";
import QRCode from "qrcode";

import { Button } from "@/components/ui/button";

export function DeliveryPackage({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  const inviteLink = `${origin}/${slug}`;

  const [qrSrc, setQrSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!origin) return;
    let active = true;
    QRCode.toDataURL(inviteLink, { margin: 1, width: 200, errorCorrectionLevel: "M" })
      .then((url) => {
        if (active) setQrSrc(url);
      })
      .catch(() => {
        if (active) setQrSrc(null);
      });
    return () => {
      active = false;
    };
  }, [origin, inviteLink]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Link do convite copiado.");
    } catch {
      toast.error(inviteLink);
    }
  }

  return (
    <section className="space-y-4">
      <p className="eyebrow">Pacote de Entrega</p>
      <p className="text-sm text-muted-foreground">
        Tudo o que o casal precisa para partilhar o convite e acompanhar as confirmações.
      </p>

      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
        {qrSrc && (
          <img
            src={qrSrc}
            alt={`QR code do convite ${slug}`}
            width={200}
            height={200}
            className="rounded-md border border-border bg-white p-2"
          />
        )}

        <div className="space-y-4">
          <div>
            <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Link do convite
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="rounded-md border border-border bg-background px-3 py-2 text-sm break-all">
                {inviteLink}
              </code>
              <Button type="button" size="sm" variant="outline" onClick={copy}>
                Copiar
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={`/${slug}/imprimir`} target="_blank" rel="noreferrer">
                Ver Versão para Imprimir
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={`/${slug}/confirmacoes`} target="_blank" rel="noreferrer">
                Ver Painel do Casal
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            O Painel do Casal pode ser partilhado diretamente com o casal — não precisa de login,
            basta o link.
          </p>
        </div>
      </div>
    </section>
  );
}
