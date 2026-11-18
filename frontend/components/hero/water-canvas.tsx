"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight 2D canvas: drifting light caustics + rising bubbles.
 * ~0 dependencies, pauses when off-screen or the tab is hidden, and renders a
 * single static frame when the user prefers reduced motion.
 */
export function WaterCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    type Bubble = { x: number; y: number; r: number; speed: number; drift: number; phase: number; alpha: number };
    const bubbles: Bubble[] = [];
    const count = mobile ? 18 : 42;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (initial = false): Bubble => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + 20,
      r: 1 + Math.random() * (mobile ? 3 : 4.5),
      speed: 0.25 + Math.random() * 0.8,
      drift: 0.3 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.15 + Math.random() * 0.45,
    });

    resize();
    for (let i = 0; i < count; i++) bubbles.push(spawn(true));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      // caustic light bands
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 4; i++) {
        const x = width * (0.15 + i * 0.25) + Math.sin(t / 3200 + i * 1.7) * 80;
        const grad = ctx.createRadialGradient(x, height * 0.15, 0, x, height * 0.15, height * 0.9);
        grad.addColorStop(0, "rgba(141,217,233,0.10)");
        grad.addColorStop(1, "rgba(141,217,233,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x - 30, 0);
        ctx.lineTo(x + 30, 0);
        ctx.lineTo(x + 180 + Math.sin(t / 2000 + i) * 40, height);
        ctx.lineTo(x - 120 + Math.cos(t / 2400 + i) * 40, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // bubbles
      for (const b of bubbles) {
        if (!reduce) {
          b.y -= b.speed;
          b.x += Math.sin(t / 900 + b.phase) * b.drift * 0.3;
          if (b.y < -20) Object.assign(b, spawn());
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${b.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${b.alpha * 0.9})`;
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === "visible";
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    draw(0);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
