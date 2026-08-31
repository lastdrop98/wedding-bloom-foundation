import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Envolve um SVG decorativo: quando entra no viewport, os traços com
 * `data-draw` desenham-se (stroke-dashoffset) e depois ganham um brilho lento.
 */
export function DrawnSvg({
  children,
  className,
  viewBox,
  width,
  height,
  preserveAspectRatio,
  delay = 0,
}: {
  children: ReactNode;
  className?: string | undefined;
  viewBox: string;
  width?: number | string | undefined;
  height?: number | string | undefined;
  preserveAspectRatio?: string | undefined;
  delay?: number | undefined;
}) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      {...(width !== undefined ? { width } : {})}
      {...(height !== undefined ? { height } : {})}
      {...(preserveAspectRatio ? { preserveAspectRatio } : {})}
      fill="none"
      data-drawn={drawn ? "true" : "false"}
      style={{ animationDelay: `${delay}ms`, ["--ornament-delay" as string]: `${delay}ms` }}
      className={cn("ink-draw pointer-events-none", className)}
    >
      <g style={{ animationDelay: `${delay}ms` }}>{children}</g>
    </svg>
  );
}
