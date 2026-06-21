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

  // Safety net for phones: if the in-view trigger is missed, snap to the final
  // value after a short delay so a stat never stays stuck at 0.
  const [forceShow, setForceShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setForceShow(true), 1600);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!inView && !forceShow) return;

    if (reduce || (forceShow && !inView)) {
      setValue(to);
      return;
    }

    const controls = animate(0, to, {
      duration: durationMs / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, forceShow, to, durationMs, reduce]);

  return (
    <span ref={ref} dir="ltr" className={className}>
      {format(value)}
    </span>
  );
}
