import type { SVGProps } from "react";

export function EclipseMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" role="img" aria-label="Solar Eclipse" {...props}>
      <defs>
        <linearGradient id="solar-eclipse-gold" x1="10" y1="8" x2="39" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4E3B2" />
          <stop offset=".42" stopColor="#C9A84C" />
          <stop offset="1" stopColor="#8D6B20" />
        </linearGradient>
      </defs>
      <g stroke="url(#solar-eclipse-gold)" strokeLinecap="round">
        <path d="M24 2.8v4.2" strokeWidth="1.25" opacity=".55" />
        <path d="M24 41v4.2" strokeWidth="1.25" opacity=".55" />
        <path d="m8.8 8.8 3 3" strokeWidth="1.1" opacity=".38" />
        <path d="m36.2 36.2 3 3" strokeWidth="1.1" opacity=".38" />
        <path d="M3 24h4.2" strokeWidth="1.1" opacity=".32" />
        <path d="M40.8 24H45" strokeWidth="1.1" opacity=".5" />
        <path d="m39.2 8.8-3 3" strokeWidth="1.1" opacity=".75" />
        <path d="m8.8 39.2 3-3" strokeWidth="1.1" opacity=".2" />
      </g>
      <circle cx="24" cy="24" r="15.2" stroke="url(#solar-eclipse-gold)" strokeWidth="1.15" opacity=".48" />
      <circle cx="24" cy="24" r="11.4" fill="url(#solar-eclipse-gold)" />
      <circle cx="28.8" cy="19.2" r="10.9" fill="#11100E" />
      <path d="M31.5 9.9c4.1 2.1 6.9 6.3 6.9 11.2" stroke="#F4E3B2" strokeWidth="1.25" strokeLinecap="round" opacity=".9" />
      <path d="M35.4 16.4c.8 1.5 1.2 3.1 1.2 4.8" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}
