import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

/** Mostra um QR code com os dados bancários para facilitar a transferência. */
export function GiftQr({ text, label = "Ler com o telemóvel" }: { text: string; label?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(text, { margin: 1, width: 320, errorCorrectionLevel: "M" })
      .then((url) => {
        if (active) setSrc(url);
      })
      .catch(() => {
        if (active) setSrc(null);
      });
    return () => {
      active = false;
    };
  }, [text]);

  if (!src) return null;

  return (
    <div className="mt-5 flex flex-col items-center gap-2">
      <img
        src={src}
        alt="QR code com os dados bancários"
        className="h-36 w-36 rounded-md border border-primary/30 bg-white p-2"
      />
      <span className="font-sans text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase">
        {label}
      </span>
      <button
        type="button"
        className="mt-1 inline-flex items-center gap-2 rounded-full border border-primary/20 px-3 py-1.5 font-sans text-[0.65rem] text-primary transition hover:bg-primary/10"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success("Dados copiados.");
            window.setTimeout(() => setCopied(false), 1800);
          } catch {
            toast.error("Não foi possível copiar os dados.");
          }
        }}
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        {copied ? "Copiado" : "Copiar dados"}
      </button>
    </div>
  );
}

export default GiftQr;
