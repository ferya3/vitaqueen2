"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface CountUpProps {
  value: number;
  intl: string;
  duration?: number;
  useGrouping?: boolean;
}

/** Animated counter. Renders the final value on the server so it is SEO / no-JS friendly. */
export function CountUp({ value, intl, duration = 2, useGrouping = true }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduce) return;
    const format = new Intl.NumberFormat(intl, { useGrouping, maximumFractionDigits: 0 });
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = format.format(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, intl, duration, useGrouping]);

  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat(intl, { useGrouping, maximumFractionDigits: 0 }).format(value)}
    </span>
  );
}
