import type { ReactNode } from "react";

import { getTemplateDefinition } from "@/lib/templates";

export function TemplateAtmosphere({
  template,
  children,
}: {
  template?: string | null;
  children?: ReactNode;
}) {
  const definition = getTemplateDefinition(template);
  const tone = definition.tone;
  const isFilm = definition.value === "film-noir-motion";
  const isMagazine = definition.value === "editorial-magazine";
  const isPearl = definition.value === "pearl-garden";
  const isCapulana = definition.value === "capulana-contemporary";
  const isCelestial = definition.value === "celestial-ivory";
  const isCoastal = definition.value === "coastal-blue";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden template-atmosphere template-atmosphere-${tone}`}
      aria-hidden="true"
    >
      {children}
      <span className="template-orb template-orb-a" />
      <span className="template-orb template-orb-b" />
      {tone === "midnight" && <span className="template-orbit-lines" />}
      {tone === "xiguiane" && <span className="template-geometry" />}
      {tone === "sand" && <span className="template-sun" />}
      {isFilm && <span className="template-film-grain" />}
      {isMagazine && <span className="template-magazine-grid" />}
      {isPearl && <span className="template-pearl-bloom" />}
      {isCapulana && <span className="template-capulana-pattern" />}
      {isCelestial && <span className="template-celestial-orbits" />}
      {isCoastal && <span className="template-coastal-wave" />}
    </div>
  );
}
