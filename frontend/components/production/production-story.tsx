"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { StepIcon } from "@/components/ui/step-icon";
import { cn } from "@/lib/utils";
import type { ProductionStep } from "@/types/api";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProductionStoryProps {
  steps: ProductionStep[];
  dir: "rtl" | "ltr";
  stepLabel: string;
  intl: string;
  header: React.ReactNode;
}

/**
 * Scroll storytelling of the production process.
 * - Desktop: the section pins and the steps scroll horizontally while a drop
 *   travels along the "pipeline". Each step lights up as it reaches the centre.
 * - Mobile / reduced motion: a vertical timeline (no pinning).
 */
export function ProductionStory({ steps, dir, stepLabel, intl, header }: ProductionStoryProps) {
  const fmt = new Intl.NumberFormat(intl, { minimumIntegerDigits: 2 });
  const formatIndex = (n: number) => fmt.format(n);
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - el.clientWidth);
        const sign = dir === "rtl" ? 1 : -1;

        const tween = gsap.to(el, {
          x: () => sign * distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 0.8,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.3}`,
            invalidateOnRefresh: true,
          },
        });

        gsap.to("[data-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance() + window.innerHeight * 0.3}`, scrub: 0.8 },
        });

        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((card) => {
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: tween,
            start: dir === "rtl" ? "right 75%" : "left 75%",
            end: dir === "rtl" ? "left 25%" : "right 25%",
            toggleClass: { targets: card, className: "is-active" },
          });
        });
      });

      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          });
          card.classList.add("is-active");
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [dir, steps.length] },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-deep-800 text-white lg:flex lg:h-screen lg:flex-col lg:justify-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_30%,rgb(19_168_206/0.25),transparent_70%),radial-gradient(40%_50%_at_90%_80%,rgb(141_217_233/0.15),transparent_70%)]" />
      <div className="container-x relative pt-20 lg:pt-10">{header}</div>

      {/* pipeline progress */}
      <div className="container-x relative mt-10 hidden lg:block">
        <div className="relative h-1 rounded-full bg-white/10">
          <div data-progress className="absolute inset-0 origin-[var(--origin)] scale-x-0 rounded-full bg-gradient-to-l from-ice to-water-500" style={{ ["--origin" as string]: dir === "rtl" ? "right" : "left" }} />
        </div>
      </div>

      <ol
        ref={track}
        className="container-x relative mt-10 flex flex-col gap-5 pb-20 lg:flex-row lg:gap-6 lg:pb-10"
      >
        {steps.map((step, i) => (
          <li
            key={step.id}
            data-step
            className={cn(
              "group/step relative shrink-0 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all duration-700 lg:w-[400px]",
              "[&.is-active]:border-water-400/60 [&.is-active]:bg-white/[0.09] [&.is-active]:shadow-glow",
            )}
          >
            {/* vertical timeline connector (mobile) */}
            {i < steps.length - 1 && <span aria-hidden className="absolute start-[2.85rem] top-full h-5 w-px bg-white/15 lg:hidden" />}
            <div className="flex items-center justify-between">
              <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-ice transition-colors duration-700 group-[.is-active]/step:bg-water-500 group-[.is-active]/step:text-white">
                <StepIcon name={step.icon} className="size-7" />
              </span>
              <span className="text-5xl font-extrabold text-white/10 transition-colors duration-700 group-[.is-active]/step:text-water-400/40">
                {formatIndex(i + 1)}
              </span>
            </div>
            <p className="mt-6 text-xs font-semibold text-ice/80">
              {stepLabel} {formatIndex(i + 1)}
            </p>
            <h3 className="mt-1 text-xl text-white">{step.title}</h3>
            {step.description && <p className="mt-3 text-sm leading-7 text-white/65">{step.description}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
