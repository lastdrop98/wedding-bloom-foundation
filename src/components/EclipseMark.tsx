import type { SVGProps } from "react";

export function EclipseMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      role="img"
      aria-label="Eclipse solar"
      {...props}
    >
      <defs>
        <radialGradient id="eclipse-sun" cx="30%" cy="30%" r="72%">
          <stop offset="0" stopColor="#FFF4CF" />
          <stop offset=".42" stopColor="#E1C36A" />
          <stop offset="1" stopColor="#A77C24" />
        </radialGradient>
        <linearGradient id="eclipse-corona" x1="8" y1="9" x2="40" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4E3B2" />
          <stop offset=".48" stopColor="#C9A84C" />
          <stop offset="1" stopColor="#8C681F" />
        </linearGradient>
      </defs>

      {/* Fine solar corona */}
      <circle cx="24" cy="24" r="18.1" stroke="url(#eclipse-corona)" strokeWidth=".72" opacity=".52" />
      <circle cx="24" cy="24" r="15.6" stroke="url(#eclipse-corona)" strokeWidth="1.05" opacity=".82" />

      {/* Partially eclipsed sun */}
      <circle cx="20.2" cy="20.3" r="10.8" fill="url(#eclipse-sun)" />
      {/* Moon disc leaves a controlled crescent of sunlight */}
      <circle cx="26.2" cy="22.4" r="11.1" fill="#14120F" />

      {/* Thin corona highlight */}
      <path
        d="M28.2 11.8c4.1 2.1 6.8 6.2 6.8 10.9"
        stroke="#F4E3B2"
        strokeWidth="1.05"
        strokeLinecap="round"
        opacity=".95"
      />
      <path
        d="M31.5 14.9c1.45 1.7 2.35 3.75 2.55 5.95"
        stroke="#C9A84C"
        strokeWidth=".8"
        strokeLinecap="round"
        opacity=".78"
      />
    </svg>
  );
}
