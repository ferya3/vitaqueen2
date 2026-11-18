"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MediaPicker } from "@/components/admin/fields/media-picker";
import { RichText } from "@/components/admin/fields/rich-text";
import { TranslatableField, type Translations } from "@/components/admin/fields/translatable";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { adminFetch } from "@/lib/admin/api";
import type { FieldDef } from "@/lib/admin/resources";
import { cn, latinDigits } from "@/lib/utils";

type Errors = Record<string, string[]>;

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-7 w-12 rounded-full transition-colors", checked ? "bg-water-500" : "bg-line")}
    >
      <span className={cn("absolute top-1 size-5 rounded-full bg-white shadow transition-all", checked ? "start-6" : "start-1")} />
    </button>
  );
}

function RemoteSelect({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    if (!field.optionsFrom) return;
    adminFetch<{ data: Record<string, unknown>[] }>(field.optionsFrom.endpoint)
      .then((res) =>
        setOptions(
          res.data.map((row) => {
            const l = row[field.optionsFrom!.labelKey];
            return { value: String(row.id), label: typeof l === "object" && l ? ((l as Translations).fa ?? "") : String(l) };
          }),
        ),
      )
      .catch(() => setOptions([]));
  }, [field.optionsFrom]);

  return (
    <Select value={value == null ? "" : String(value)} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}>
      <option value="">— انتخاب نشده —</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </Select>
  );
}

function toNumber(raw: string) {
  const v = latinDigits(raw).trim();
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : v;
}

/** Renders a single control for a field definition (non-translatable value). */
function Control({ field, value, onChange, dir = "rtl" }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void; dir?: "rtl" | "ltr" }) {
  const str = value == null ? "" : String(value);
  switch (field.type) {
    case "textarea":
      return <Textarea dir={dir} value={str} onChange={(e) => onChange(e.target.value)} rows={3} readOnly={field.readOnly} />;
    case "richtext":
      return <RichText dir={dir} value={str} onChange={onChange} />;
    case "number":
      return <Input inputMode="decimal" dir="ltr" className="text-start" value={str} onChange={(e) => onChange(toNumber(e.target.value))} />;
    case "slug":
      return (
        <Input
          dir="ltr"
          className="text-start font-latin"
          value={str}
          onChange={(e) => onChange(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9؀-ۿ-]/g, ""))}
        />
      );
    case "color":
      return (
        <div className="flex items-center gap-3">
          <input type="color" value={str || "#13a8ce"} onChange={(e) => onChange(e.target.value)} className="h-12 w-16 cursor-pointer rounded-xl border border-line" />
          <Input dir="ltr" className="text-start" value={str} onChange={(e) => onChange(e.target.value)} placeholder="#13A8CE" />
        </div>
      );
    case "date":
      return <Input type="date" dir="ltr" value={str.slice(0, 10)} onChange={(e) => onChange(e.target.value || null)} />;
    case "datetime":
      return <Input type="datetime-local" dir="ltr" value={str ? str.slice(0, 16) : ""} onChange={(e) => onChange(e.target.value || null)} />;
    case "switch":
      return <Switch checked={!!value} onChange={onChange} label={field.label} />;
    case "password":
      return <Input type="password" dir="ltr" autoComplete="new-password" value={str} onChange={(e) => onChange(e.target.value)} />;
    case "select":
      if (field.optionsFrom) return <RemoteSelect field={field} value={value} onChange={onChange} />;
      return (
        <Select value={str} onChange={(e) => onChange(e.target.value || null)}>
          <option value="">— انتخاب کنید —</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      );
    case "media":
      return <MediaPicker type={field.mediaType} value={(value as string) ?? null} onChange={onChange} />;
    case "number-list":
      return (
        <Input
          dir="ltr"
          className="text-start"
          placeholder="330, 500, 1500"
          defaultValue={Array.isArray(value) ? value.join(", ") : ""}
          onBlur={(e) =>
            onChange(
              latinDigits(e.target.value)
                .split(/[,،\s]+/)
                .map(Number)
                .filter((n) => Number.isFinite(n) && n > 0),
            )
          }
        />
      );
    default:
      return <Input dir={dir} value={str} onChange={(e) => onChange(e.target.value)} readOnly={field.readOnly} />;
  }
}

function errorsFor(errors: Errors, path: string) {
  const out: Record<string, string | undefined> = {};
  for (const l of ["fa", "en", "ar"]) out[l] = errors[`${path}.${l}`]?.[0];
  return out;
}

export function FieldRenderer({ field, value, onChange, errors, path = field.name }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void; errors: Errors; path?: string }) {
  const error = errors[path]?.[0];

  let control: React.ReactNode;
  if (field.type === "repeater") {
    const rows = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
    control = (
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-start gap-3 rounded-2xl border border-line bg-cloud/60 p-3">
            <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {field.fields!.map((sub) => (
                <div key={sub.name}>
                  <p className="mb-1 text-xs font-semibold text-muted">{sub.label}</p>
                  <FieldRenderer
                    field={{ ...sub, label: "" }}
                    value={row[sub.name]}
                    errors={errors}
                    path={`${path}.${i}.${sub.name}`}
                    onChange={(v) => onChange(rows.map((r, j) => (j === i ? { ...r, [sub.name]: v } : r)))}
                  />
                </div>
              ))}
            </div>
            <button type="button" aria-label="حذف ردیف" onClick={() => onChange(rows.filter((_, j) => j !== i))} className="mt-6 grid size-9 place-items-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <Button type="button" size="sm" variant="outline" onClick={() => onChange([...rows, {}])}>
          <Plus />
          افزودن ردیف
        </Button>
      </div>
    );
  } else if (field.translatable) {
    control = (
      <TranslatableField
        value={value as Translations}
        onChange={onChange}
        errors={errorsFor(errors, path)}
        render={({ value: v, onChange: set, dir }) => <Control field={field} value={v} onChange={(x) => set(String(x ?? ""))} dir={dir} />}
      />
    );
  } else {
    control = <Control field={field} value={value} onChange={onChange} />;
  }

  if (!field.label) return <>{control}</>;

  return (
    <div className={cn(field.wide && "md:col-span-2", field.type === "switch" && "flex items-center justify-between gap-4 rounded-2xl border border-line px-4 py-3")}>
      <label className={cn("block text-sm font-semibold text-deep-600", field.type !== "switch" && "mb-2")}>
        {field.label}
        {field.required && <span className="text-danger"> *</span>}
      </label>
      {control}
      {field.help && field.type !== "switch" && <p className="mt-1.5 text-xs text-muted">{field.help}</p>}
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
