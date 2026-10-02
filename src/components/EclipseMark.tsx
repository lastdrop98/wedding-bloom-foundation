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
      <circle
        cx="16"
        cy="16"
        r="11.4"
        stroke="#C9A84C"
        strokeWidth="0.9"
        opacity=".58"
      />
      <circle
        cx="16"
        cy="16"
        r="10.1"
        stroke="#D9B45B"
        strokeWidth="0.65"
        opacity=".72"
      />
      <circle cx="14.1" cy="14.1" r="8.9" fill="#C9A84C" opacity=".96" />
      <circle cx="17" cy="17" r="8.7" fill="#11100E" />
      <path
        d="M8.5 7.9a9.1 9.1 0 0 0-1.8 12.3"
        stroke="#F4E3B2"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity=".9"
      />
      <path
        d="M23.6 23.6a10.8 10.8 0 0 0 2.1-5.2"
        stroke="#C9A84C"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  );
}
