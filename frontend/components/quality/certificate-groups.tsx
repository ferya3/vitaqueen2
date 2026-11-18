import { Stagger, StaggerItem } from "@/components/animations/reveal";
import { CertificateCard } from "@/components/quality/certificate-card";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { Certificate } from "@/types/api";

export function CertificateGroups({ certificates, locale, dict }: { certificates: Certificate[]; locale: Locale; dict: Dictionary }) {
  const groups = [
    { id: "certificates", type: "certificate", title: dict.quality.certificates },
    { id: "lab-reports", type: "lab_report", title: dict.quality.labReports },
    { id: "standards", type: "standard", title: dict.quality.standards },
  ] as const;

  return (
    <div className="space-y-16">
      {groups.map((group) => {
        const items = certificates.filter((c) => c.type === group.type);
        if (!items.length) return null;
        return (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`}>
            <h2 id={`${group.id}-title`} className="text-2xl md:text-3xl">
              {group.title}
            </h2>
            <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <StaggerItem key={c.id}>
                  <CertificateCard certificate={c} locale={locale} dict={dict} />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        );
      })}
    </div>
  );
}
