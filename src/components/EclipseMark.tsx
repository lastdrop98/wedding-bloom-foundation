import type { SVGProps } from "react";

export function EclipseMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      role="img"
      aria-label="Eclipse solar"
      {...props}
    >
      <circle cx="16" cy="16" r="9.5" stroke="currentColor" strokeWidth="1.4" opacity=".28" />
      <path
        d="M8.7 20.7a9.5 9.5 0 0 0 14.6-9.4A9.5 9.5 0 1 1 8.7 20.7Z"
        fill="currentColor"
        opacity=".92"
      />
      <path
        d="M10.2 8.8A9.5 9.5 0 0 1 23.8 23"
        stroke="#C9A84C"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
