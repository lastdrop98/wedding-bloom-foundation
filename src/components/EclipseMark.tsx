import type { SVGProps } from "react";

export function EclipseMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      role="img"
      aria-label="Eclipse solar"
      {...props}
    >
      <circle cx="20" cy="20" r="15.2" fill="#F7F2E8" stroke="#D8C68F" strokeWidth="0.7" />
      <circle cx="20" cy="20" r="12.6" stroke="#C9A84C" strokeWidth="0.8" opacity=".8" />
      <circle cx="20" cy="20" r="9.6" fill="#0A0A0A" />
      <circle cx="17.6" cy="16.9" r="8.5" fill="#171717" />
      <path
        d="M9.4 13.2a13.2 13.2 0 0 1 22.1 2.9"
        stroke="#E8D9A8"
        strokeWidth="1.05"
        strokeLinecap="round"
        opacity=".95"
      />
      <path
        d="M9.5 27.1a13.2 13.2 0 0 0 21.9-3.2"
        stroke="#C9A84C"
        strokeWidth=".75"
        strokeLinecap="round"
        opacity=".6"
      />
    </svg>
  );
}
