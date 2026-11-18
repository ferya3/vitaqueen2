"use client";

import { useState } from "react";
import { EmptyState, faDate, PageHeader, Pagination, Panel, Spinner } from "@/components/admin/ui";
import { useAdminQuery } from "@/lib/admin/use-admin-query";
import type { PaginatedResponse } from "@/lib/admin/types";

interface Log {
  id: number;
  action: string;
  subject_type: string | null;
  description: string | null;
  properties: { changed?: string[] } | null;
  user?: { name: string } | null;
  ip: string | null;
  created_at: string;
}

const actions: Record<string, string> = { created: "ایجاد", updated: "ویرایش", deleted: "حذف", login: "ورود", logout: "خروج" };

export default function ActivityPage() {
  const [page, setPage] = useState(1);
  const { data: res } = useAdminQuery<PaginatedResponse<Log>>(`activity-logs?page=${page}`);

  return (
    <>
      <PageHeader title="رویدادهای مدیریتی" description="ثبت تمام تغییرات انجام‌شده توسط مدیران (Audit log)" />
      <Panel>
        {!res ? (
          <Spinner />
        ) : res.data.length === 0 ? (
          <EmptyState text="رویدادی ثبت نشده است." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th className="px-3 py-2 text-start">زمان</th>
                  <th className="px-3 py-2 text-start">کاربر</th>
                  <th className="px-3 py-2 text-start">عملیات</th>
                  <th className="px-3 py-2 text-start">مورد</th>
                  <th className="px-3 py-2 text-start">فیلدهای تغییر یافته</th>
                  <th className="px-3 py-2 text-start">IP</th>
                </tr>
              </thead>
              <tbody>
                {res.data.map((l) => (
                  <tr key={l.id} className="border-b border-line/60">
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted">{faDate(l.created_at, true)}</td>
                    <td className="px-3 py-2.5 font-semibold text-deep-600">{l.user?.name ?? "—"}</td>
                    <td className="px-3 py-2.5">{actions[l.action] ?? l.action}</td>
                    <td className="px-3 py-2.5 font-latin">{l.description ?? "—"}</td>
                    <td className="px-3 py-2.5 font-latin text-xs text-muted">{l.properties?.changed?.join(", ") ?? ""}</td>
                    <td className="px-3 py-2.5 font-latin text-xs text-muted">{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {res && <Pagination page={res.meta.current_page} lastPage={res.meta.last_page} onChange={setPage} />}
      </Panel>
    </>
  );
}
