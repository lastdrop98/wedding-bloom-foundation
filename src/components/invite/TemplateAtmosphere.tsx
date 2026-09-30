import type { ReactNode } from "react";

import { getTemplateDefinition } from "@/lib/templates";

export function TemplateAtmosphere({
  template,
  children,
}: {
  template?: string | null;
  children?: ReactNode;
}) {
  const tone = getTemplateDefinition(template).tone;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden template-atmosphere template-atmosphere-${tone}`}
      aria-hidden="true"
    >
      {children}
      <span className="template-orb template-orb-a" />
      <span className="template-orb template-orb-b" />
      {tone === "midnight" && <span className="template-stars" />}
      {tone === "xiguiane" && <span className="template-geometry" />}
      {tone === "sand" && <span className="template-sun" />}
    </div>
  );
}
