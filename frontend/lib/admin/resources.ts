/**
 * Declarative admin resources. Each entry drives the generic list page
 * (/admin/[resource]) and the create/edit form (/admin/[resource]/[id]).
 */

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "slug"
  | "color"
  | "date"
  | "datetime"
  | "switch"
  | "select"
  | "media"
  | "number-list"
  | "repeater"
  | "password";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  translatable?: boolean;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  /** Load select options from an admin endpoint (value = id, label = name). */
  optionsFrom?: { endpoint: string; labelKey: string };
  mediaType?: "image" | "document";
  fields?: FieldDef[]; // repeater sub-fields
  wide?: boolean;
  readOnly?: boolean;
  section?: string;
}

export type ColumnRender = "text" | "translated" | "bool" | "badge" | "date" | "datetime" | "volume" | "status";

export interface ColumnDef {
  key: string;
  label: string;
  render?: ColumnRender;
  badges?: Record<string, { label: string; tone: "water" | "success" | "warning" | "danger" | "muted" | "deep" }>;
}

export interface ResourceDef {
  key: string;
  title: string;
  singular: string;
  ability: string;
  endpoint: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  filters?: { key: string; label: string; options: { value: string; label: string }[] }[];
  canCreate?: boolean;
  /** Leads: details are read-only except a few editable fields. */
  readOnlyDetails?: boolean;
  exportable?: boolean;
  defaults?: Record<string, unknown>;
}

const yesNo = [
  { value: "true", label: "فعال" },
  { value: "false", label: "غیرفعال" },
];

const seoFields: FieldDef[] = [
  { name: "meta_title", label: "عنوان سئو (Meta title)", type: "text", translatable: true, section: "سئو", help: "حداکثر ۷۰ کاراکتر" },
  { name: "meta_description", label: "توضیح سئو (Meta description)", type: "textarea", translatable: true, section: "سئو", help: "حداکثر ۱۷۰ کاراکتر" },
];

export const repStatuses = {
  new: { label: "جدید", tone: "water" },
  reviewing: { label: "در حال بررسی", tone: "warning" },
  contacted: { label: "تماس گرفته شد", tone: "deep" },
  approved: { label: "تأیید شده", tone: "success" },
  rejected: { label: "رد شده", tone: "danger" },
} as const;

export const contactStatuses = {
  new: { label: "جدید", tone: "water" },
  read: { label: "خوانده شده", tone: "muted" },
  answered: { label: "پاسخ داده شد", tone: "success" },
  archived: { label: "بایگانی", tone: "muted" },
} as const;

const activityTypes = [
  { value: "distributor", label: "پخش‌کننده" },
  { value: "wholesaler", label: "عمده‌فروش" },
  { value: "retailer", label: "خرده‌فروش" },
  { value: "exporter", label: "صادرکننده / واردکننده" },
  { value: "organization", label: "مشتری سازمانی" },
];

const certTypes = [
  { value: "certificate", label: "گواهینامه" },
  { value: "lab_report", label: "گزارش آزمایش" },
  { value: "standard", label: "استاندارد" },
];

export const resources: Record<string, ResourceDef> = {
  products: {
    key: "products",
    title: "محصولات",
    singular: "محصول",
    ability: "products",
    endpoint: "products",
    canCreate: true,
    defaults: { is_active: true, bottle_material: "PET", sort_order: 0 },
    columns: [
      { key: "name", label: "نام", render: "translated" },
      { key: "volume_ml", label: "حجم", render: "volume" },
      { key: "sku", label: "کد" },
      { key: "is_featured", label: "ویژه", render: "bool" },
      { key: "is_active", label: "وضعیت", render: "bool" },
    ],
    filters: [
      { key: "is_active", label: "وضعیت", options: yesNo },
      { key: "is_featured", label: "ویژه", options: [{ value: "true", label: "ویژه" }, { value: "false", label: "عادی" }] },
    ],
    fields: [
      { name: "name", label: "نام محصول", type: "text", translatable: true, required: true, section: "اطلاعات اصلی" },
      { name: "slug", label: "نامک (URL)", type: "slug", required: true, section: "اطلاعات اصلی", help: "مثلاً mineral-water-500ml" },
      { name: "category_id", label: "دسته‌بندی", type: "select", optionsFrom: { endpoint: "categories?per_page=100", labelKey: "name" }, section: "اطلاعات اصلی" },
      { name: "sku", label: "کد محصول (SKU)", type: "text", section: "اطلاعات اصلی" },
      { name: "short_description", label: "توضیح کوتاه", type: "textarea", translatable: true, section: "اطلاعات اصلی", wide: true },
      { name: "description", label: "توضیحات کامل", type: "richtext", translatable: true, section: "اطلاعات اصلی", wide: true },
      { name: "volume_ml", label: "حجم (میلی‌لیتر)", type: "number", required: true, section: "مشخصات و بسته‌بندی" },
      {
        name: "bottle_material",
        label: "جنس بطری",
        type: "select",
        section: "مشخصات و بسته‌بندی",
        options: [
          { value: "PET", label: "PET" },
          { value: "Glass", label: "شیشه" },
          { value: "PC", label: "PC" },
          { value: "Can", label: "قوطی" },
        ],
      },
      { name: "units_per_pack", label: "تعداد در بسته", type: "number", section: "مشخصات و بسته‌بندی" },
      { name: "packs_per_pallet", label: "بسته در پالت", type: "number", section: "مشخصات و بسته‌بندی" },
      { name: "shelf_life_months", label: "ماندگاری (ماه)", type: "number", section: "مشخصات و بسته‌بندی" },
      { name: "barcode", label: "بارکد", type: "text", section: "مشخصات و بسته‌بندی" },
      { name: "accent_color", label: "رنگ شاخص", type: "color", section: "مشخصات و بسته‌بندی", help: "رنگ لیبل در نمایش سه‌بعدی" },
      {
        name: "specs",
        label: "مشخصات فنی",
        type: "repeater",
        section: "مشخصات و بسته‌بندی",
        wide: true,
        fields: [
          { name: "label", label: "عنوان", type: "text", translatable: true },
          { name: "value", label: "مقدار", type: "text", translatable: true },
        ],
      },
      { name: "ph", label: "pH", type: "number", section: "آنالیز آب (از گزارش رسمی آزمایشگاه)" },
      { name: "tds", label: "TDS (mg/L)", type: "number", section: "آنالیز آب (از گزارش رسمی آزمایشگاه)" },
      {
        name: "mineral_composition",
        label: "ترکیب املاح",
        type: "repeater",
        section: "آنالیز آب (از گزارش رسمی آزمایشگاه)",
        wide: true,
        fields: [
          {
            name: "key",
            label: "ماده",
            type: "select",
            options: ["calcium", "magnesium", "sodium", "potassium", "bicarbonate", "sulfate", "chloride", "nitrate", "fluoride", "silica"].map((v) => ({ value: v, label: v })),
          },
          { name: "value", label: "مقدار", type: "number" },
          { name: "unit", label: "واحد", type: "text" },
        ],
      },
      { name: "is_featured", label: "نمایش در صفحه اصلی", type: "switch", section: "انتشار" },
      { name: "is_active", label: "فعال", type: "switch", section: "انتشار" },
      { name: "sort_order", label: "ترتیب نمایش", type: "number", section: "انتشار" },
      ...seoFields,
    ],
  },

  categories: {
    key: "categories",
    title: "دسته‌بندی‌ها",
    singular: "دسته‌بندی",
    ability: "categories",
    endpoint: "categories",
    canCreate: true,
    defaults: { is_active: true, sort_order: 0 },
    columns: [
      { key: "name", label: "نام", render: "translated" },
      { key: "slug", label: "نامک" },
      { key: "products_count", label: "تعداد محصول" },
      { key: "is_active", label: "وضعیت", render: "bool" },
    ],
    fields: [
      { name: "name", label: "نام", type: "text", translatable: true, required: true },
      { name: "slug", label: "نامک", type: "slug", required: true },
      { name: "description", label: "توضیحات", type: "textarea", translatable: true, wide: true },
      { name: "sort_order", label: "ترتیب", type: "number" },
      { name: "is_active", label: "فعال", type: "switch" },
    ],
  },

  articles: {
    key: "articles",
    title: "اخبار و مقالات",
    singular: "مطلب",
    ability: "articles",
    endpoint: "articles",
    canCreate: true,
    defaults: { type: "news", is_published: false },
    columns: [
      { key: "title", label: "عنوان", render: "translated" },
      { key: "type", label: "نوع", render: "badge", badges: { news: { label: "خبر", tone: "water" }, article: { label: "مقاله", tone: "deep" } } },
      { key: "is_published", label: "منتشر شده", render: "bool" },
      { key: "published_at", label: "تاریخ انتشار", render: "date" },
    ],
    filters: [
      { key: "type", label: "نوع", options: [{ value: "news", label: "خبر" }, { value: "article", label: "مقاله" }] },
      { key: "is_published", label: "انتشار", options: [{ value: "true", label: "منتشر شده" }, { value: "false", label: "پیش‌نویس" }] },
    ],
    fields: [
      { name: "title", label: "عنوان", type: "text", translatable: true, required: true, section: "محتوا" },
      { name: "slug", label: "نامک", type: "slug", required: true, section: "محتوا" },
      { name: "type", label: "نوع", type: "select", options: [{ value: "news", label: "خبر" }, { value: "article", label: "مقاله" }], section: "محتوا" },
      { name: "cover_path", label: "تصویر شاخص", type: "media", mediaType: "image", section: "محتوا" },
      { name: "excerpt", label: "خلاصه", type: "textarea", translatable: true, section: "محتوا", wide: true },
      { name: "body", label: "متن کامل", type: "richtext", translatable: true, section: "محتوا", wide: true },
      { name: "is_published", label: "منتشر شود", type: "switch", section: "انتشار" },
      { name: "published_at", label: "زمان انتشار", type: "datetime", section: "انتشار", help: "خالی = همین الان" },
      ...seoFields,
    ],
  },

  pages: {
    key: "pages",
    title: "صفحات",
    singular: "صفحه",
    ability: "pages",
    endpoint: "pages",
    canCreate: true,
    defaults: { is_published: true },
    columns: [
      { key: "title", label: "عنوان", render: "translated" },
      { key: "slug", label: "نامک" },
      { key: "is_published", label: "منتشر شده", render: "bool" },
      { key: "updated_at", label: "آخرین ویرایش", render: "date" },
    ],
    fields: [
      { name: "title", label: "عنوان", type: "text", translatable: true, required: true },
      { name: "slug", label: "نامک", type: "slug", required: true, help: "صفحات سیستمی: about، export، privacy" },
      { name: "cover_path", label: "تصویر", type: "media", mediaType: "image" },
      { name: "excerpt", label: "خلاصه", type: "textarea", translatable: true, wide: true },
      { name: "body", label: "متن", type: "richtext", translatable: true, wide: true },
      { name: "is_published", label: "منتشر شده", type: "switch" },
      ...seoFields,
    ],
  },

  certificates: {
    key: "certificates",
    title: "گواهینامه‌ها و گزارش‌ها",
    singular: "مدرک",
    ability: "certificates",
    endpoint: "certificates",
    canCreate: true,
    defaults: { type: "certificate", is_active: true, sort_order: 0 },
    columns: [
      { key: "title", label: "عنوان", render: "translated" },
      { key: "type", label: "نوع", render: "badge", badges: { certificate: { label: "گواهینامه", tone: "water" }, lab_report: { label: "گزارش آزمایش", tone: "deep" }, standard: { label: "استاندارد", tone: "success" } } },
      { key: "expires_at", label: "اعتبار تا", render: "date" },
      { key: "is_active", label: "وضعیت", render: "bool" },
    ],
    filters: [{ key: "type", label: "نوع", options: certTypes }],
    fields: [
      { name: "title", label: "عنوان", type: "text", translatable: true, required: true },
      { name: "type", label: "نوع", type: "select", options: certTypes, required: true },
      { name: "issuer", label: "مرجع صدور", type: "text", translatable: true },
      { name: "certificate_number", label: "شماره", type: "text" },
      { name: "issued_at", label: "تاریخ صدور", type: "date" },
      { name: "expires_at", label: "تاریخ انقضا", type: "date" },
      { name: "image_path", label: "تصویر مدرک", type: "media", mediaType: "image" },
      { name: "file_path", label: "فایل PDF قابل دانلود", type: "media", mediaType: "document" },
      { name: "description", label: "توضیحات", type: "textarea", translatable: true, wide: true },
      { name: "sort_order", label: "ترتیب", type: "number" },
      { name: "is_active", label: "فعال", type: "switch" },
    ],
  },

  "production-lines": {
    key: "production-lines",
    title: "خطوط تولید",
    singular: "خط تولید",
    ability: "production_lines",
    endpoint: "production-lines",
    canCreate: true,
    defaults: { is_active: true, sort_order: 0, bottle_sizes: [] },
    columns: [
      { key: "name", label: "نام", render: "translated" },
      { key: "capacity_per_hour", label: "ظرفیت (بطری/ساعت)" },
      { key: "is_active", label: "وضعیت", render: "bool" },
    ],
    fields: [
      { name: "name", label: "نام خط", type: "text", translatable: true, required: true },
      { name: "capacity_per_hour", label: "ظرفیت اسمی (بطری در ساعت)", type: "number", help: "عدد واقعی پلاک دستگاه" },
      { name: "bottle_sizes", label: "سایزهای قابل تولید (میلی‌لیتر)", type: "number-list" },
      { name: "technology", label: "فناوری", type: "text", translatable: true, wide: true },
      { name: "description", label: "توضیحات", type: "textarea", translatable: true, wide: true },
      { name: "image_path", label: "تصویر", type: "media", mediaType: "image" },
      { name: "sort_order", label: "ترتیب", type: "number" },
      { name: "is_active", label: "فعال", type: "switch" },
    ],
  },

  "production-steps": {
    key: "production-steps",
    title: "مراحل تولید",
    singular: "مرحله",
    ability: "production_steps",
    endpoint: "production-steps",
    canCreate: true,
    defaults: { is_active: true, sort_order: 0 },
    columns: [
      { key: "sort_order", label: "#" },
      { key: "title", label: "عنوان", render: "translated" },
      { key: "key", label: "کلید" },
      { key: "is_active", label: "وضعیت", render: "bool" },
    ],
    fields: [
      { name: "title", label: "عنوان", type: "text", translatable: true, required: true },
      { name: "key", label: "کلید یکتا", type: "slug", required: true },
      {
        name: "icon",
        label: "آیکون",
        type: "select",
        options: ["droplet", "filter", "sun", "flask", "bottle", "tag", "package", "shield-check"].map((v) => ({ value: v, label: v })),
      },
      { name: "description", label: "توضیحات", type: "textarea", translatable: true, wide: true },
      { name: "image_path", label: "تصویر", type: "media", mediaType: "image" },
      { name: "sort_order", label: "ترتیب", type: "number" },
      { name: "is_active", label: "فعال", type: "switch" },
    ],
  },

  representatives: {
    key: "representatives",
    title: "درخواست‌های نمایندگی",
    singular: "درخواست",
    ability: "representatives",
    endpoint: "representatives",
    readOnlyDetails: true,
    exportable: true,
    columns: [
      { key: "full_name", label: "نام" },
      { key: "phone", label: "تلفن" },
      { key: "province", label: "استان" },
      { key: "city", label: "شهر" },
      { key: "activity_type", label: "نوع فعالیت", render: "badge", badges: Object.fromEntries(activityTypes.map((a) => [a.value, { label: a.label, tone: "muted" as const }])) },
      { key: "status", label: "وضعیت", render: "status", badges: repStatuses as never },
      { key: "created_at", label: "تاریخ", render: "date" },
    ],
    filters: [
      { key: "status", label: "وضعیت", options: Object.entries(repStatuses).map(([value, v]) => ({ value, label: v.label })) },
      { key: "activity_type", label: "نوع فعالیت", options: activityTypes },
    ],
    fields: [
      { name: "status", label: "وضعیت", type: "select", options: Object.entries(repStatuses).map(([value, v]) => ({ value, label: v.label })) },
      { name: "assigned_to", label: "کارشناس مسئول", type: "select", optionsFrom: { endpoint: "users?per_page=100", labelKey: "name" } },
      { name: "admin_notes", label: "یادداشت داخلی", type: "textarea", wide: true },
    ],
  },

  "contact-requests": {
    key: "contact-requests",
    title: "پیام‌های تماس",
    singular: "پیام",
    ability: "contact_requests",
    endpoint: "contact-requests",
    readOnlyDetails: true,
    columns: [
      { key: "name", label: "نام" },
      { key: "phone", label: "تلفن" },
      { key: "email", label: "ایمیل" },
      {
        key: "request_type",
        label: "نوع",
        render: "badge",
        badges: {
          general: { label: "عمومی", tone: "muted" },
          wholesale: { label: "عمده", tone: "water" },
          export: { label: "صادرات", tone: "deep" },
          organization: { label: "سازمانی", tone: "water" },
          complaint: { label: "انتقاد", tone: "warning" },
        },
      },
      { key: "status", label: "وضعیت", render: "status", badges: contactStatuses as never },
      { key: "created_at", label: "تاریخ", render: "date" },
    ],
    filters: [{ key: "status", label: "وضعیت", options: Object.entries(contactStatuses).map(([value, v]) => ({ value, label: v.label })) }],
    fields: [
      { name: "status", label: "وضعیت", type: "select", options: Object.entries(contactStatuses).map(([value, v]) => ({ value, label: v.label })) },
      { name: "admin_notes", label: "یادداشت داخلی", type: "textarea", wide: true },
    ],
  },

  users: {
    key: "users",
    title: "کاربران",
    singular: "کاربر",
    ability: "users",
    endpoint: "users",
    canCreate: true,
    defaults: { role: "content_manager", is_active: true },
    columns: [
      { key: "name", label: "نام" },
      { key: "email", label: "ایمیل" },
      { key: "role_label", label: "نقش" },
      { key: "last_login_at", label: "آخرین ورود", render: "datetime" },
      { key: "is_active", label: "وضعیت", render: "bool" },
    ],
    fields: [
      { name: "name", label: "نام", type: "text", required: true },
      { name: "email", label: "ایمیل", type: "text", required: true },
      { name: "password", label: "رمز عبور", type: "password", help: "حداقل ۱۰ کاراکتر شامل حرف و عدد. برای حفظ رمز فعلی خالی بگذارید." },
      {
        name: "role",
        label: "نقش",
        type: "select",
        required: true,
        options: [
          { value: "super_admin", label: "مدیر کل" },
          { value: "content_manager", label: "مدیر محتوا" },
          { value: "sales_manager", label: "مسئول فروش" },
          { value: "qc_manager", label: "مسئول کنترل کیفیت" },
        ],
      },
      { name: "is_active", label: "فعال", type: "switch" },
    ],
  },
};
