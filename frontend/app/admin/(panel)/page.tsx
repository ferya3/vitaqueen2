"use client";

import { AlertTriangle, Boxes, Eye, FileBadge, Handshake, Mail, Newspaper } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/admin/auth-context";
import { faDate, faNumber, PageHeader, Panel, Spinner } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { adminFetch } from "@/lib/admin/api";
import { contactStatuses, repStatuses } from "@/lib/admin/resources";

interface Dashboard {
  counts: Record<string, number>;
  warnings: string[];
  latest_representatives: Record<string, string>[];
  latest_contacts: Record<string, string>[];
  recent_activity: { id: number; action: string; description: string; user?: { name: string }; created_at: string }[];
}

const warningText: Record<string, { text: string; href: string }> = {
  stats_placeholder: { text: "آمار صفحه اصلی (ظرفیت تولید روزانه، سال تأسیس) هنوز با اعداد واقعی کارخانه پر نشده و در سایت نمایش داده نمی‌شود.", href: "/admin/settings" },
  certificates_expiring: { text: "اعتبار یک یا چند گواهینامه تا ۶۰ روز آینده به پایان می‌رسد.", href: "/admin/certificates" },
};

const actionLabels: Record<string, string> = { created: "ایجاد", updated: "ویرایش", deleted: "حذف", login: "ورود", logout: "خروج" };

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    adminFetch<{ data: Dashboard }>("dashboard").then((r) => setData(r.data));
  }, []);

  if (!data) return <Spinner />;
  const c = data.counts;
  const cards = [
    { label: "محصولات فعال", value: c.products, icon: Boxes, href: "/admin/products" },
    { label: "مطالب منتشر شده", value: c.articles, icon: Newspaper, href: "/admin/articles" },
    { label: "گواهینامه‌های فعال", value: c.certificates, icon: FileBadge, href: "/admin/certificates" },
    { label: "بازدید ۷ روز اخیر", value: c.views_7d, icon: Eye, href: "/admin/reports" },
    ...(c.representatives_new !== undefined
      ? [
          { label: "درخواست نمایندگی جدید", value: c.representatives_new, icon: Handshake, href: "/admin/representatives", highlight: c.representatives_new > 0 },
          { label: "پیام تماس جدید", value: c.contacts_new, icon: Mail, href: "/admin/contact-requests", highlight: c.contacts_new > 0 },
        ]
      : []),
  ];

  return (
    <>
      <PageHeader title={`سلام، ${user?.name ?? ""}`} description="خلاصه وضعیت وب‌سایت" />

      {data.warnings.length > 0 && (
        <div className="mb-6 space-y-2">
          {data.warnings.map((w) => (
            <Link key={w} href={warningText[w]?.href ?? "#"} className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-[#7a5500] hover:bg-warning/15">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              {warningText[w]?.text ?? w}
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, href, ...rest }) => (
          <Link key={label} href={href} className={`flex items-center gap-4 rounded-2xl border bg-white p-5 transition-shadow hover:shadow-soft ${"highlight" in rest && rest.highlight ? "border-water-300" : "border-line"}`}>
            <span className="grid size-12 place-items-center rounded-xl bg-water-50 text-water-600">
              <Icon className="size-6" />
            </span>
            <span>
              <span className="block text-2xl font-extrabold text-deep-600">{faNumber(value)}</span>
              <span className="text-sm text-muted">{label}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {data.latest_representatives.length > 0 && (
          <Panel title="آخرین درخواست‌های نمایندگی" actions={<Link href="/admin/representatives" className="text-sm text-water-700">همه</Link>}>
            <ul className="divide-y divide-line">
              {data.latest_representatives.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/representatives/${r.id}`} className="flex items-center justify-between gap-3 py-3 text-sm hover:text-water-700">
                    <span>
                      <span className="font-semibold text-deep-600">{r.full_name}</span>
                      <span className="ms-2 text-muted">{r.province} · {r.city}</span>
                    </span>
                    <Badge variant={repStatuses[r.status as keyof typeof repStatuses]?.tone ?? "muted"}>{repStatuses[r.status as keyof typeof repStatuses]?.label ?? r.status}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}
        {data.latest_contacts.length > 0 && (
          <Panel title="آخرین پیام‌ها" actions={<Link href="/admin/contact-requests" className="text-sm text-water-700">همه</Link>}>
            <ul className="divide-y divide-line">
              {data.latest_contacts.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/contact-requests/${r.id}`} className="flex items-center justify-between gap-3 py-3 text-sm hover:text-water-700">
                    <span className="min-w-0">
                      <span className="font-semibold text-deep-600">{r.name}</span>
                      <span className="block truncate text-muted">{r.subject || r.message}</span>
                    </span>
                    <Badge variant={contactStatuses[r.status as keyof typeof contactStatuses]?.tone ?? "muted"}>{contactStatuses[r.status as keyof typeof contactStatuses]?.label ?? r.status}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}
        {data.recent_activity.length > 0 && (
          <Panel title="آخرین رویدادهای مدیریتی" className="xl:col-span-2" actions={<Link href="/admin/activity" className="text-sm text-water-700">همه</Link>}>
            <ul className="divide-y divide-line text-sm">
              {data.recent_activity.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span>
                    <span className="font-semibold text-deep-600">{a.user?.name ?? "سیستم"}</span>
                    <span className="mx-2 text-muted">{actionLabels[a.action] ?? a.action}</span>
                    <span className="font-latin text-muted">{a.description}</span>
                  </span>
                  <span className="text-xs text-muted">{faDate(a.created_at, true)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </>
  );
}
