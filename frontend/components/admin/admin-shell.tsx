"use client";

import {
  Activity,
  BarChart3,
  Boxes,
  ExternalLink,
  Factory,
  FileText,
  FolderTree,
  Handshake,
  Image as ImageIcon,
  LayoutDashboard,
  ListOrdered,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthProvider, useAuth } from "@/components/admin/auth-context";
import { LogoMark } from "@/components/layout/logo";
import { can } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const groups = [
  { title: null, items: [{ href: "/admin", label: "داشبورد", icon: LayoutDashboard, ability: null }] },
  {
    title: "محتوا",
    items: [
      { href: "/admin/products", label: "محصولات", icon: Boxes, ability: "products" },
      { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: FolderTree, ability: "categories" },
      { href: "/admin/articles", label: "اخبار و مقالات", icon: Newspaper, ability: "articles" },
      { href: "/admin/pages", label: "صفحات", icon: FileText, ability: "pages" },
      { href: "/admin/media", label: "رسانه", icon: ImageIcon, ability: "media" },
    ],
  },
  {
    title: "تولید و کیفیت",
    items: [
      { href: "/admin/production-lines", label: "خطوط تولید", icon: Factory, ability: "production_lines" },
      { href: "/admin/production-steps", label: "مراحل تولید", icon: ListOrdered, ability: "production_steps" },
      { href: "/admin/certificates", label: "استانداردها و گواهینامه‌ها", icon: ShieldCheck, ability: "certificates" },
    ],
  },
  {
    title: "فروش",
    items: [
      { href: "/admin/representatives", label: "درخواست‌های نمایندگی", icon: Handshake, ability: "representatives" },
      { href: "/admin/contact-requests", label: "پیام‌های تماس", icon: Mail, ability: "contact_requests" },
      { href: "/admin/reports", label: "گزارش‌ها", icon: BarChart3, ability: "reports" },
    ],
  },
  {
    title: "سیستم",
    items: [
      { href: "/admin/settings", label: "تنظیمات سایت", icon: Settings, ability: "settings" },
      { href: "/admin/users", label: "کاربران و نقش‌ها", icon: Users, ability: "users" },
      { href: "/admin/activity", label: "رویدادهای مدیریتی", icon: Activity, ability: "activity_logs" },
    ],
  },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <Link href="/admin" className="flex items-center gap-2 px-2 pt-2">
        <LogoMark className="size-8" />
        <span className="font-extrabold text-white">پنل مدیریت</span>
      </Link>
      {groups.map((group) => {
        const items = group.items.filter((i) => i.ability === null || can(user, i.ability));
        if (!items.length) return null;
        return (
          <div key={group.title ?? "main"}>
            {group.title && <p className="mb-2 px-3 text-[0.7rem] font-semibold text-white/40">{group.title}</p>}
            <ul className="space-y-0.5">
              {items.map(({ href, label, icon: Icon }) => {
                const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white",
                        active && "bg-water-500/15 font-semibold text-white",
                      )}
                    >
                      <Icon className={cn("size-[1.1rem]", active && "text-ice")} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <a href="/fa" target="_blank" className="mt-auto flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/50 hover:text-white">
        <ExternalLink className="size-4" />
        مشاهده وب‌سایت
      </a>
    </nav>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div className="min-h-screen bg-cloud lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-screen bg-deep-800 lg:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="بستن" className="absolute inset-0 bg-deep-900/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-72 bg-deep-800">
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-line bg-white/90 px-4 backdrop-blur md:px-8">
          <button className="grid size-10 place-items-center rounded-xl hover:bg-cloud lg:hidden" aria-label="منو" onClick={() => setOpen(true)}>
            {open ? <X /> : <Menu />}
          </button>
          <div className="ms-auto flex items-center gap-3">
            {loading && <Loader2 className="size-4 animate-spin text-water-500" />}
            <div className="text-end leading-tight">
              <p className="text-sm font-semibold text-deep-600">{user?.name}</p>
              <p className="text-xs text-muted">{user?.role_label}</p>
            </div>
            <span className="grid size-10 place-items-center rounded-full bg-water-500 font-bold text-white">{user?.name?.[0]}</span>
            <button onClick={logout} className="grid size-10 place-items-center rounded-xl text-muted hover:bg-cloud hover:text-danger" aria-label="خروج" title="خروج">
              <LogOut className="size-5" />
            </button>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Shell>{children}</Shell>
    </AuthProvider>
  );
}
