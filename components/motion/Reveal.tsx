"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "animate" | "transition">;

export function Reveal({ children, delay = 0, className, ...rest }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      // Scroll-triggered, not on-mount: the entrance plays when the element
      // scrolls into view (15% per CLAUDE.md) and never replays (`once`).
      // Animating on mount would burn every section's reveal at page load —
      // a problem on mobile where almost everything starts below the fold.
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
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
