import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "start" | "center";
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({ eyebrow, title, text, align = "start", tone = "light", className, as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <span className={cn("eyebrow", tone === "dark" && "border-white/15 bg-white/10 text-ice")}>
          <span className="size-1.5 rounded-full bg-current" aria-hidden />
          {eyebrow}
        </span>
      )}
      <Tag className={cn("mt-4 text-3xl md:text-[2.75rem] md:leading-[1.25]", tone === "dark" && "text-white")}>{title}</Tag>
      {text && <p className={cn("mt-4 text-base leading-8 md:text-lg", tone === "dark" ? "text-white/70" : "text-muted")}>{text}</p>}
    </Reveal>
  );
}
