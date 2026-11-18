"use client";

import { Download, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/admin/auth-context";
import { ConfirmButton, EmptyState, faDate, PageHeader, Pagination, Spinner } from "@/components/admin/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { adminFetch, errorMessage } from "@/lib/admin/api";
import { useAdminQuery } from "@/lib/admin/use-admin-query";
import type { ColumnDef, ResourceDef } from "@/lib/admin/resources";
import { can, type PaginatedResponse, type Row } from "@/lib/admin/types";

function translated(value: unknown) {
  if (value && typeof value === "object") {
    const v = value as Record<string, string | null>;
    return v.fa || v.en || v.ar || "—";
  }
  return value == null || value === "" ? "—" : String(value);
}

function Cell({ column, row }: { column: ColumnDef; row: Row }) {
  const value = row[column.key];
  switch (column.render) {
    case "translated":
      return <span className="font-semibold text-deep-600">{translated(value)}</span>;
    case "bool":
      return value ? <Badge variant="success">بله</Badge> : <Badge variant="muted">خیر</Badge>;
    case "date":
      return <span className="text-muted">{faDate(value)}</span>;
    case "datetime":
      return <span className="text-muted">{faDate(value, true)}</span>;
    case "volume": {
      const ml = Number(value);
      return <span>{ml >= 1000 ? `${(ml / 1000).toLocaleString("fa-IR")} لیتر` : `${ml.toLocaleString("fa-IR")} میلی‌لیتر`}</span>;
    }
    case "badge":
    case "status": {
      const b = column.badges?.[String(value)];
      return b ? <Badge variant={b.tone}>{b.label}</Badge> : <span>{String(value ?? "—")}</span>;
    }
    default:
      return <span className={column.key === "phone" || column.key === "email" ? "ltr-value" : undefined}>{value == null || value === "" ? "—" : String(value)}</span>;
  }
}

export function ResourceList({ resource }: { resource: ResourceDef }) {
  const { user } = useAuth();
  const canWrite = can(user, resource.ability, true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const params = useCallback(() => {
    const q = new URLSearchParams({ page: String(page), per_page: "20" });
    if (query) q.set("search", query);
    Object.entries(filters).forEach(([k, v]) => v && q.set(`filter[${k}]`, v));
    return q;
  }, [page, query, filters]);

  const { data: res, error, loading, reload } = useAdminQuery<PaginatedResponse<Row>>(`${resource.endpoint}?${params()}`);
  const rows: Row[] | null = loading ? null : (res?.data ?? []);
  const meta = res?.meta ?? { current_page: 1, last_page: 1, total: 0 };

  useEffect(() => {
    if (error) toast.error(errorMessage(error));
  }, [error]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(search.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const remove = async (id: number) => {
    try {
      await adminFetch(`${resource.endpoint}/${id}`, { method: "DELETE" });
      toast.success("حذف شد.");
      reload();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  const exportUrl = () => {
    const q = params();
    q.delete("page");
    q.delete("per_page");
    return `/api/admin/${resource.endpoint}/export?${q}`;
  };

  return (
    <>
      <PageHeader
        title={resource.title}
        description={`${meta.total.toLocaleString("fa-IR")} مورد`}
        actions={
          <>
            {resource.exportable && (
              <Button asChild variant="outline" size="sm">
                <a href={exportUrl()}>
                  <Download />
                  خروجی Excel (CSV)
                </a>
              </Button>
            )}
            {resource.canCreate && canWrite && (
              <Button asChild size="sm">
                <Link href={`/admin/${resource.key}/new`}>
                  <Plus />
                  افزودن {resource.singular}
                </Link>
              </Button>
            )}
          </>
        }
      />

      <div className="rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو…" className="h-10 ps-10" />
          </div>
          {resource.filters?.map((f) => (
            <div key={f.key} className="w-44">
              <Select
                value={filters[f.key] ?? ""}
                onChange={(e) => {
                  setPage(1);
                  setFilters((prev) => ({ ...prev, [f.key]: e.target.value }));
                }}
                className="h-10"
                aria-label={f.label}
              >
                <option value="">{f.label}: همه</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
          ))}
        </div>

        {rows === null ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <EmptyState text="موردی یافت نشد." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-start text-xs text-muted">
                  {resource.columns.map((c) => (
                    <th key={c.key} className="px-4 py-3 text-start font-medium whitespace-nowrap">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-line/60 last:border-0 hover:bg-cloud/60">
                    {resource.columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 whitespace-nowrap">
                        <Cell column={c} row={row} />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/${resource.key}/${row.id}`} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-water-50 hover:text-water-700" aria-label="ویرایش">
                          <Pencil className="size-4" />
                        </Link>
                        {canWrite && (
                          <ConfirmButton
                            title={`حذف ${resource.singular}`}
                            description="این عملیات قابل بازگشت نیست. ادامه می‌دهید؟"
                            onConfirm={() => remove(row.id)}
                            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger"
                          >
                            <Trash2 className="size-4" />
                          </ConfirmButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 pb-4">
          <Pagination page={meta.current_page} lastPage={meta.last_page} onChange={setPage} />
        </div>
      </div>
    </>
  );
}
