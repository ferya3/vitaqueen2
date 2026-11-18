import { Panel, faDate } from "@/components/admin/ui";

const labels: Record<string, string> = {
  full_name: "نام و نام خانوادگی",
  name: "نام",
  company_name: "شرکت / فروشگاه",
  phone: "تلفن",
  email: "ایمیل",
  country: "کشور",
  province: "استان",
  city: "شهر",
  activity_type: "نوع فعالیت",
  request_type: "نوع درخواست",
  distribution_capacity: "ظرفیت توزیع",
  has_warehouse: "انبار اختصاصی",
  vehicle_count: "خودروی توزیع",
  subject: "موضوع",
  message: "پیام",
  locale: "زبان فرم",
  ip: "IP",
  created_at: "زمان ثبت",
};

const ltr = new Set(["phone", "email", "ip"]);

export function LeadDetails({ record }: { record: Record<string, unknown>; resourceKey: string }) {
  const entries = Object.keys(labels).filter((k) => record[k] !== undefined && record[k] !== null && record[k] !== "");
  return (
    <Panel title="جزئیات درخواست">
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {entries.map((key) => {
          const v = record[key];
          const display = key === "created_at" ? faDate(v, true) : typeof v === "boolean" ? (v ? "بله" : "خیر") : String(v);
          return (
            <div key={key} className={key === "message" ? "sm:col-span-2" : undefined}>
              <dt className="text-xs text-muted">{labels[key]}</dt>
              <dd className={`mt-1 text-sm font-medium whitespace-pre-line text-deep-600 ${ltr.has(key) ? "ltr-value" : ""}`}>
                {key === "phone" ? <a href={`tel:${display}`}>{display}</a> : key === "email" ? <a href={`mailto:${display}`}>{display}</a> : display}
              </dd>
            </div>
          );
        })}
      </dl>
    </Panel>
  );
}
