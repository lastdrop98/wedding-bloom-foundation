import { looseDb } from "@/lib/event";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { MessageCircle, Share2 } from "lucide-react";

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
        const { data: token } = await looseDb
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

  useEffect(() => {
    if (!origin) return;
    QRCode.toDataURL(inviteLink, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: "M",
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
  async function shareInvite() {
    const title = "Convite digital";
    const text = "Partilhe o convite digital do casal:";
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: inviteLink });
        return;
      } catch {
        return;
      }
    }
    await copy(inviteLink, "Link do convite copiado. Pode partilhá-lo agora.");
  }

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`Convite digital: ${inviteLink}`)}`;


  return (
    <section className="space-y-4">
      <p className="eyebrow">Pacote de Entrega</p>
      <p className="text-sm text-muted-foreground">
        Tudo o que o casal precisa para partilhar o convite e acompanhar as confirmações.
      </p>

      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
        {qrSrc && (
          <div className="space-y-2">
            <img
              src={qrSrc}
              alt={`QR code do convite ${slug}`}
              width={200}
              height={200}
              className="rounded-md border border-border bg-white p-2"
            />
            <a
              href={qrSrc}
              download={`qr-${slug}.png`}
              className="block text-center text-xs tracking-[0.18em] text-muted-foreground uppercase hover:text-foreground"
            >
              Baixar QR
            </a>
          </div>
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
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => copy(inviteLink, "Link do convite copiado.")}
              >
                Copiar
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => void shareInvite()}>
                <Share2 className="mr-2 size-3.5" /> Partilhar
              </Button>
              <Button asChild type="button" size="sm" variant="outline">
                <a href={whatsappShare} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 size-3.5" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div>
            <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Convites para impressão
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={"/" + slug + "/imprimir?formato=a5"} target="_blank" rel="noreferrer">
                  A5
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={"/" + slug + "/imprimir?formato=a6"} target="_blank" rel="noreferrer">
                  A6
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a
                  href={"/" + slug + "/imprimir?tipo=individual&formato=a6"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Individual
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a
                  href={"/" + slug + "/imprimir?tipo=casal&formato=a6"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Casal
                </a>
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={couplePanelLink} target="_blank" rel="noreferrer">
                Painel do Casal
              </a>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => void copy(couplePanelLink, "Link privado do casal copiado.")}>
              Copiar link privado
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            O Painel do Casal usa um link privado único; partilhe-o apenas com o casal.
          </p>
        </div>
      </div>
    </section>
  );
}
