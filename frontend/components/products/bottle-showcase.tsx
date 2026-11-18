"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { BottleIllustration } from "@/components/products/bottle-illustration";
import { cn } from "@/lib/utils";

const Bottle3D = dynamic(() => import("@/components/products/bottle-3d"), { ssr: false });

interface BottleShowcaseProps {
  volume: number;
  accent?: string | null;
  brand: string;
  label?: string;
  interactive?: boolean;
  className?: string;
  hint?: string;
}

function canUse3D() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!window.matchMedia("(min-width: 768px)").matches) return false; // lighter experience on phones
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * 3D product showcase. Three.js is only downloaded when the component is visible
 * on a capable device; otherwise (and while loading) the SVG bottle is shown.
 */
export function BottleShowcase({ volume, accent, brand, label, interactive = false, className, hint }: BottleShowcaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !canUse3D()) return;
    setEnabled(true);
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setMounted(true); // keep the canvas once loaded; just pause it off-screen
      },
      { rootMargin: "200px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {enabled && mounted ? (
        <Bottle3D volume={volume} accent={accent} brand={brand} interactive={interactive} active={visible} />
      ) : (
        <div className="flex h-full items-center justify-center motion-safe:animate-float">
          <BottleIllustration volume={volume} accent={accent} label={label} className="h-[85%]" />
        </div>
      )}
      {interactive && enabled && hint && (
        <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}
