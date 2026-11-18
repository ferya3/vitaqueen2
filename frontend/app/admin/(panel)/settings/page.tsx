"use client";

import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/admin/auth-context";
import { MediaPicker } from "@/components/admin/fields/media-picker";
import { TranslatableField, type Translations } from "@/components/admin/fields/translatable";
import { PageHeader, Panel, Spinner } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { adminFetch, errorMessage } from "@/lib/admin/api";
import { can } from "@/lib/admin/types";
import { latinDigits } from "@/lib/utils";

interface Setting {
  key: string;
  group: string;
  value: unknown;
  is_public: boolean;
}

interface Stat {
  key: string;
  value: number;
  suffix: Translations | null;
  label: Translations;
  is_placeholder?: boolean;
  auto?: boolean;
}

const groupLabels: Record<string, string> = {
  brand: "هویت برند",
  home: "صفحه اصلی",
  contact: "اطلاعات تماس",
  social: "شبکه‌های اجتماعی",
  seo: "سئو",
  leads: "فرم‌ها و اعلان‌ها",
};

const keyLabels: Record<string, string> = {
  "site.name": "نام برند",
  "site.legal_name": "نام حقوقی شرکت",
  "site.tagline": "شعار",
  "site.description": "توضیح کوتاه شرکت",
  "hero.title": "تیتر اصلی Hero",
  "hero.subtitle": "زیرتیتر Hero",
  "hero.video_url": "ویدیوی پس‌زمینه Hero (MP4 / WebM)",
  "hero.poster_url": "تصویر جایگزین ویدیو (Poster)",
  stats: "شاخص‌های کلیدی (شمارنده‌ها)",
  "contact.phone": "تلفن",
  "contact.sales_phone": "تلفن واحد فروش",
  "contact.email": "ایمیل",
  "contact.sales_email": "ایمیل فروش",
  "contact.address": "نشانی کارخانه",
  "contact.working_hours": "ساعات کاری",
  "contact.map": "موقعیت روی نقشه",
  social: "شبکه‌های اجتماعی",
  "seo.title_suffix": "پسوند عنوان صفحات",
  "seo.keywords": "کلمات کلیدی",
  "leads.notify_email": "ایمیل دریافت اعلان درخواست‌ها",
};

const isTranslation = (v: unknown): v is Translations =>
  !!v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length > 0 && Object.keys(v).every((k) => ["fa", "en", "ar"].includes(k));

function StatsEditor({ value, onChange }: { value: Stat[]; onChange: (v: Stat[]) => void }) {
  const update = (i: number, patch: Partial<Stat>) => onChange(value.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  return (
    <div className="space-y-3">
      <p className="rounded-xl bg-water-50 p-3 text-xs leading-6 text-water-800">
        فقط اعداد واقعی کارخانه را وارد کنید. شاخص‌هایی که «نمونه / تأییدنشده» علامت خورده‌اند یا مقدار صفر دارند در سایت نمایش داده نمی‌شوند. شاخص‌های «خودکار» (تعداد محصولات و خطوط تولید) از پایگاه داده شمارش می‌شوند.
      </p>
      {value.map((stat, i) => (
        <div key={i} className="grid gap-3 rounded-2xl border border-line p-4 md:grid-cols-12">
          <div className="md:col-span-2">
            <p className="mb-1 text-xs font-semibold text-muted">کلید</p>
            <Input dir="ltr" value={stat.key} onChange={(e) => update(i, { key: e.target.value.replace(/[^a-z0-9_]/g, "") })} />
          </div>
          <div className="md:col-span-2">
            <p className="mb-1 text-xs font-semibold text-muted">مقدار</p>
            <Input dir="ltr" inputMode="numeric" disabled={stat.auto} value={stat.auto ? "خودکار" : String(stat.value ?? "")} onChange={(e) => update(i, { value: Number(latinDigits(e.target.value).replace(/[^\d.]/g, "")) || 0 })} />
          </div>
          <div className="md:col-span-4">
            <p className="mb-1 text-xs font-semibold text-muted">عنوان</p>
            <TranslatableField value={stat.label} onChange={(v) => update(i, { label: v })} render={({ value: v, onChange: set, dir }) => <Input dir={dir} value={v} onChange={(e) => set(e.target.value)} />} />
          </div>
          <div className="md:col-span-3">
            <p className="mb-1 text-xs font-semibold text-muted">پسوند (اختیاری)</p>
            <TranslatableField value={stat.suffix ?? {}} onChange={(v) => update(i, { suffix: v })} render={({ value: v, onChange: set, dir }) => <Input dir={dir} value={v} onChange={(e) => set(e.target.value)} />} />
          </div>
          <div className="flex items-end justify-between gap-2 md:col-span-1 md:flex-col md:items-end">
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger" aria-label="حذف">
              <Trash2 className="size-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm md:col-span-12">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="size-4 accent-water-500" checked={!!stat.is_placeholder} onChange={(e) => update(i, { is_placeholder: e.target.checked })} />
              نمونه / تأییدنشده (در سایت نمایش داده نشود)
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="size-4 accent-water-500" checked={!!stat.auto} onChange={(e) => update(i, { auto: e.target.checked })} />
              شمارش خودکار (فقط products / production_lines)
            </label>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, { key: "", value: 0, suffix: null, label: {}, is_placeholder: false }])}>
        <Plus />
        افزودن شاخص
      </Button>
    </div>
  );
}

function SettingEditor({ setting, value, onChange }: { setting: Setting; value: unknown; onChange: (v: unknown) => void }) {
  if (setting.key === "stats") return <StatsEditor value={(value as Stat[]) ?? []} onChange={onChange} />;

  if (setting.key === "contact.map") {
    const map = (value as { lat: number; lng: number; zoom: number }) ?? { lat: 0, lng: 0, zoom: 13 };
    return (
      <div className="grid grid-cols-3 gap-3">
        {(["lat", "lng", "zoom"] as const).map((k) => (
          <div key={k}>
            <p className="mb-1 text-xs text-muted">{{ lat: "عرض جغرافیایی", lng: "طول جغرافیایی", zoom: "بزرگنمایی" }[k]}</p>
            <Input dir="ltr" inputMode="decimal" value={String(map[k] ?? "")} onChange={(e) => onChange({ ...map, [k]: Number(latinDigits(e.target.value)) || 0 })} />
          </div>
        ))}
      </div>
    );
  }

  if (setting.key === "hero.video_url" || setting.key === "hero.poster_url") {
    return <MediaPicker value={(value as string) ?? null} type={setting.key === "hero.poster_url" ? "image" : undefined} onChange={(p) => onChange(p ? (p.startsWith("http") || p.startsWith("/") ? p : `${process.env.NEXT_PUBLIC_MEDIA_URL ?? ""}/storage/${p}`) : null)} />;
  }

  if (isTranslation(value)) {
    const long = /description|subtitle|address|keywords/.test(setting.key);
    return (
      <TranslatableField
        value={value}
        onChange={onChange}
        render={({ value: v, onChange: set, dir }) => (long ? <Textarea dir={dir} rows={2} value={v} onChange={(e) => set(e.target.value)} /> : <Input dir={dir} value={v} onChange={(e) => set(e.target.value)} />)}
      />
    );
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, string | null>;
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.keys(obj).map((k) => (
          <div key={k}>
            <p className="mb-1 font-latin text-xs text-muted">{k}</p>
            <Input dir="ltr" placeholder="https://…" value={obj[k] ?? ""} onChange={(e) => onChange({ ...obj, [k]: e.target.value || null })} />
          </div>
        ))}
      </div>
    );
  }

  return <Input dir={/phone|email|url/.test(setting.key) ? "ltr" : "rtl"} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value || null)} />;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Setting[] | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const canWrite = can(user, "settings", true);

  useEffect(() => {
    adminFetch<{ data: Setting[] }>("settings").then((r) => {
      setSettings(r.data);
      setValues(Object.fromEntries(r.data.map((s) => [s.key, s.value])));
    });
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, Setting[]>();
    settings?.forEach((s) => map.set(s.group, [...(map.get(s.group) ?? []), s]));
    return [...map.entries()].sort(([a], [b]) => Object.keys(groupLabels).indexOf(a) - Object.keys(groupLabels).indexOf(b));
  }, [settings]);

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch("settings", { method: "PUT", json: { settings: [...dirty].map((key) => ({ key, value: values[key] })) } });
      setDirty(new Set());
      toast.success("تنظیمات ذخیره شد و سایت به‌روزرسانی می‌شود.");
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <Spinner />;

  return (
    <>
      <PageHeader
        title="تنظیمات سایت"
        description="محتوای عمومی، اطلاعات تماس و شاخص‌های صفحه اصلی"
        actions={
          canWrite && (
            <Button size="sm" onClick={save} disabled={saving || dirty.size === 0}>
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              ذخیره تغییرات {dirty.size > 0 && `(${dirty.size.toLocaleString("fa-IR")})`}
            </Button>
          )
        }
      />
      <fieldset disabled={!canWrite} className="space-y-6">
        {groups.map(([group, items]) => (
          <Panel key={group} title={groupLabels[group] ?? group}>
            <div className="space-y-6">
              {items.map((s) => (
                <div key={s.key}>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-deep-600">
                    {keyLabels[s.key] ?? s.key}
                    {!s.is_public && <span className="rounded-full bg-cloud px-2 py-0.5 text-[0.65rem] font-normal text-muted">خصوصی</span>}
                  </label>
                  <SettingEditor
                    setting={s}
                    value={values[s.key]}
                    onChange={(v) => {
                      setValues((prev) => ({ ...prev, [s.key]: v }));
                      setDirty((prev) => new Set(prev).add(s.key));
                    }}
                  />
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </fieldset>
    </>
  );
}
