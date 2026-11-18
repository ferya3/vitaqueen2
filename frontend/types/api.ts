// Types mirror the Laravel API resources (backend/app/Http/Resources).

export type Translations = Partial<Record<"fa" | "en" | "ar", string | null>>;

export interface Stat {
  key: string;
  value: number;
  suffix: string | null;
  label: string;
}

export interface SiteSettings {
  site: { name: string; legal_name: string; tagline: string; description: string };
  hero: { title: string; subtitle: string; video_url: string | null; poster_url: string | null };
  stats: Stat[];
  contact: {
    phone: string;
    sales_phone: string;
    email: string;
    sales_email: string;
    address: string;
    working_hours: string;
    map: { lat: number; lng: number; zoom: number } | null;
  };
  social: Partial<Record<"instagram" | "linkedin" | "telegram" | "whatsapp" | "aparat", string | null>>;
  seo: { title_suffix: string; keywords: string };
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  products_count?: number;
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface Mineral {
  key: string;
  value: number;
  unit: string | null;
}

export interface Product {
  id: number;
  slug: string;
  sku: string | null;
  name: string;
  short_description: string | null;
  description: string | null;
  volume_ml: number;
  size_class: "small" | "medium" | "large";
  bottle_material: string;
  units_per_pack: number | null;
  packs_per_pallet: number | null;
  shelf_life_months: number | null;
  ph: number | null;
  tds: number | null;
  mineral_composition: Mineral[];
  specs: { label: string; value: string }[];
  barcode: string | null;
  accent_color: string | null;
  is_featured: boolean;
  category?: Category | null;
  image?: ProductImage | null;
  images?: ProductImage[];
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string;
}

export interface ProductionStep {
  id: number;
  key: string;
  title: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface ProductionLine {
  id: number;
  name: string;
  description: string | null;
  technology: string | null;
  capacity_per_hour: number | null;
  bottle_sizes: number[];
  image_url: string | null;
}

export interface Certificate {
  id: number;
  type: "certificate" | "lab_report" | "standard";
  title: string;
  issuer: string | null;
  description: string | null;
  certificate_number: string | null;
  issued_at: string | null;
  expires_at: string | null;
  is_expired: boolean;
  image_url: string | null;
  file_url: string | null;
}

export interface Article {
  id: number;
  slug: string;
  type: "news" | "article";
  title: string;
  excerpt: string | null;
  body?: string | null;
  cover_url: string | null;
  author?: string | null;
  published_at: string | null;
  reading_minutes: number;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string;
}

export interface PageSection {
  type: string;
  title?: string;
  body?: string;
  items?: (string | { year?: string; title?: string; body?: string })[];
}

export interface Page {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  sections: PageSection[];
  cover_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string;
}

export interface HomePayload {
  settings: SiteSettings;
  products: Product[];
  production_steps: ProductionStep[];
  certificates: Certificate[];
  articles: Article[];
}

export interface Paginated<T> {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}
