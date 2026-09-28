import type { InviteType } from "@/lib/event";

type SealProps = {
  text?: string | null;
  label?: string | null;
  color?: string | null;
  small?: boolean;
};

export function InvitationSeal({ text, label, color, small = false }: SealProps) {
  if (!text) return null;
  const accent = color || "var(--color-gold)";
  return (
    <div
      className={small ? "invite-seal invite-seal-sm" : "invite-seal"}
      style={{ ["--seal-accent" as string]: accent }}
      aria-label={label ? `${label}: ${text}` : text}
    >
      <span className="invite-seal-ring" />
      <span className="invite-seal-text">{text}</span>
      {label && <span className="invite-seal-label">{label}</span>}
    </div>
  );
}

export function EventSeals({
  tipo,
  enabled,
  mode,
  oneText,
  twoText,
  oneLabel,
  twoLabel,
  oneColor,
  twoColor,
}: {
  tipo?: InviteType;
  enabled?: string | null;
  mode?: string | null;
  oneText?: string | null;
  twoText?: string | null;
  oneLabel?: string | null;
  twoLabel?: string | null;
  oneColor?: string | null;
  twoColor?: string | null;
}) {
  if (enabled !== "true") return null;
  const useTwo = mode === "two";
  const resolvedOne = oneText || (tipo === "individual" ? "1" : null);
  const resolvedTwo = twoText || (tipo === "casal" ? "2" : null);
  if (!resolvedOne && !resolvedTwo) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {resolvedOne && <InvitationSeal text={resolvedOne} label={oneLabel || "Convite válido"} color={oneColor} small={useTwo} />}
      {useTwo && resolvedTwo && <InvitationSeal text={resolvedTwo} label={twoLabel || "Convite válido"} color={twoColor} small />}
    </div>
  );
}
