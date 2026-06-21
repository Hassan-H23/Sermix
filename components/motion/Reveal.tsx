"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "animate" | "transition">;

export function Reveal({ children, delay = 0, className, ...rest }: RevealProps) {
  const reduce = useReducedMotion();

  // Safety net. Content starts at opacity:0 and is normally revealed by the
  // in-view trigger. On phones a dropped IntersectionObserver callback (fast
  // momentum scrolling, slow hydration) could otherwise strand a whole section
  // blank — which reads as a "broken" page. Once mounted we force the shown
  // state after a short delay: in-view sections have already animated by then,
  // so this only rescues ones the observer missed.
  const [forceShow, setForceShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setForceShow(true), 1600);
    return () => clearTimeout(id);
  }, []);

  const shown = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      // Scroll-triggered, not on-mount: the entrance plays when the element
      // scrolls into view (15% per CLAUDE.md) and never replays (`once`).
      // Animating on mount would burn every section's reveal at page load —
      // a problem on mobile where almost everything starts below the fold.
      animate={forceShow ? shown : undefined}
      whileInView={shown}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduce ? 0.2 : 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
