import {
  Droplets,
  Factory,
  Filter,
  FlaskConical,
  GlassWater,
  Package,
  ShieldCheck,
  Sun,
  Tag,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  droplet: Droplets,
  filter: Filter,
  sun: Sun,
  flask: FlaskConical,
  bottle: GlassWater,
  tag: Tag,
  package: Package,
  "shield-check": ShieldCheck,
};

export function StepIcon({ name, className }: { name: string | null; className?: string }) {
  const Icon = (name && map[name]) || Factory;
  return <Icon className={className} aria-hidden />;
}
