import type { Dictionary } from "@/lib/i18n/get-dictionary";

export interface NavItem {
  key: keyof Dictionary["nav"];
  path: string;
  description?: string;
}

export function mainNav(dict: Dictionary): NavItem[] {
  return [
    { key: "about", path: "/about", description: dict.navDesc.about },
    { key: "products", path: "/products", description: dict.navDesc.products },
    { key: "production", path: "/production", description: dict.navDesc.production },
    { key: "quality", path: "/quality", description: dict.navDesc.quality },
    { key: "partnership", path: "/representatives", description: dict.navDesc.partnership },
    { key: "news", path: "/news" },
    { key: "contact", path: "/contact" },
  ];
}
