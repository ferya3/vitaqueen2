import { Droplets, FlaskConical, Factory, Truck } from "lucide-react";
import { CountUp } from "@/components/animations/count-up";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { localeMeta, type Locale } from "@/lib/i18n/config";
import type { Stat } from "@/types/api";

const pillarIcons = [Droplets, FlaskConical, Factory, Truck];

/**
 * Brand & competitive advantage. Stats only render when the factory has entered
 * real values in the admin panel (placeholders are filtered out by the API).
 */
export function BrandSection({ locale, dict, stats }: { locale: Locale; dict: Dictionary; stats: Stat[] }) {
  return (
    <section id="brand" className="section-y relative">
      <div className="container-x">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <SectionHeading eyebrow={dict.brand.eyebrow} title={dict.brand.title} />
          <Reveal delay={0.1}>
            <p className="text-base leading-8 text-muted md:text-lg">{dict.brand.text}</p>
          </Reveal>
        </div>

        {stats.length > 0 && (
          <Stagger
            className={`mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line ${stats.length === 1 ? "grid-cols-1" : stats.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"} ${stats.length >= 4 ? "lg:grid-cols-4" : ""}`}
          >
            {stats.map((stat) => (
              <StaggerItem key={stat.key} className="bg-white p-6 md:p-8">
                <p className="text-3xl font-extrabold text-deep-600 md:text-5xl">
                  <CountUp value={stat.value} intl={localeMeta[locale].intl} useGrouping={stat.key !== "founded_year"} />
                  {stat.suffix && <span className="ms-2 text-base font-semibold text-water-600 md:text-lg">{stat.suffix}</span>}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dict.brand.pillars.map((pillar, i) => {
            const Icon = pillarIcons[i % pillarIcons.length];
            return (
              <StaggerItem key={pillar.title}>
                <div className="group h-full rounded-[var(--radius-card)] bg-cloud p-6 transition-colors duration-500 hover:bg-deep-600">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white text-water-600 shadow-soft transition-colors duration-500 group-hover:bg-water-500 group-hover:text-white">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 text-base transition-colors duration-500 group-hover:text-white">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted transition-colors duration-500 group-hover:text-white/70">{pillar.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
