import { BriefcaseBusiness, Camera, CirclePlay, MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types/api";

const icons = {
  instagram: Camera,
  linkedin: BriefcaseBusiness,
  telegram: Send,
  whatsapp: MessageCircle,
  aparat: CirclePlay,
} as const;

export function SocialLinks({ social, className }: { social: SiteSettings["social"]; className?: string }) {
  const entries = Object.entries(social ?? {}).filter(([, url]) => !!url) as [keyof typeof icons, string][];
  if (!entries.length) return null;
  return (
    <ul className={cn("flex gap-2", className)}>
      {entries.map(([key, url]) => {
        const Icon = icons[key] ?? Send;
        return (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={key}
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-ice hover:text-ice"
            >
              <Icon className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
