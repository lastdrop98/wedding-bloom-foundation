import { useEffect, useState } from "react";
import QRCode from "qrcode";

/** Mostra um QR code com os dados bancários para facilitar a transferência. */
export function GiftQr({ text, label = "Ler com o telemóvel" }: { text: string; label?: string }) {
  const [src, setSrc] = useState<string | null>(null);

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
    </div>
  );
}

export default GiftQr;
