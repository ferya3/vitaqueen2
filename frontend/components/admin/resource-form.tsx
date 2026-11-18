"use client";

import { ArrowRight, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/admin/auth-context";
import { FieldRenderer } from "@/components/admin/fields/field";
import { LeadDetails } from "@/components/admin/lead-details";
import { ProductImages } from "@/components/admin/product-images";
import { PageHeader, Panel, Spinner } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { adminFetch, ApiError, errorMessage } from "@/lib/admin/api";
import type { ResourceDef } from "@/lib/admin/resources";
import { can } from "@/lib/admin/types";

type Values = Record<string, unknown>;

export function ResourceForm({ resource, id }: { resource: ResourceDef; id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const isNew = id === "new";
  const canWrite = can(user, resource.ability, true);
  const [record, setRecord] = useState<Values | null>(isNew ? { ...(resource.defaults ?? {}) } : null);
  const [values, setValues] = useState<Values>(isNew ? { ...(resource.defaults ?? {}) } : {});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    adminFetch<{ data: Values }>(`${resource.endpoint}/${id}`)
      .then((res) => {
        setRecord(res.data);
        setValues(Object.fromEntries(resource.fields.map((f) => [f.name, res.data[f.name] ?? (f.type === "repeater" ? [] : null)])));
      })
      .catch((e) => {
        toast.error(errorMessage(e));
        router.push(`/admin/${resource.key}`);
      });
  }, [id, isNew, resource, router]);

  const sections = useMemo(() => {
    const map = new Map<string, typeof resource.fields>();
    for (const f of resource.fields) {
      const key = f.section ?? "اطلاعات";
      map.set(key, [...(map.get(key) ?? []), f]);
    }
    return [...map.entries()];
  }, [resource]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = Object.fromEntries(Object.entries(values).filter(([k, v]) => !(k === "password" && !v)));
      const res = await adminFetch<{ data: Values }>(isNew ? resource.endpoint : `${resource.endpoint}/${id}`, {
        method: isNew ? "POST" : resource.readOnlyDetails ? "PATCH" : "PUT",
        json: payload,
      });
      toast.success("ذخیره شد.");
      if (isNew) router.replace(`/admin/${resource.key}/${res.data.id}`);
      else setRecord(res.data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setErrors(err.errors);
        toast.error("لطفاً خطاهای فرم را بررسی کنید.");
      } else toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!record) return <Spinner />;

  const titleValue = (record.name ?? record.title ?? record.full_name) as unknown;
  const title = isNew
    ? `افزودن ${resource.singular}`
    : typeof titleValue === "object" && titleValue
      ? ((titleValue as Record<string, string>).fa ?? resource.singular)
      : String(titleValue ?? resource.singular);

  return (
    <form onSubmit={submit} noValidate>
      <PageHeader
        title={title}
        description={resource.title}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/${resource.key}`}>
                <ArrowRight />
                بازگشت
              </Link>
            </Button>
            {canWrite && (
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : <Save />}
                ذخیره
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {resource.readOnlyDetails && <LeadDetails record={record} resourceKey={resource.key} />}
          {sections.map(([name, fields]) => (
            <Panel key={name} title={resource.readOnlyDetails ? "پیگیری" : name}>
              <fieldset disabled={!canWrite} className="grid gap-5 md:grid-cols-2">
                {fields.map((field) => (
                  <FieldRenderer key={field.name} field={field} value={values[field.name]} errors={errors} onChange={(v) => setValues((prev) => ({ ...prev, [field.name]: v }))} />
                ))}
              </fieldset>
            </Panel>
          ))}
        </div>
        <div className="space-y-6">
          {resource.key === "products" && !isNew && <ProductImages productId={Number(id)} canWrite={canWrite} />}
          {!isNew && (
            <Panel title="اطلاعات رکورد">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">شناسه</dt>
                  <dd className="font-latin">#{String(record.id)}</dd>
                </div>
                {typeof record.updated_at === "string" && (
                  <div className="flex justify-between">
                    <dt className="text-muted">آخرین ویرایش</dt>
                    <dd>{new Intl.DateTimeFormat("fa-IR-u-ca-persian", { dateStyle: "medium", timeStyle: "short" }).format(new Date(record.updated_at))}</dd>
                  </div>
                )}
                {typeof record.slug === "string" && ["products", "articles"].includes(resource.key) && (
                  <a className="block pt-2 text-water-700 underline" target="_blank" href={`/fa/${resource.key === "products" ? "products" : "news"}/${record.slug}`}>
                    مشاهده در سایت ↗
                  </a>
                )}
              </dl>
            </Panel>
          )}
        </div>
      </div>
    </form>
  );
}
