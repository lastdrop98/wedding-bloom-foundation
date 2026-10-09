import { looseDb } from "@/lib/event";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { MessageCircle, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getPublicSiteUrl } from "@/lib/publicUrl";

export function DeliveryPackage({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  const [coupleToken, setCoupleToken] = useState<string | null>(null);
  const [coupleTokenLoading, setCoupleTokenLoading] = useState(true);
  const [coupleTokenError, setCoupleTokenError] = useState<string | null>(null);
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    setOrigin(getPublicSiteUrl());
    setCoupleTokenLoading(true);
    setCoupleTokenError(null);

    void supabase
      .from("events")
      .select("id")
      .eq("slug", slug)
      .maybeSingle()
      .then(async ({ data, error: eventError }) => {
        if (cancelled) return;
        if (eventError || !data?.id) {
          setCoupleTokenError("Não foi possível localizar este evento para preparar o acesso privado.");
          setCoupleTokenLoading(false);
          return;
        }

        const { data: existing, error: readError } = await looseDb
          .from("couple_access_tokens")
          .select("token")
          .eq("event_id", data.id)
          .maybeSingle();

        if (cancelled) return;
        if (existing?.token) {
          setCoupleToken(existing.token);
          setCoupleTokenLoading(false);
          return;
        }

        // Older events may not yet have a private token. Create one from the authenticated
        // admin workspace; if the database rejects this, never fall back to an unprotected URL.
        const generatedToken = crypto.randomUUID().replaceAll("-", "");
        const { data: created, error: createError } = await looseDb
          .from("couple_access_tokens")
          .insert({ event_id: data.id, token: generatedToken })
          .select("token")
          .single();

        if (cancelled) return;
        if (created?.token) {
          setCoupleToken(created.token);
          setCoupleTokenLoading(false);
          return;
        }

        // Another tab may have created the token at the same time; reuse it if present.
        const { data: retry } = await looseDb
          .from("couple_access_tokens")
          .select("token")
          .eq("event_id", data.id)
          .maybeSingle();

        if (cancelled) return;
        if (retry?.token) {
          setCoupleToken(retry.token);
        } else {
          setCoupleTokenError(
            readError || createError
              ? "O acesso privado não pôde ser preparado. Verifique as permissões da tabela de acesso no Supabase."
              : "Não foi possível gerar o link privado deste casal.",
          );
        }
        setCoupleTokenLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCoupleTokenError("Ocorreu um erro ao preparar o acesso privado.");
        setCoupleTokenLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug]);

  const inviteLink = `${origin}/${slug}`;
  const couplePanelLink = coupleToken
    ? `${origin}/${slug}/confirmacoes?acesso=${encodeURIComponent(coupleToken)}`
    : null;

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
          {couplePanelLink ? (
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
          ) : (
            <p role={coupleTokenError ? "alert" : "status"} className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-5">
              {coupleTokenLoading
                ? "A preparar o acesso privado do casal…"
                : coupleTokenError ?? "O link privado ainda não está disponível."}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            O painel só é partilhado quando existe um token privado válido. Não é criado um link público para as confirmações.
          </p>
        </div>
      </div>
    </section>
  );
}
