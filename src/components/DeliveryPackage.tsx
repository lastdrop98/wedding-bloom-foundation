import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function DeliveryPackage({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  const [coupleToken, setCoupleToken] = useState<string | null>(null);
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
  const couplePanelLink = coupleToken ? `${origin}/${slug}/confirmacoes?acesso=${encodeURIComponent(coupleToken)}` : `${origin}/${slug}/confirmacoes`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteLink)}`;

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
        {origin && (
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
            <p className="font-sans text-xs tracking-[0.2em] text-muted-foreground uppercase">Link do convite</p>
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
              <a href={couplePanelLink} target="_blank" rel="noreferrer">
                Ver Painel do Casal
              </a>
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
