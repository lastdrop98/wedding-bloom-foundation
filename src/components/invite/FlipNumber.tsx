import { useEffect, useRef, useState } from "react";

/** Dígitos que deslizam/rodam quando o valor muda. */
export function FlipNumber({ value, className }: { value: string; className?: string }) {
  return (
    <span className={className}>
      {value.split("").map((char, i) => (
        <FlipDigit key={i} char={char} />
      ))}
    </span>
  );
}

function FlipDigit({ char }: { char: string }) {
  const [current, setCurrent] = useState(char);
  const [previous, setPrevious] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrent((prev) => {
      if (prev === char) return prev;
      setPrevious(prev);
      return char;
    });
  }, [char]);

  useEffect(() => {
    if (previous === null) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPrevious(null), 420);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [previous, current]);

  return (
    <span className="relative inline-block overflow-hidden align-baseline tabular-nums">
      <span className="invisible">0</span>
      {previous !== null && (
        <span key={`out-${previous}`} className="digit-out absolute inset-0">
          {previous}
        </span>
      )}
      <span
        key={`in-${current}`}
        className={previous !== null ? "digit-in absolute inset-0" : "absolute inset-0"}
      >
        {current}
      </span>
    </span>
  );
}
