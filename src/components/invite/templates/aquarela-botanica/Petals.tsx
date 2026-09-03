/** Pétalas a cair suavemente — poucas, baixa opacidade, apenas CSS. */

const PETALS = [
  { left: "8%", delay: "0s", duration: "17s", size: 16, tint: "bg-rose/30" },
  { left: "24%", delay: "3.5s", duration: "21s", size: 11, tint: "bg-rose/25" },
  { left: "43%", delay: "7s", duration: "19s", size: 14, tint: "bg-sage/25" },
  { left: "61%", delay: "1.8s", duration: "23s", size: 12, tint: "bg-rose/25" },
  { left: "78%", delay: "9.5s", duration: "18s", size: 15, tint: "bg-gold-light/30" },
  { left: "91%", delay: "5s", duration: "22s", size: 10, tint: "bg-sage/25" },
];

export function Petals({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {PETALS.map((p) => (
        <span
          key={p.left}
          className={`petal-fall absolute -top-10 block ${p.tint}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 0.7,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
