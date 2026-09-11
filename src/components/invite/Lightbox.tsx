import { useEffect } from "react";

export function Lightbox({
  src,
  caption,
  onClose,
}: {
  src: string;
  caption?: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex animate-fade-in flex-col items-center justify-center gap-4 bg-[oklch(0.16_0.02_70/0.92)] p-6 backdrop-blur-sm"
    >
      <img
        src={src}
        alt={caption ?? "Fotografia"}
        className="max-h-[80vh] max-w-full rounded-sm border border-gold/30 object-contain shadow-2xl"
      />
      {caption && (
        <p className="font-sans text-xs tracking-widest text-cream/80 uppercase">{caption}</p>
      )}
      <button
        type="button"
        onClick={onClose}
        className="font-sans text-xs tracking-[0.3em] text-gold uppercase"
      >
        Fechar
      </button>
    </div>
  );
}
