"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  to: number;
  durationMs?: number;
  format?: (n: number) => string;
  className?: string;
};

// Counts from 0 → `to` once when the element enters the viewport. Honors
// reduced-motion (renders the final value immediately). Numbers are wrapped
// in dir="ltr" so the count reads correctly inside RTL contexts too.
export function CountUp({
  to,
  durationMs = 1400,
  format = (n) => Math.round(n).toLocaleString("en-US"),
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduce) {
      setValue(to);
      return;
    }

    const controls = animate(0, to, {
      duration: durationMs / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, durationMs, reduce]);

  return (
    <span ref={ref} dir="ltr" className={className}>
      {format(value)}
    </span>
  );
}
