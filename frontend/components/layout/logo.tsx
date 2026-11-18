import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={cn("size-9", className)}>
      <defs>
        <linearGradient id="logo-g" x1="12" y1="6" x2="52" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8DD9E9" />
          <stop offset=".5" stopColor="#13A8CE" />
          <stop offset="1" stopColor="#073B59" />
        </linearGradient>
      </defs>
      <path d="M32 4C32 4 10 28.4 10 41.5 10 53.4 19.8 62 32 62s22-8.6 22-20.5C54 28.4 32 4 32 4Z" fill="url(#logo-g)" />
      <path d="M21 43.5c3.5 5.6 11.8 7.6 18.2 3.2" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" opacity=".9" />
      <path d="M24 30c2.2-4 5-7.6 8-11" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

export function Logo({ name, tagline, tone = "dark", className }: { name: string; tagline?: string; tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-tight">
        <span className={cn("text-lg font-extrabold tracking-tight", tone === "light" ? "text-white" : "text-deep-600")}>{name}</span>
        {tagline && <span className={cn("text-[0.68rem] font-medium", tone === "light" ? "text-white/60" : "text-muted")}>{tagline}</span>}
      </span>
    </span>
  );
}
