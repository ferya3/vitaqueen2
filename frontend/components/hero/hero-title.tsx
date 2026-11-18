import { Fragment } from "react";

/**
 * Word-by-word entrance for the hero headline. Pure CSS (no JS needed), so the
 * headline paints immediately after HTML arrives — good for LCP.
 */
export function HeroTitle({ text, className }: { text: string; className?: string }) {
  const words = text.split(/\s+/);
  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            className={`inline-block motion-safe:animate-[word-in_0.9s_var(--ease-water)_both] ${i >= words.length - 2 ? "text-gradient" : ""}`}
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
}
