"use client";

import { useState } from "react";
import { ColumnChart } from "@/components/admin/bar-chart";
import { EmptyState, PageHeader, Panel, Spinner } from "@/components/admin/ui";
import { useAdminQuery } from "@/lib/admin/use-admin-query";
import { repStatuses } from "@/lib/admin/resources";
import { cn } from "@/lib/utils";

interface Report {
  days: number;
  series: { date: string; views: number; representatives: number; contacts: number }[];
  top_pages: { path: string; views: number }[];
  leads_by_province: { province: string; total: number }[];
  representatives_by_status: Record<string, number>;
  contacts_by_type: Record<string, number>;
}

// Validated categorical pair (dataviz validator: CVD ΔE 20.4, normal ΔE 26.5).
const SERIES_1 = "#13A8CE";
const SERIES_2 = "#E08A2E";

const shortDate = (iso: string) => new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "short", day: "numeric" }).format(new Date(iso));

export default function ReportsPage() {
  const [days, setDays] = useState(30);
  const [showTable, setShowTable] = useState(false);

  const report = useAdminQuery<{ data: Report }>(`reports?days=${days}`).data?.data ?? null;

  const sum = (k: "views" | "representatives" | "contacts") => report?.series.reduce((s, d) => s + d[k], 0) ?? 0;
  const maxProvince = Math.max(1, ...(report?.leads_by_province.map((p) => p.total) ?? [1]));

  return (
    <>
      <PageHeader
        title="گزارش‌ها"
        description="بازدیدها و درخواست‌های ثبت‌شده (بدون کوکی و بدون ذخیره IP بازدیدکنندگان)"
        actions={
          <div className="flex rounded-full bg-white p-1 ring-1 ring-line">
            {[7, 30, 90].map((d) => (
              <button key={d} onClick={() => setDays(d)} className={cn("rounded-full px-4 py-1.5 text-sm", days === d ? "bg-deep-600 text-white" : "text-muted")}>
                {d.toLocaleString("fa-IR")} روز
              </button>
            ))}
          </div>
        }
      />

      {!report ? (
        <Spinner />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["بازدید صفحات", sum("views")],
              ["درخواست نمایندگی", sum("representatives")],
              ["پیام تماس", sum("contacts")],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-2xl border border-line bg-white p-5">
                <p className="text-sm text-muted">{label}</p>
                <p className="mt-1 text-3xl font-extrabold text-deep-600">{(value as number).toLocaleString("fa-IR")}</p>
              </div>
            ))}
          </div>

          <Panel title="بازدید روزانه">
            <ColumnChart data={report.series} labelKey="date" formatLabel={shortDate} series={[{ key: "views", label: "بازدید", color: SERIES_1 }]} />
          </Panel>

          <Panel
            title="درخواست‌های روزانه"
            actions={
              <button className="text-sm text-water-700" onClick={() => setShowTable((v) => !v)}>
                {showTable ? "نمایش نمودار" : "نمایش جدول"}
              </button>
            }
          >
            {showTable ? (
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white text-xs text-muted">
                    <tr>
                      <th className="py-2 text-start">تاریخ</th>
                      <th className="py-2 text-start">نمایندگی</th>
                      <th className="py-2 text-start">تماس</th>
                      <th className="py-2 text-start">بازدید</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.series.map((d) => (
                      <tr key={d.date} className="border-t border-line/60">
                        <td className="py-1.5">{shortDate(d.date)}</td>
                        <td>{d.representatives.toLocaleString("fa-IR")}</td>
                        <td>{d.contacts.toLocaleString("fa-IR")}</td>
                        <td>{d.views.toLocaleString("fa-IR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ColumnChart
                data={report.series}
                labelKey="date"
                formatLabel={shortDate}
                series={[
                  { key: "representatives", label: "درخواست نمایندگی", color: SERIES_1 },
                  { key: "contacts", label: "پیام تماس", color: SERIES_2 },
                ]}
              />
            )}
          </Panel>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="درخواست نمایندگی به تفکیک استان">
              {report.leads_by_province.length === 0 ? (
                <EmptyState text="هنوز درخواستی ثبت نشده است." />
              ) : (
                <ul className="space-y-3">
                  {report.leads_by_province.map((p) => (
                    <li key={p.province} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 text-sm" title={`${p.province}: ${p.total}`}>
                      <span className="truncate text-ink">{p.province}</span>
                      <span className="h-2.5 rounded-e-[4px]" style={{ width: `${(p.total / maxProvince) * 100}%`, background: SERIES_1 }} />
                      <span className="text-end font-semibold text-deep-600">{p.total.toLocaleString("fa-IR")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel title="پربازدیدترین صفحات">
              {report.top_pages.length === 0 ? (
                <EmptyState text="هنوز بازدیدی ثبت نشده است." />
              ) : (
                <ul className="divide-y divide-line text-sm">
                  {report.top_pages.map((p) => (
                    <li key={p.path} className="flex justify-between gap-3 py-2">
                      <span className="truncate font-latin text-ink" dir="ltr">
                        {decodeURIComponent(p.path)}
                      </span>
                      <span className="font-semibold text-deep-600">{p.views.toLocaleString("fa-IR")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel title="وضعیت درخواست‌های نمایندگی">
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Object.entries(repStatuses).map(([k, v]) => (
                  <li key={k} className="rounded-xl bg-cloud p-3">
                    <p className="text-xs text-muted">{v.label}</p>
                    <p className="text-xl font-bold text-deep-600">{(report.representatives_by_status[k] ?? 0).toLocaleString("fa-IR")}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}
